const requestGenerator = require('../helper/requestGenerator');

const batchSize = 5;

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

    console.log(configGenerator(1))

    // 무한루프
    for (var iter = 1; iter; iter++) {
        let arrayOfPromises = [];
        for (var i = 0; i < 10; i++) {
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

        const unhandledAns = ans.filter( (datum) => { return datum.status === undefined });
        const filteredAns = ans.filter( (datum) => { return datum.status });
        const refinedAns = filteredAns.map( (datum) => { return datum.data.message });

        if (unhandledAns.length > 0) handleError(unhandledAns, readyQueue);
        readyQueue.push(...refinedAns);
    }
}

const handleError = async(errors, readyQueue) => {
    console.log('-------');
    console.log(errors);
    const customRequest = requestGenerator('GET', process.env.API_URL, 10, 100);

    const arrayOfPromises = errors.map( (error) => {
        return customRequest(error.config);
    });

    let ans = [];
    try {
        ans = await Promise.all(arrayOfPromises);
    } catch (error) {
        console.log(error);
    }

    //console.log(ans);

    const filteredAns = ans.filter( (datum) => { return datum.status });
    const refinedAns = filteredAns.map( (datum) => { return datum.data.message });

    console.log('handled::: ', ...refinedAns);
    readyQueue.push(...refinedAns);
}

module.exports = run;