import 'reflect-metadata'
import * as Express from 'express'
import * as cors from 'cors';
import { config } from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { createTypeormConn } from './createTypeormConn';
import { logger } from './utils/logManager';
import { RegisterResolver } from './modules/user/Register';

const main = async () => {
    const PORT = process.env.PORT || 4000

    // load environment variables
    config()

    // create postgres database connection via typeorm
    const conn = await createTypeormConn();
    if (conn) await conn.runMigrations();

    // build graphql schemas
    const schema = await buildSchema({
        resolvers: [RegisterResolver]
    })

    // start apollo graphql server
    const apolloServer = new ApolloServer({
        schema
    })

    // start express server
    const app = Express()

    // register express middlewares
    app.set('trust proxy', 1);
    app.use(
        cors({
            credentials: true,
            // origin:
            //     process.env.NODE_ENV === 'production'
            //         ? 'https://www.codeponder.com'
            //         : 'http://localhost:3000',
        })
    );

    apolloServer.applyMiddleware({ app, cors: false })

    app.listen(PORT, () => logger.info(`🚀 Server running on port http://localhost:${PORT}${apolloServer.graphqlPath}`))
}

main()