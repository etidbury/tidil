
const getPort = require('get-port')
const path=require('path');

module.exports = async ({}) => {

    const FROM_PORT=3000;
    const TO_PORT=9000;

    const defaultPorts=[];

    for (let i = FROM_PORT; i < TO_PORT; i++) {
        defaultPorts.push(i);
    }
    
    _defaultPort=await getPort({port:defaultPorts});

    //todo: ensure this is the only output for this command
    console.log(_defaultPort);

    process.exit();

};
