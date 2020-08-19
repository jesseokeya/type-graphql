import { Response, Request } from 'express'
import { Connection } from "typeorm";
import { Redis } from "ioredis";
import { Logger } from "pino"; 
import { Server } from "net";

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

export interface loginContext {
    req: Request
}