const axios = require('axios');
const cluster = require('cluster');

const runWorker1 = require('./src/worker1');

const GET_URL = 'http://localhost:3000/api/';

const getRequest = async (id) => {
    try {
        return await axios.get(GET_URL + id);
    } catch (error) {        
        return undefined;
    }
}

const testWithIteration = async () => {

    console.time('request');
    
    var arrayOfPromises = [];
    for (var i = 0; i < 10; i++) {
        arrayOfPromises.push(getRequest(i));
    }

    var ans = [];
    try {
        ans = await Promise.all(arrayOfPromises);
    } catch (error) {
        console.log(error);
    }

    console.log(ans.map((elem) => { 
        return elem ? elem.data.message : -1}));
    console.timeEnd('request');
}

const main = async () => {
    if (cluster.isMaster) {
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