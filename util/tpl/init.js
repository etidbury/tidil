module.exports = async ({templateID}) => {
    await require('exec-sequence').run({
        "Confirm installation": {
            //command: "exit 0",
            prompt: [
                {
                    name: "confirmInstallation",
                    type: "confirm",
                    message: `Are you sure you wish to install template '${templateID}' to directory:\n ${process.cwd()} `
                }
            ],
            promise: ({confirmInstallation}) => {
                return new Promise((resolve, reject) => {

                    if (confirmInstallation)
                        resolve("Ok! Continuing...");
                    else reject("Cancelled operations!");
                })
            }
        }
    })
        .catch(({cmd, err}) => {
            process.exit(1);
        });
};
