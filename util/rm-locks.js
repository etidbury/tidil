const path=require('path');
module.exports = async () => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    await require('exec-sequence').run({
        "Remove package lock files (package-lock.json,yarn.lock)": {
            //command: "exit 0",
            command: "rm -rf package-lock.json ; rm -rf yarn.lock"
        }
    });
};
