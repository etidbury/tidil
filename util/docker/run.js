const chalk = require('chalk');
const path = require('path');
module.exports = async ({ containerName }) => {

    require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

    await require('exec-sequence').run({
        'Check Dockerfile exists': {
            command: "exit 0",
            exists: "./Dockerfile",
        },
        'Ensure environment variables are set': {
            promise: () => new Promise((resolve, reject) => {

                try {

                    if (process.env.PORT && process.env.PORT.length && process.env.DOCKER_PORT && process.env.DOCKER_PORT.length) {
                        resolve("All environment variables required are set")
                    } else {
                        reject("Environment variables not set! Please run 'tidil env'");
                    }
                } catch (err) {
                    reject("Unknown error occurred");
                }

            })
        },
        'Clean Docker': {
            command:`docker rmi -f ${containerName}`,
            promise: () => Promise.resolve(chalk.yellow("Removed all images tagged 'cra-sails'"))
        },
        'Build Docker Container': {
            command: `docker build -t ${containerName} .`,
        },
        "Run Docker Container": {
            command: `docker run ${containerName} -p ${process.env.PORT}:${process.env.DOCKER_PORT}`,
        }
    })
        .catch(({ cmd, err }) => {
            process.exit(1);
        });
};
