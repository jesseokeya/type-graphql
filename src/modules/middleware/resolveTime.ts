
import { MiddlewareFn } from "type-graphql";
import { logger } from '../../utils/logManager'

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
    const start = Date.now();
    await next();
    const resolveTime = Date.now() - start;
    logger.info(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};