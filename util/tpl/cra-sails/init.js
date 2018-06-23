module.exports = async () => {
    const fse = require('fs-extra');

    const path = require('path');

    const _envFilePath = '.env';
    const axios = require('axios');

    const config = {
        TPL_REPO_URL: "http://github.com/etidbury/cra-sails-boilerplate.git"
    };

    await require('exec-sequence').run({

        /*---------CHECK DEPENDENCIES----------*/
        "Check PM2 installed globally": {
            command: "pm2 -v",
            error: "Please install pm2 globally by running 'npm install pm2 -g'"
        },


        /*---------INSTALL----------*/

        "Clone project into project": {
            command: `git clone ${config.TPL_REPO_URL} ${process.cwd()}`
        },
        "Remove .git from project": {
            command: `rm -rf .git`
        },
        "Setup Environment Variables": {
            //command: "exit 0",
            prompt: [
                {
                    name: "port",
                    type: "input",
                    default:"3005",
                    message: "What port number do we use for development? ",
                    validate: function (input) {
                        // Declare function as asynchronous, and save the done callback
                        const done = this.async();

                        if (!input) {
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        input = parseInt(input);

                        if (!input || input < 3000 || input > 9999) {
                            // Pass the return value in the done callback
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        // Pass the return value in the done callback
                        done(null, true);

                    }
                },
                {
                    name: "devServerPort",
                    type: "input",
                    default:"3006",
                    message: "What port number do we use for the development server?",
                    validate: function (input) {
                        // Declare function as asynchronous, and save the done callback
                        const done = this.async();

                        if (!input) {
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        input = parseInt(input);

                        if (!input || input < 3000 || input > 9999) {
                            // Pass the return value in the done callback
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        // Pass the return value in the done callback
                        done(null, true);

                    }
                },
                {
                    name: "testServerPort",
                    type: "input",
                    default:"3007",
                    message: "What port number do we use for the testing server?",
                    validate: function (input) {
                        // Declare function as asynchronous, and save the done callback
                        const done = this.async();

                        if (!input) {
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        input = parseInt(input);

                        if (!input || input < 3000 || input > 9999) {
                            // Pass the return value in the done callback
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        // Pass the return value in the done callback
                        done(null, true);

                    }
                },
                {
                    name: "dockerPort",
                    type: "input",
                    default:"3008",
                    message: "What port number do we use for the docker server?",
                    validate: function (input) {
                        // Declare function as asynchronous, and save the done callback
                        const done = this.async();

                        if (!input) {
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        input = parseInt(input);

                        if (!input || input < 3000 || input > 9999) {
                            // Pass the return value in the done callback
                            done('You need to provide a number between 3000-9999');
                            return;
                        }

                        // Pass the return value in the done callback
                        done(null, true);

                    }
                },
                {
                    name: "gitWorkingBranch",
                    type: "input",
                    //default:"master",
                    message: "What is your working Git branch?",
                    validate: function (input) {
                        // Declare function as asynchronous, and save the done callback
                        const done = this.async();

                        if (!input || !input.length) {
                            done('You need to provide a name!');
                            return;
                        }
                        // Pass the return value in the done callback
                        done(null, true);

                    }
                }
            ],
            promise: ({port, devServerPort, testServerPort, dockerPort, gitWorkingBranch}) => fse.writeFile(_envFilePath, `
                             
#Client-side port to be used in development
DEV_CLIENT_PORT=${port}

#Development server port
DEV_SERVER_PORT=${devServerPort}

#Sets exposed and used port for Docker
DOCKER_PORT=${dockerPort}

#Testing server port
TEST_SERVER_PORT=${testServerPort}

#Set for react-scripts
PORT=${port}

#Git Working Branch
GIT_WORKING_BRANCH=${gitWorkingBranch}
`).then(() => `Created .env file!`)
            ,
            exists: _envFilePath,
            options: {cwd: "./"},
            error: "Failed to setup environment variables!"
        },

        "Install packages": {
            command: `npm install`
        },
        "Ensure server packages have installed": {
            command: "npm install",
            options: {cwd: path.join(process.cwd(), "server")},
            exists: "./server/node_modules/",
            error: ""
        },
        "Run All Tests": {
            command: `npm run test-all-ci`,
            options: {cwd: process.cwd()},
            error: "Failed to run tests!"
        },
        "Run npm start": {
            command: "npm start",
            options: {cwd: process.cwd()},
            error: "Failed to start project!"
        }
    }).then(() => {
        process.exit(0);
    })
        .catch(({cmd, err}) => {
            process.exit(1);
        });
};
