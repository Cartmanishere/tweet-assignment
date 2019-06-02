import appRoot from 'app-root-path'
import winston, {exitOnError, transports} from 'winston'

var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/server.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 10,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }
}

var logger = new winston.createLogger({
    transports: process.env.NODE_ENV === 'production' ?
        [ new winston.transports.File(options.file) ] :
        [ new winston.transports.File(options.file), new winston.transports.Console(options.console)],
    exitOnError: false
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message)
    }
}

export default logger