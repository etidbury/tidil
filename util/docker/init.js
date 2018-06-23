module.exports = async ({containerName}) => {
    await require('exec-sequence').run({
        "Check Docker is installed": {
            command: "docker -v",
        }
    })
        .catch(({cmd, err}) => {
            process.exit(1);
        });
};
