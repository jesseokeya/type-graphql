import { createConnection } from 'typeorm'

export const testConn = (drop: boolean = false) => {
    return createConnection({
        name: "test",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "typegraphql-example",
        synchronize: drop,
        dropSchema: drop,
        logging: true,
        entities: [__dirname + "/../entity/*.*"]
    })
}