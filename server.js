import cluster from 'cluster'
import os from 'os'
import logger from './utils/logger'

const numCpus = os.cpus().length;

logger.info(`Current ENV: ${process.env.NODE_ENV}`);

if (cluster.isMaster) {
    logger.info(`Master process ID: ${process.pid}`);
    for ( let i=0; i < numCpus; i++) {
        cluster.fork() // Start a new app process for each CPU
    }

    // Add a handler to restart dying workers
    cluster.on('exit', (worker) => {
        logger.info(`Worker process ID: ${worker.process.id} - Exited. Starting new worker`)
        cluster.fork();
    })
} else {
    require('./bin/www');
}

