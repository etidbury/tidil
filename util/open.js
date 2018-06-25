const path=require('path');
module.exports = async ({portEnv}) => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    portEnv=portEnv?portEnv:"DEV_CLIENT_PORT";

    if (!process.env[portEnv] || !process.env[portEnv].length)
        throw new Error(`Failed to find environment variable '${portEnv}' for port! Please run 'tidil env'`);

    await require('exec-sequence').run({
        "Open client in browser": {
            //command: "exit 0",
            command: `open http://localhost:${process.env[portEnv]} && exit 0`
        }
    });
};
