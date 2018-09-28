const requestGenerator = require('../helper/requestGenerator');

const testWithIteration = async () => {

    const getRequest = requestGenerator('GET', 'localhost:3000/', 10, 1000);

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

    console.log(ans.map((elem) => { 
        return elem ? elem.data.message : -1}));
    console.timeEnd('request');
}

const run = async() => {
    await testWithIteration();
}

module.exports = run;