module.exports = async ({BASE_TIDIL_DIR}) => {
    const fse = require('fs-extra');

    const path = require('path');

    const _envFilePath = '.env';
    const axios = require('axios');

    const config = {
        TPL_REPO_URL: "http://github.com/etidbury/tpl-cra-sails.git"
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
        "Setup Environment Variables": require(path.join(BASE_TIDIL_DIR,"lib","exec-command-presets","general.setup.env"))({envFilePath:_envFilePath}),

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
