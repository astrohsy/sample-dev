const cluster = require('cluster');

const requestGenerator = require('../helper/requestGenerator');

const testWithIteration = async (workerInfos) => {
    const getRequest = requestGenerator('GET', process.env.API_URL, 1, 0);

    workers = {};
    Object.entries(workerInfos).forEach(
        ([key, value]) => {
            workers[key] = cluster.fork({ name: value });
    });

    console.time('request');

    workers['worker1'].on('message', (msg) => {
        console.log('::: ', msg);
    });

    // 무한루프
    for (var iter = 1; iter; iter++) {
        let arrayOfPromises = [];
        for (var i = 0; i < 10; i++) {
            arrayOfPromises.push(getRequest(i));
        }
    
        let ans = [];
        try {
            ans = await Promise.all(arrayOfPromises);
        } catch (error) {
            //console.log(error);
        }
    
        const unhandledAns = ans.filter( (datum) => { return datum.status === undefined });
        const filteredAns = ans.filter( (datum) => { return datum.status });
        const refinedAns = filteredAns.map( (datum) => { return datum.data.message });

        handleError(unhandledAns, workers['worker1']);
        workers['worker1'].send({ retry: false, data: refinedAns });
    }

    console.timeEnd('request');
}

const handleError = async(errors, worker) => {
    const getRequest = requestGenerator('GET', process.env.API_URL, 10, 100);

    let arrayOfPromises = [];
        for (var i = 0; i < 10; i++) {
            arrayOfPromises.push(getRequest(i));
        }
    
        let ans = [];
        try {
            ans = await Promise.all(arrayOfPromises);
        } catch (error) {
            console.log(error);
        }

        const filteredAns = ans.filter( (datum) => { return datum.status });
        const refinedAns = filteredAns.map( (datum) => { return datum.data.message });
        worker.send({ retry: true, data: refinedAns })
}

const run = async (workers) => {
    await testWithIteration(workers);
}

module.exports = run;