module.exports = async ({BASE_TIDIL_DIR}) => {


    const path = require('path');

    const _envFilePath = '.env';

    await require('exec-sequence').run({

        "Setup Environment Variables": require(path.join(BASE_TIDIL_DIR,"lib","exec-command-presets","general.setup.env"))({envFilePath:_envFilePath}),

    }).then(() => {
        process.exit(0);
    })
        .catch(({cmd, err}) => {
            process.exit(1);
        });
};
