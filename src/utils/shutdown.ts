import pino from 'pino'
import { ShutdownOptions } from '../typings'

// That all logging gets performed before process exit.
const shutdown = async (config: ShutdownOptions): Promise<void> => {
    config.logger.warn('Shutting down HTTP server.')
    config.nodeServer.close(() => {
        config.logger.warn('HTTP server closed.')
        config.redisClient.disconnect()
        config.logger.warn('Redis disconnected.')

        config.db.close().then(() => {
            config.logger.warn('Database disconnected.')
            const finalLogger = pino.final(config.logger)
            finalLogger.info('Graceful shutdown was successfully completed.')
            process.exit(1)
        })
    })
}

export const gracefulShutdown = (config: ShutdownOptions): void => {
    process.on('uncaughtException', err => {
        config.logger.error(err, 'Uncaught Exception')
        shutdown(config)
    })
    process.on('unhandledRejection', _ => {
        config.logger.error('Uncaught Rejection')
        shutdown(config)
    })
    process.on('SIGINT', async context => {
        config.logger.warn(context, 'Node process terminated via SIGINT...')
        shutdown(config)
    })
}