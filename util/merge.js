const {run, exec} = require('exec-sequence');


module.exports = async () => {

    require('dotenv').config();

    if (!process.env.GIT_WORKING_BRANCH || !process.env.GIT_WORKING_BRANCH.length) {
        throw new Error("Working branch not set! Please run 'npm run init'");
    }

    const {GIT_WORKING_BRANCH} = process.env;

    const reset = async () => {
        //reset to working branch
        await exec(`git checkout ${GIT_WORKING_BRANCH}`).catch(() => {
            //silent
        });
    };

    let _mergeToBranch;
    let _tempMergeBranch;


    run({
        "Ensure all git changes have been committed": {
            command: "git diff --exit-code",
            options: {cwd: "./"},
            error: "Make sure you have committed/stashed your changes before trying to merge your branch."
        },
        /* "Running tests": {
             command: "npm run test-all-ci",
             options: {cwd: "./"},
             error: "Tests failed. Please run 'npm run test-all-ci' to see output."
         },*/
        "Initialise merging branch": {
            prompt: {
                type: 'list',
                name: 'mergeToBranch',
                message: 'Which Git Branch to merge to?',
                choices: [
                    'development',
                    'staging',
                    'production'
                ]
            },
            promise:
            //() => new Promise(async (resolve, reject) => {
                ({mergeToBranch}) => new Promise(async (resolve, reject) => {


                    try {

                        //const mergeToBranch = "development";
                        _mergeToBranch = mergeToBranch;


                        await exec(`git checkout -B ${mergeToBranch}`).catch(() => {
                            throw new Error(`Failed to checkout merging branch '${mergeToBranch}'!`);
                        });

                        try {

                            await exec(`git fetch origin/${mergeToBranch}`);
                        } catch (e) {
                            try {

                                await exec(`git push origin ${mergeToBranch}`);

                            } catch (e) {
                                throw new Error(`Failed to find origin branch '${mergeToBranch}' or create it!`);
                            }
                        }

                        resolve(`Initialised target branch '${mergeToBranch}'`);

                    } catch (err) {


                        await reset();


                        reject(err);
                    }
                }),
            error: "Failed to merge working branch"
        },
        "Checkout working branch": {
            promise: () => new Promise(async (resolve, reject) => {

                try {


                    // throw new Error(`Failed to pull origin of merging branch '${mergeToBranch}'!`);

                    try {
                        await exec(`git checkout -B ${GIT_WORKING_BRANCH}`);
                    } catch (e) {
                        throw new Error(`Failed to checkout working branch '${GIT_WORKING_BRANCH}'!`);
                    }

                    resolve(`Successfully checked out branch ${GIT_WORKING_BRANCH}`)

                } catch (err) {


                    await reset();


                    reject(err);
                }
            })
        },
        "Setup temporary merging branch": {
            promise: () => new Promise(async (resolve, reject) => {

                try {


                    const mergeToBranch = _mergeToBranch;


                    _tempMergeBranch = `merge-${GIT_WORKING_BRANCH}-${mergeToBranch}`;

                    /*try {
                        await exec(`git checkout -B ${workingBranch}`)
                    } catch (e) {
                        throw new Error(`Failed to checkout working branch '${workingBranch}'!`);
                    }

        */
                    /*if (!execSync(`git checkout -B ${tempMergeBranch}`)) {
                        throw new Error(`Failed to checkout temporary branch '${tempMergeBranch}'!`);
                    }*/

                    await exec(`git checkout -B ${_tempMergeBranch}`).catch(() => {
                        throw new Error(`Failed to checkout temporary branch '${_tempMergeBranch}'!`);
                    });


                    await exec(`git pull origin ${mergeToBranch}`).catch(() => {
                        throw new Error(`Failed to pull origin branch '${mergeToBranch}' to temporary branch '${_tempMergeBranch}'`);
                    });


                    await exec(`git checkout ${_tempMergeBranch} && git merge ${GIT_WORKING_BRANCH}`).catch(() => {
                        throw new Error(`Failed to merge '${GIT_WORKING_BRANCH}' to temporary branch '${_tempMergeBranch}'`);
                    });

                    resolve(`Setup temporary merging branch '${_tempMergeBranch}'`)

                } catch (err) {


                    await reset();


                    reject(err);
                }
            })
        },
        "Run all tests on temporary merging branch": {
            promise: () => new Promise(async (resolve, reject) => {

                try {


                    await exec(`npm run test-all-ci`).catch(({err}) => {
                        throw new Error(`Some tests failed! Please run 'npm run test-all' to see output` + err);
                    });


                    resolve(`All tests successfully passed!`);

                } catch (err) {


                    await reset();


                    reject(err);
                }
            })
        },
        "Merge changes to target branch and push to remote": {
            promise: () => new Promise(async (resolve, reject) => {

                try {


                    const mergeToBranch = _mergeToBranch;

                    await exec(`git checkout ${mergeToBranch} && git merge ${_tempMergeBranch}`).catch(() => {
                        throw new Error(`Failed to merge '${_tempMergeBranch}' into ${mergeToBranch} !`);
                    });

                    await exec(`git checkout ${mergeToBranch} && git push origin ${mergeToBranch}`).catch(() => {
                        throw new Error(`Failed to push merging branch '${mergeToBranch}' to origin`);
                    });

                    resolve(`Merged '${GIT_WORKING_BRANCH}' -> '${mergeToBranch}' and pushed to remote repository!`);

                } catch (err) {


                    await reset();


                    reject(err);
                }
            })
        },
        "Return to working branch": {
            promise: () => new Promise(async (resolve, reject) => {
                await reset();
                resolve(`Returned to working branch '${GIT_WORKING_BRANCH}'`);
            })
        }
    }).then(async () => {
        await reset();
        process.exit(0);
    })
        .catch(async ({cmd, err}) => {
            await reset();
            process.exit(1);
        });


    process.stdin.resume();//so the program will not close instantly

    const exitHandler = async (options, err) => {
        // if (options.cleanup) console.log('clean');
        if (err) console.error(err.stack);

        await reset();
        process.exit();
    };


//do something when app is closing
    process.on('exit', exitHandler.bind(null, {cleanup: true}));

//catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, {exit: true}));

// catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, {exit: true}));
    process.on('SIGUSR2', exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, {exit: true}));


};


