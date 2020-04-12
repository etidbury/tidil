const { _uploadFile } = require('./fileUpload')
const path= require('path')

const cliProgress = require('cli-progress');
const baseApiURL="https://tidil.now.sh"


module.exports.uploadFile=async({filePath,suppressOutput})=>{

    
    //const filePath=path.join(process.cwd(),"./tiger.mkv")
    //const filePath=path.join(process.cwd(),"./test.txt")

    let bar1 = new cliProgress.SingleBar({
        format: `Uploading '${path.relative(process.cwd(),filePath)}' [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}`
    }, cliProgress.Presets.shades_classic);
 
    let hasBarStarted=false

    const {url} = await _uploadFile({baseApiURL,filePath,onUploadProgress:({uploaded,total})=>{

        if (!suppressOutput){
            if (!hasBarStarted){
                bar1.start(total,0)
                hasBarStarted=true
            }

            bar1.update(uploaded)
        }

    }})


    bar1.stop();

    return {
        url
    }

}