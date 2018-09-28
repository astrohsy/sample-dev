module.exports = async () => {
    await print();
}

print = async () => {
    console.log(process.env.name);
}