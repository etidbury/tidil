const chalk = require('chalk');
const axios = require('axios');
const path = require('path');
module.exports = async ({ portEnv, port,wait }) => {
    wait=parseInt(wait);
    const waitSeconds=wait&&wait>0?wait:20;

    require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });


    let _port;


    const commands={
        'Check port is set': {
            command: "exit 0",
            promise: () => new Promise((resolve, reject) => {

                require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });


                if (port) {

                    if (!port.length||parseInt(port)<=0){
                        throw new Error("Invalid port specified!")
                    }

                    _port=port;

                    return resolve(`Checking server at port ${_port}`);

                } else {
                    portEnv = portEnv ? portEnv : "PORT";

                    if (!process.env[portEnv] || !process.env[portEnv].length)
                        throw new Error(`Failed to find environment variable '${portEnv}' for port! Please run 'tidil env'`);

                    _port = process.env[portEnv];

                    return resolve(`Checking server at port ${_port} (env: ${portEnv})`);

                }




            })
        }
    };

    commands[`Attempting connection to server (Timeout: ${waitSeconds}s)`]= {
        promise: () => new Promise((resolve, reject) => {

           
            
            const _startTimestamp = Date.now();
            let s = async () => {
                try {

                    const url = `http://localhost:${_port}`;

                    const axiosPingInstance = axios.create({
                        validateStatus: function (status) {
                            return status >= 200 && status < 500; // default
                        }
                    });


                    const r = await axiosPingInstance.get(url);

                    if (r) {
                        resolve(`Connected to ${url} successfully`);
                    }

                } catch (err) {

                    if (Date.now() - _startTimestamp > waitSeconds * 1000) {
                        //if surpassed timeout, give up
                        reject(`The server is still not running (after ${waitSeconds} seconds)`);
                    } else {
                        setTimeout(() => {
                            s();
                        }, 500);
                    }



                }
            }; s();
        })
    }


    await require('exec-sequence').run(commands);
};
