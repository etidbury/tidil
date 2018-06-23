module.exports=async ()=>{
    const fse = require('fs-extra');

    const path = require('path');

    const _envFilePath = '.env';
    const axios = require('axios');

    const config={
        TPL_REPO_URL:"http://github.com/etidbury/cra-sails-boilerplate.git"
    };

    await require('exec-sequence').run({

        /*---------CHECK DEPENDENCIES----------*/
        "Check PM2 installed globally": {
            command: "pm2 -v",
            error: "Please install pm2 globally by running 'npm install pm2 -g'"
        },


        /*---------INSTALL----------*/

        "Clone project into project": {
            command:`git clone ${config.TPL_REPO_URL} ${process.cwd()}`
        },
        "Remove .git from project": {
            command:`rm -rf .git`
        },
        "Setup Environment Variables": {
            //command: "exit 0",
            prompt: [
                {
                    name: "port",
                    type: "input",
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
                    name: "testingPort",
                    type: "input",
                    message: "What port number do we use for testing the server?",
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
                }
            ],
            promise: ({port,testingPort}) => {
                return fse.writeFile(_envFilePath, `PORT=${port}\nTESTING_PORT=${testingPort}`).then(() => `Created .env file!`);
            },
            exists: _envFilePath,
            options: {cwd: "./"},
            error: "Failed to setup environment variables!"
        },

        "Install packages": {
            command:`npm install`
        },
        "Ensure server packages have installed": {
            command: "npm install",
            options: {cwd: path.join(process.cwd(),"server")},
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
