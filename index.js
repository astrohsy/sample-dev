const cluster = require('cluster');
require('dotenv').config();

/* import sub processes */
const runMaster = require('./src/master');
const runWorker1 = require('./src/worker1');
const runWorker2 = require('./src/worker2');

const workerInfos = {
    worker1: 'worker1',
    worker2: 'worker2'
};

const main = async () => {
    if (cluster.isMaster) {
        runMaster(workerInfos);
    }

    if (cluster.isWorker) {
        if (process.env.name === workerInfos['worker1']) {
            runWorker1();
        }

        else if (process.env.name === workerInfos['worker2']) {
            runWorker2();
        }
    }
}



//testWithIteration();
main();