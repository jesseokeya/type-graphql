import { Connection, createConnection, getConnectionOptions } from "typeorm";
import { logger } from "./utils/logManager";

export const createTypeormConn = async (): Promise<Connection | null> => {
    let retries = 5; 
    while (retries) {
        try {
            const config = await getConnectionOptions(process.env.NODE_ENV);
            const secureConfig = {
                ...config,
                name: "default",
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
            };
            return createConnection(secureConfig);
        } catch (err) {
            logger.error(err);
            retries -= 1;
            logger.info(`retries left: ${retries}`);
            // wait 5 seconds
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    return null;
};