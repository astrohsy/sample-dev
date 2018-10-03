const requestGenerator = require('../helper/requestGenerator');
const fs = require('fs');

const batchSize = 20;

const run = async () => {
    let readyQueue = [];

    reqeustRoutine(readyQueue)

    setInterval(processRoutine.bind(null, readyQueue), 100);

    process.on('message', (msg) => {
    });

}

const processRoutine = async (readyQueue) => {
    if (readyQueue.length >= batchSize) {
        console.log(readyQueue.splice(0, batchSize));
    }
}

const reqeustRoutine = async (readyQueue) => {
    const customRequest = requestGenerator(1, 0);

    const configGenerator = (id) => {
        return {
            method: 'GET',
            url: process.env.API_URL + '/' + id
        };
    }

    // 무한루프
    for (var iter = 1; iter; iter++) {
        let arrayOfPromises = [];
        for (var i = 0; i < 20; i++) {
            arrayOfPromises.push(
                customRequest(configGenerator(i))
            );
        }

        let ans = [];
        try {
            ans = await Promise.all(arrayOfPromises);
        } catch (error) {
            console.log(error);
        }

        const unhandledAns = ans.filter( (datum) => { return datum.status; });
        const filteredAns = ans.filter( (datum) => { return datum.status !== undefined });
        const refinedAns = filteredAns.map( (datum) => { return datum.data.message });

        if (unhandledAns.length > 0) handleError(unhandledAns, readyQueue);
        readyQueue.push(...refinedAns);
    }
}

const handleError = async(errors, readyQueue) => {
    const customRequest = requestGenerator(10, 1);

    const arrayOfPromises = errors.map( (error) => {
        return customRequest(error.config);
    });

    let ans = [];
    try {
        ans = await Promise.all(arrayOfPromises);
    } catch (error) {
        console.log(error);
    }

    //console.log(ans.map( (datum) => { return datum.status }));

    const filteredAns = ans.filter( (datum) => { return datum.status });
    const refinedAns = filteredAns.map( (datum) => { return datum.data.message });

    fs.appendFileSync('./log/worker1.error.log', refinedAns);
    fs.appendFileSync('./log/worker1.error.log', '\n');
    readyQueue.push(...refinedAns);
}

module.exports = run;