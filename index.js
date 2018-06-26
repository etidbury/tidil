#! /usr/bin/env node
const program = require('commander');
const pkg = require('./package');
const path = require('path');
const BASE_TIDIL_DIR = __dirname;
const TIDIL_CMD_NAME = "tidil";

(async () => {
    try {


        const r = await require(path.join(BASE_TIDIL_DIR, 'util/auto-update'))({BASE_TIDIL_DIR, TIDIL_CMD_NAME});

        const _handleCWD = (options) => {

            if (options.cwd && options.cwd.length) {
                process.chdir(options.cwd);
            }

        };

        program
            .version('' + pkg.version)
            .command(`tpl <templateID> [cmd]`)
            .option('--cwd <directory>', 'Set base directory')
            .description('run setup commands for all envs')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (templateID, cmd, options) => {
                try {
                    if (!templateID || !templateID.length) {
                        throw new Error("Invalid template ID specified");
                    }

                    if (!cmd || !cmd.length)
                        cmd = "init";


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


                    await utilCommand({BASE_TIDIL_DIR});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });


        program
            .command(`docker <cmd>`)
            .option('--container-name <containerName>', 'Set docker container name')
            .option('--cwd <directory>', 'Set base directory')
            .description('run setup commands for all envs')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (cmd, options) => {

                if (!cmd || !cmd.length)
                    cmd = "run";

                try {


                    _handleCWD(options);


                    let containerName = "cra-sails";

                    if (options.containerName && options.containerName.length) {
                        containerName = options.containerName;
                    }


                    let dockerCommand;
                    try {

                        await require(path.join(BASE_TIDIL_DIR, `util/docker/init`))({containerName});

                        dockerCommand = require(path.join(BASE_TIDIL_DIR, `util/docker/${cmd}`));

                    } catch (err) {
                        throw err;
                        //throw new Error("Failed to find utility method");
                    }


                    await dockerCommand({containerName});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });



        program
            .command(`check-server`)
            .option('--port <port>', 'Set port name to check')
            .option('--port-env <portEnv>', 'Set environment variable to obtain port')
            .option('--cwd <directory>', 'Set base directory')
            .description('run setup commands for all envs')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (options) => {


                try {


                    _handleCWD(options);



                    let miscCommand;
                    try {

                        miscCommand = require(path.join(BASE_TIDIL_DIR, `util/check-server`));

                    } catch (err) {
                        throw err;
                       // throw new Error("Failed to find utility method");
                    }


                    await miscCommand(options);

                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });


        program
            .command(`merge`)
            .option('--cwd <directory>', 'Set base directory')
            .description('run setup commands for all envs')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (options) => {


                try {


                    _handleCWD(options);



                    let miscCommand;
                    try {

                        miscCommand = require(path.join(BASE_TIDIL_DIR, `util/merge`));

                    } catch (err) {
                        throw err;
                        //throw new Error("Failed to find utility method");
                    }


                    await miscCommand({port:options.port});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });

        program
            .command(`test-all`)
            .option('--cwd <directory>', 'Set base directory')
            .description('run all tests')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (options) => {


                try {


                    _handleCWD(options);



                    let miscCommand;
                    try {

                        miscCommand = require(path.join(BASE_TIDIL_DIR, `util/test-all`));

                    } catch (err) {
                        throw err;
                        //throw new Error("Failed to find utility method");
                    }


                    await miscCommand({port:options.port});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });


        program
            .command(`env`)
            .option('--cwd <directory>', 'Set base directory')
            .description('run all tests')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (options) => {


                try {


                    _handleCWD(options);



                    let miscCommand;
                    try {

                        miscCommand = require(path.join(BASE_TIDIL_DIR, `util/env`));

                    } catch (err) {
                        throw err;
                        //throw new Error("Failed to find utility method");
                    }


                    await miscCommand({BASE_TIDIL_DIR});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });




        program
            .command(`open`)
            .option('--cwd <directory>', 'Set base directory')
            .option('--port-env <portEnv>', 'Set base directory')
            .description('Open client in browser')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (options) => {


                try {


                    _handleCWD(options);



                    let miscCommand;
                    try {

                        miscCommand = require(path.join(BASE_TIDIL_DIR, `util/open`));

                    } catch (err) {
                        throw err;
                        //throw new Error("Failed to find utility method");
                    }


                    await miscCommand({BASE_TIDIL_DIR,portEnv:options.portEnv});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });


        program
            .command(`rm-locks`)
            .option('--cwd <directory>', 'Set base directory')
            .description('Remove locks')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (options) => {

                try {


                    _handleCWD(options);



                    let miscCommand;
                    try {

                        miscCommand = require(path.join(BASE_TIDIL_DIR, `util/rm-locks`));

                    } catch (err) {
                        throw err;
                        //throw new Error("Failed to find utility method");
                    }


                    await miscCommand({BASE_TIDIL_DIR});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });




        program
            .command(`rm-pkg-locks`)

            .option('--cwd <directory>', 'Set base directory')
            .description('Remove packages and locks')
            //.option("-s, --setup_mode [mode]", "Which setup mode to use")
            .action(async (options) => {

                try {


                    _handleCWD(options);



                    let miscCommand;
                    try {

                        miscCommand = require(path.join(BASE_TIDIL_DIR, `util/rm-pkg-locks`));

                    } catch (err) {
                        throw err;
                        //throw new Error("Failed to find utility method");
                    }


                    await miscCommand({BASE_TIDIL_DIR});
                    process.exit(0);

                } catch (err) {
                    console.error("Command Error\n", err);
                    //console.error("Error",err.message);//pretty print
                    process.exit(1);
                }

            });



        program.parse(process.argv);


    } catch (err) {
        process.exit(1);
    }
})();
