const cluster = require('cluster');

const requestGenerator = require('../helper/requestGenerator');

const testWithIteration = async (workerInfos) => {

    workers = {};
    Object.entries(workerInfos).forEach(
        ([key, value]) => {
            workers[key] = cluster.fork({ name: value });
    });

    console.time('request');

    workers['worker1'].on('message', (msg) => {
        console.log('::: ', msg);
    });

    console.timeEnd('request');
}

const run = async (workers) => {
    await testWithIteration(workers);
}

module.exports = run;