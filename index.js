const program = require('commander');
const pkg = require('./package');
const path = require('path');
const BASE_TIDIL_DIR = __dirname;
const TIDIL_CMD_NAME ="tidil";

(async () => {
    try {


        const r=await require(path.join(BASE_TIDIL_DIR, 'util/auto-update'))({BASE_TIDIL_DIR, TIDIL_CMD_NAME});


        program
            .version('' + pkg.version)
            .command(`tpl <templateID> [cmd]`)
            .option('--cwd <directory>', 'Set base directory')
            .description('run setup commands for all envs')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (templateID, cmd, options) => {

                if (!cmd || !cmd.length)
                    cmd = "init";

                try {


                    if (options.cwd && options.cwd.length) {
                        process.chdir(options.cwd);
                    }

                    let utilCommand;
                    try {

                        await require(path.join(BASE_TIDIL_DIR, `util/tpl/init`))({templateID});

                        utilCommand = require(path.join(BASE_TIDIL_DIR, `util/tpl/${templateID}/${cmd}`));

                    } catch (err) {
                        throw new Error("Failed to find utility method");
                    }


                    await utilCommand();


                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });

        program.parse(process.argv);

    }catch (err){
        process.exit(1);
    }
})();
