import * as pino from "pino";

const logManager = (): pino.Logger => {
    const loggingInstance = pino(
        { prettyPrint: { colorize: true } },
        process.stdout
    );
    const lNow = new Date().toLocaleString();
    loggingInstance.info(`Logging initialized at ${lNow}`);

    return loggingInstance;
};

const logger = logManager()

export { logger }