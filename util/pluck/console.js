const path=require('path');
module.exports = async ({targetDirectory}) => {

    require('dotenv').config({path: path.resolve(process.cwd(),'.env')});

    if (!targetDirectory||!targetDirectory.length)
        targetDirectory = './'
    
    const commands = {}

    //console.(log|debug|info|...|count)\((.*)\)\)?

    commands[`Pluck console.log and console.trace lines in all files within directory: ${targetDirectory}`] = {
        command: `find ${targetDirectory} -type f -name '*.js' -not -path "*flow-typed*" -not -path "*node_modules*" -exec sed -i '' -E 's/console.(log|trace)\\((.*)\\)\\)?\/\/g' {} +`
    }
    
    commands[`Git Ignore white-spaces etc.`] = {
        command: `git diff -U0 -w --no-color | git apply --cached --ignore-whitespace --unidiff-zero ; git checkout . ; git reset --mixed`
    }

    await require('exec-sequence').run(commands)
};
