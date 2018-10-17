const path=require('path');

module.exports = async ({}) => {

    const commands = {}

    commands[`Git Ignore white-spaces etc.`] = {
        command: `git diff -U0 -w --no-color | git apply --cached --ignore-whitespace --unidiff-zero ; git checkout . ; git reset --mixed`
    }
    
    await require('exec-sequence').run(commands)
};
