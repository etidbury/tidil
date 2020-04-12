const api = require('./lib/api')
const path= require('path')

const cliProgress = require('cli-progress');



const main=async()=>{


    const baseApiURL="https://tidil.now.sh"
    const filePath=path.join(process.cwd(),"./tiger.mkv")
    //const filePath=path.join(process.cwd(),"./test.txt")

    const bar1 = new cliProgress.SingleBar({
        format: 'progress [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}'
    }, cliProgress.Presets.shades_classic);
 
    let hasBarStarted=false

    const {url} = await api.uploadFile({baseApiURL,filePath,onUploadProgress:({uploaded,total})=>{

        if (!hasBarStarted){
            bar1.start(total,0)
            hasBarStarted=true
        }

        bar1.update(uploaded)

    }})


    bar1.stop();



    console.log("url",url)


}
main()
