const chalk = require('chalk');
const axios = require('axios');
const path = require('path');
module.exports = async ({ portEnv, port }) => {

    require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });


    let _port;

    await require('exec-sequence').run({
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
                    portEnv = portEnv ? portEnv : "DEV_CLIENT_PORT";

                    if (!process.env[portEnv] || !process.env[portEnv].length)
                        throw new Error(`Failed to find environment variable '${portEnv}' for port! Please run 'tidil env'`);

                    _port = process.env[portEnv];

                    return resolve(`Checking server at port ${_port} (env: ${portEnv})`);

                }




            })
        },
        "Attempt connect to server (wait max 20s)": {
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

                        if (Date.now() - _startTimestamp > 20 * 1000) {
                            //if surpassed timeout, give up
                            reject(`The server is still not running (after 20 seconds)`);
                        } else {
                            setTimeout(() => {
                                s();
                            }, 500);
                        }



                    }
                }; s();
            })
        }
    })
        .catch(({ cmd, err }) => {
            process.exit(1);
        });
};
