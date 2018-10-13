module.exports = async ({BASE_TIDIL_DIR,repo,destination}) => {
    console.log('dododo')
    const fse = require('fs-extra');

    const path = require('path');

    const _envFilePath = '.env';
    const axios = require('axios');

    const config = {
        TPL_REPO_URL: "http://github.com/etidbury/tpl-cra-sails.git"
    };


    const BASE_REPO_URL='https://github.com/'

    let resolveRepoURL
    const repoParts = repo.split('/')

    if (repoParts.length<=1) {
        resolveRepoURL=BASE_REPO_URL+`/etidbury/`+repo
    }else{
        resolveRepoURL=BASE_REPO_URL+`/`+repoParts.join('/')
    }

    await require('exec-sequence').run({

        /*---------INSTALL----------*/
        "Git clone repository": {
            command: `git clone ${resolveRepoURL} ${destination}`
        },
        "Remove .git from project": {
            command: `rm -rf .git`
        },
        "Install packages via Yarn": {
            command: `yarn`
        },
        "Run Tests": {
            command: `yarn test`,
            options: {cwd: process.cwd()},
            error: "Failed to run tests!"
        }
    }).then(() => {
        process.exit(0);
    })
        .catch(({cmd, err}) => {
            process.exit(1);
        });
};
