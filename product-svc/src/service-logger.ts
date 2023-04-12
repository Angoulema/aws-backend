import pino from 'pino';

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    timestamp: pino.stdTimeFunctions.isoTime
  }
});
export const serviceLogger = logger.child({ service: 'product-service'});

export default serviceLogger;
