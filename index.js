const cluster = require('cluster');

/* import sub processes */
const runMaster = require('./src/master');
const runWorker1 = require('./src/worker1');


const main = async () => {
    if (cluster.isMaster) {
        runMaster();
        var worker1 = cluster.fork({ name: 'worker1' });
        var worker2 = cluster.fork({ name: 'worker2' });
    }

    if (cluster.isWorker) {
        if (process.env.name == 'worker1') {
            runWorker1();
        }

        if (process.env.name == 'worker2') {
            console.log('hehe');
        }
    }
}



//testWithIteration();
main();