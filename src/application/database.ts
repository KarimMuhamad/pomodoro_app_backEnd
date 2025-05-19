import { PrismaClient } from '@prisma/client';
import logger from "./logging";

export const prisma = new PrismaClient({
    log: [
        {level: 'query', emit: 'event'},
        {level: 'info', emit: 'event'},
        { level: 'warn', emit: 'event'},
        { level: 'error', emit: 'event'}
    ]
});

prisma.$on('warn', (e) => {
    logger.warn('Prisma Warning', {
        message: e.message,
        target: e.target,
    });
});

prisma.$on('error', (e) => {
    logger.error('Prisma Error', {
        message: e.message,
        target: e.target,
    })
});

prisma.$on('info', (e) => {
    logger.info('Prisma Info', {
        message: e.message
    })
});


if (process.env.NODE_ENV !== 'production') {
    prisma.$on('query', (e) => {
        logger.debug('Prisma Query', {
            query: e.query,
            params: e.params,
            duration: `${e.duration}ms`,
        });
    });
}


export default prisma;