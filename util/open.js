const path=require('path');
module.exports = async () => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    if (!process.env.DEV_CLIENT_PORT || !process.env.DEV_CLIENT_PORT.length)
        throw new Error(`No testing port specified! Please run 'tidil env'`);

    require('exec-sequence').run({
        "Open client in browser": {
            //command: "exit 0",
            command: `open http://localhost:${process.env.DEV_CLIENT_PORT} && exit 0`
        }
    });
};
