const path=require('path');
module.exports = async () => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    await require('exec-sequence').run({
        "Delete lock files": {
            //command: "exit 0",
            command: "rm -rf package-lock.json ; rm -rf yarn.lock"
        },"Delete node_modules":{
            command: "rm -rf node_modules"
        }
    });
};
