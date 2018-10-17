const latestVersion = require('latest-version');
const compareVersions = require('compare-versions');
const path = require('path');
const execSequence = require('exec-sequence');
const chalk=require('chalk');



module.exports = async ({BASE_TIDIL_DIR, TIDIL_CMD_NAME}) => {

    let _needsToUpdate = false;
    let _latestTidalVersion;
    let _currentTidilVersion;

    await execSequence.run({
        "Checking latest version of TIDIL is installed": {
            promise: () => {
                return new Promise((resolve, reject) => {

                    try {

                        (async () => {

                            const latestTidilVersion = await latestVersion(TIDIL_CMD_NAME);

                            _latestTidalVersion=latestTidilVersion;

                            const currentTidilVersion = require(path.join(BASE_TIDIL_DIR, "package")).version;

                            _currentTidilVersion=currentTidilVersion;

                            const versionsDifference = compareVersions(currentTidilVersion, latestTidilVersion);


                            resolve(versionsDifference !== 0?chalk.yellow("Ok, we need to update your version"):"Your version is up to date!");

                            _needsToUpdate = versionsDifference !== 0


                        })();


                    } catch (e) {
                        reject(e);
                    }
                })
            }
        },
        "NPM Update TIDIL globally (if necessary)": {
            promise: () => new Promise(async (resolve, reject) => {

                try {

                    // todo: needs fixing!!

                    // if (_needsToUpdate) {

                    //     const ok = await execSequence.exec(`npm install -g ${TIDIL_CMD_NAME}`);
                    //     const ok2 = await execSequence.exec(`yarn global add ${TIDIL_CMD_NAME}`);

                    //     resolve(`Ok TIDIL has been updated to the latest version (v${_currentTidilVersion} -> v${_latestTidalVersion}) \n\n${chalk.bold.yellow('Please re-run your tidil command now.')}`);

                    //     await new Promise((resolve,reject)=>{
                    //         setTimeout(()=>{
                    //             resolve();
                    //         },2000);
                    //     });

                    //     process.exit(128);//todo: correct error code
                    // } else {

                    //     resolve("Using latest version of TIDIL!");


                    // }

                    if (_needsToUpdate)
                        throw new Error('We cannot auto-update tidil at this time. \nPlease manually run:\n\n npm install -g tidil\n or\n yarn global add tidil')

                } catch (e) {
                    reject(e);
                }

            })
        },
    })

        .then(async ()=>{

            await new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve();
                },1000);
            });
            return true;

        })
    /*  .then(() => {
          process.exit(0);
      })*/
        .catch(async ({cmd, err}) => {
            process.exit(1);
        });


};
