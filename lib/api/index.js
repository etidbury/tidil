const { _uploadFile } = require('./fileUpload')
const path= require('path')

const cliProgress = require('cli-progress');
//const baseApiURL="http://localhost:3000"
const baseApiURL="https://tidil.now.sh"
const Axios = require('axios')
const urljoin = require('url-join')
const mimeTypes = require('mime-types')

module.exports.uploadFile=async({filePath,fileBuffer,suppressOutput})=>{

    
    //const filePath=path.join(process.cwd(),"./tiger.mkv")
    //const filePath=path.join(process.cwd(),"./test.txt")

    const relativeFilePath = path.relative(process.cwd(),filePath)

    const dynamicFilePath = relativeFilePath.indexOf("../")>-1?filePath:relativeFilePath


    const fileContentType=mimeTypes.lookup(filePath)||"text/plain"

    let bar1 = new cliProgress.SingleBar({
        format: `Uploading '${dynamicFilePath}' (${fileContentType}) [{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total}`
    }, cliProgress.Presets.shades_classic);
 
    let hasBarStarted=false
   
    const {url} = await _uploadFile({fileBuffer,fileContentType,baseApiURL,filePath,onUploadProgress:({uploaded,total})=>{

        if (!suppressOutput){
            if (!hasBarStarted){
                bar1.start(total,0)
                hasBarStarted=true
            }

            bar1.update(uploaded)
        }

    }}).catch((err)=>{
       bar1.stop();
       throw err
    })


    bar1.stop();

    return {
        url
    }

}


module.exports.loadLastClipboard=async({channelToken})=>{

    return Axios.get(urljoin(baseApiURL,`/clipboard/last`), {
        params:{
            channelToken,
        }
    }).then(({data:{ clipboard }})=>{
        return clipboard
    }).catch((err)=>{
        console.log("Error loading last clipboard from API",err.data)
        throw err
    })
}


module.exports.registerClipboard=async({htmlText,channelToken,tags})=>{

    tags=tags.split(',')
    tags.push(`platform:${process.platform}`)
    tags=tags.join(',')

    return Axios.post(urljoin(baseApiURL,`/clipboard/register`), {
        htmlTextHashed:Buffer.from(htmlText).toString('base64'),
        channelToken,
        tags
    }, {
        maxBodyLength:Infinity,
        maxContentLength:Infinity,
    }).then(({data})=>{
        return data
    }).catch((err)=>{
        console.log("Error registering clipboard to API")
        throw err
    })
}




module.exports.sendSMS=async({recipientNumber,textBody})=>{

    return Axios.get(urljoin(baseApiURL,`/twilio/sms`), {
        params:{
            to:recipientNumber,
            body:textBody
        }
    }).catch((err)=>{
        console.log("Error sending SMS using API",err.data)
        throw err
    })
}