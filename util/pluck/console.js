const path=require('path');
module.exports = async ({targetDirectory}) => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    if (!targetDirectory||!targetDirectory.length)
        targetDirectory = './'
    
    const commands = {}

    commands[`Pluck console.log and console.trace lines in all files within directory: ${targetDirectory}`] = {
        command: `find ./src -type f -name '*.js' -exec sed -i '' -E 's/console.(log|trace)\((.*)\)?//g' {} +`
    }
    
    await require('exec-sequence').run(commands);
};