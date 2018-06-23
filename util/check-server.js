const chalk=require('chalk');
const axios=require('axios');
const path=require('path');
module.exports = async ({port}) => {

    const ENV_PORT_NAME="PORT";
    let _port;

    await require('exec-sequence').run({
        'Check port is set':{
            command:"exit 0",
            promise:()=>new Promise((resolve,reject)=>{

                require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

                if (port&&port.length){
                    _port=port;
                }else if (process.env[ENV_PORT_NAME]&&process.env[ENV_PORT_NAME].length){
                    _port=process.env[ENV_PORT_NAME]
                }else{
                    return reject("Server Port is not set!");
                }

                return resolve(`Ok port is set at: ${_port}`);

            })
        },
        "Attempt connect to port (wait max 20s)":{
            promise:()=>new Promise((resolve,reject)=>{

                const _startTimestamp=Date.now();
                let s = async () => {
                    try {

                        const r = await axios.get(`http://localhost:${_port}`);

                        if (r){
                            resolve();
                        }

                    } catch (err) {

                        if (Date.now()-_startTimestamp>20*1000){
                            //if surpassed timeout, give up
                            reject(`The server is still not running (after 20 seconds)`);
                        }else{
                            setTimeout(() => {
                                s();
                            }, 500);
                        }



                    }
                };s();
            })
        }
    })
        .catch(({cmd, err}) => {
            process.exit(1);
        });
};
