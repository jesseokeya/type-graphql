import { Response, Request } from 'express'
import { Connection } from "typeorm";
import { Redis } from "ioredis";
import { Logger } from "pino"; 
import { Server } from "net";
import { Stream } from "stream";

import { createAuthorsLoader } from "../utils/authorsLoader";

export type expressContext = {
    req: Request,
    res: Response
}

export interface ShutdownOptions {
    db: Connection;
    redisClient: Redis;
    logger: Logger;
    nodeServer: Server;
}

export interface MyContext {
    req: Request
    res: Response
    authorsLoader: ReturnType<typeof createAuthorsLoader>;
}

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}