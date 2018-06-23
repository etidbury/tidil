const path=require('path');
module.exports = async () => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    if (!process.env.TEST_SERVER_PORT || !process.env.TEST_SERVER_PORT.length)
        throw new Error(`No testing port specified! Please run 'tidil init'`);

    require('exec-sequence').run({
        "Test client-side": {
            //command: "exit 0",
            command: "npm test",
            options: {
                env: Object.assign(process.env, {"CI": true, "NODE_ENV": "testing"})
            }
        },
        "Test server-side": {
            //command: "exit 0",
            command: "npm test",
            options: {
                cwd: "./server/",
                env: Object.assign(process.env, {"CI": true, "NODE_ENV": "testing", PORT: process.env.TEST_SERVER_PORT})
            }
        }
    });
};
