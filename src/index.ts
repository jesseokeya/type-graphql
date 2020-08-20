import 'reflect-metadata'
import Express from 'express'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import cors from 'cors'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { getConnection } from "typeorm";
import { config } from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { createAuthorsLoader } from './utils/authorsLoader';

import { createTypeormConn } from './createTypeormConn'
import { logger } from './utils/logManager'
import { redis } from './redis'
import { expressContext } from './typings'
import { gracefulShutdown } from "./utils/shutdown";
import { createSchema } from './utils/createSchema';
import { plugins } from './utils/plugins'

const main = async () => {
    const start: number = Date.now();
    const sessionSecret: string = process.env.SESSION_SECRET || 'superSecureSecret'
    const RedisStore = connectRedis(session), PORT = process.env.PORT || 4000

    // load environment variables
    config()

    // create postgres database connection via typeorm
    const conn = await createTypeormConn()
    if (conn) await conn.runMigrations()

    // build graphql schemas
    const schema = await createSchema()

    // start apollo graphql server
    const apolloServer = new ApolloServer({
        schema,
        plugins: plugins(schema),
        engine: {
            reportSchema: true,
            // @ts-ignore
            variant: "current"
        },
        context: ({ req, res }: expressContext) => ({ req, res, authorsLoader: createAuthorsLoader() })
    })

    // start express server
    const app = Express()

    // register express middlewares
    app.set('trust proxy', 1)
    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000'
        })
    )

    app.use(
        session({
            store: new RedisStore({
                client: redis as any
            }),
            name: 'qid',
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
            }
        })
    )

    app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

    apolloServer.applyMiddleware({ app, cors: false })


    const resolveTime = Date.now() - start;
    // S.S.T is abbreviation for server startup time 
    const nodeServer = app.listen(PORT, () =>
        logger.info(`🚀 Server running on port http://localhost:${PORT}${apolloServer.graphqlPath}. S.S.T -> ${resolveTime}ms`)
    )

    gracefulShutdown({
        db: getConnection(),
        redisClient: redis,
        logger,
        nodeServer,
    });
}

main()