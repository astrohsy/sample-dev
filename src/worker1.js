module.exports = async () => {
    await run();
}

const run = async () => {
    console.log("1111", process.env.name);
    process.on('message', (msg) => {
        console.log('Message has been arrived');
        console.log(msg);
    });
}