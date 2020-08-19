import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import * as Express from 'express'
import { buildSchema, Resolver, Query } from 'type-graphql'

@Resolver()
class HelloResolver {
    @Query(() => String, { name: 'helloWorld', description: "testing!!" })
    async hello() {
        return 'Hello World!'
    }

}

const main = async () => {
    const PORT = process.env.PORT || 4000

    const schema = await buildSchema({
        resolvers: [HelloResolver]
    })

    const apolloServer = new ApolloServer({
        schema
    })

    const app = Express()

    apolloServer.applyMiddleware({ app })

    app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}${apolloServer.graphqlPath}`))
}

main()