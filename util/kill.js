const path=require('path');
module.exports = async ({port}) => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    if (!port||!port.length)
        throw new Error("Invalid port specified");

    await require('exec-sequence').run({
        "Kill process with port": {
            //command: "exit 0",
            command: `kill $(lsof -t -i:${port})`,
            promise:()=>Promise.resolve(`Kill process with port ${port}`)
        }
    });
};
