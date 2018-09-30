const cluster = require('cluster');

const requestGenerator = require('../helper/requestGenerator');

const testWithIteration = async (workerInfos) => {
    console.log(process.env)
    const getRequest = requestGenerator('GET', process.env.API_URL, 10, 100);


    workers = {};
    Object.entries(workerInfos).forEach(
        ([key, value]) => {
            workers[key] = cluster.fork({ name: value });
    });

    console.time('request');
    
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

    const filteredAns = ans.filter( (datum) => { return datum });
    const refinedAns = filteredAns.map( (datum) => { return datum.data.message });
    workers['worker1'].send({ data: refinedAns });

    console.log(ans.map((elem) => { 
        return elem ? elem.data.message : -1}));
    console.timeEnd('request');
}

const run = async (workers) => {
    await testWithIteration(workers);
}

module.exports = run;