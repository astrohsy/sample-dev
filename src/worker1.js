const requestGenerator = require('../helper/requestGenerator');
const fs = require('fs');
const uuid = require('uuid/v4');

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
        const ans = readyQueue.splice(0, batchSize);

        ans.map( (data) => {
            const fileName = uuid();
            data.pipe(fs.createWriteStream(`./image/${fileName}`));
        });
    }
}

const reqeustRoutine = async (readyQueue) => {
    const customRequest = requestGenerator(1, 0);

    const configGenerator = (id) => {
        return {
            method: 'GET',
            url: process.env.API_URL,
            // responseType: 'stream'
        };
    }

    // 무한루프
    for (var iter = 1; iter; iter++) {
        let arrayOfPromises = [];
        for (var i = 0; i < batchSize; i++) {
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

        // Change
        const refinedAns = filteredAns.map( (datum) => { return datum.data });

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

    // Change
    const refinedAns = filteredAns.map( (datum) => { return datum.data });

    fs.appendFileSync('./log/worker1.error.log', refinedAns);
    fs.appendFileSync('./log/worker1.error.log', '\n');
    readyQueue.push(...refinedAns);
}

module.exports = run;