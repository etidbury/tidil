const path=require('path');
module.exports = async () => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    await require('exec-sequence').run({
        "Remove lock files": {
            //command: "exit 0",
            command: "rm -rf package-lock.json ; rm -rf yarn.lock ; rm -rf server/package-lock.json ; rm -rf server/yarn.lock"
        },"Remove packages":{
            command: "rm -rf node_modules"
        },"Remove server packages":{
            command: "rm -rf server/node_modules"
        }
    });
};
