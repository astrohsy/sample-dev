module.exports = async () => {
    await run();
}

const run = async () => {
    process.on('message', (msg) => {
        console.log('Message has been arrived');

        process.send({ response: msg });
    });
}