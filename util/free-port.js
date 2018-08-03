const getPort = require("get-port");
const path = require("path");

module.exports = async ({}) => {
  const FROM_PORT = 3000;
  const TO_PORT = 9000;

  const port=await new Promise((resolve,reject) => {
    var fp = require("find-free-port");
    fp(FROM_PORT, TO_PORT, function(err, freePort) {
        if (err) return reject(err)
        resolve(freePort)
    })
  })

  //todo: ensure this is the only output for this command
  console.log(port);

  process.exit();
};
