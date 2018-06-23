const chalk=require('chalk');

module.exports = async ({containerName}) => {

    require('dotenv').config({path: process.cwd()});

    await require('exec-sequence').run({
        'Check Dockerfile exists':{
            command:"exit 0",
            exists:"./Dockerfile",
        },
        'Ensure environment variables are set':{
            promise:()=>new Promise((resolve, reject)=>{

                try {

                    if (process.env.PORT && process.env.PORT.length) {
                        resolve("All environment variables required are set")
                    } else {
                        reject("Environment variables not set! Please run 'npm init'");
                    }
                }catch (err){
                    reject("Unknown error occurred");
                }

            })
        },
        'Clean Docker':{
            promise:()=>Promise.resolve(chalk.yellow("Not yet integrated!"))
        },
        'Build Docker Container': {
            command:`docker build -t ${containerName} .`,
        },
        "Run Docker Container":{
            command:`docker run -it ${containerName} -p ${process.env.PORT}:${process.env.PORT}`,
        }
    })
        .catch(({cmd, err}) => {
            process.exit(1);
        });
};
