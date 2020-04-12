const Axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const urljoin = require('url-join')

const url = require('url');
const https = require('https')
const path= require('path')
const stream = require('stream');
const streamifier = require('streamifier')

module.exports._uploadFile=async({baseApiURL,filePath,fileContentType,onUploadProgress,fileBuffer})=>{

    if (typeof fileBuffer==="undefined"&&!fs.existsSync(filePath)){
        throw new Error(`File: ${filePath} does not exist`)
    }
    
    let fileNameSanitised = filePath

    //fileNameSanitised=fileNameSanitised.split('/').pop()
    if (fileNameSanitised.charAt(0) == "/") fileNameSanitised = fileNameSanitised.substr(1);

    //fileNameSanitised=path.relative(process.cwd(),filePath).replace(/\.\./g,'_x_')
    
  

    const {data }= await Axios.post(urljoin(baseApiURL,`/bucket/upload`), {
        contentType:fileContentType,
        fileName:fileNameSanitised
    }, {
        // headers: {
        //     'Content-Type': 'application/json',
        //     'DD-API-KEY': DD_API_KEY
        // },
        //ddtags=<TAGS>&ddsource=<SOURCE>&service=<SERVICE>&hostname=<HOSTNAME>
        //params
    }).catch((err)=>{
        console.log("Error setting up S3 signed upload connection",err.data)
        throw err
    })

    const formData = new FormData();

    Object.keys(data.fields).forEach((fieldName)=>{
        formData.append(fieldName, data.fields[fieldName]);
    })


    //let bufferStream=null

    formData.append('acl',data.acl)
    formData.append('Content-Type',data['Content-Type'])

 
    if (fileBuffer){
        // Initiate the source
        //bufferStream = streamifier.createReadStream(fileBuffer)

        formData.append('file', fileBuffer, { filename : fileNameSanitised });

    }else{
        
        const fileReadStream=fs.createReadStream(filePath)

        formData.append('file', fileReadStream);
    }

    

    const headers = await new Promise((resolve,reject)=>{
        formData.getLength((err,length)=>{

            if (err){
                return reject(err)
            }

            resolve({
                ...formData.getHeaders(),
                "Content-Length": length
            })
    
        })
    })
   
    // await Axios({
    //     maxBodyLength:Infinity,
    //     maxContentLength:Infinity,
    //     method:"POST",
    //     url:data.url,
    //     data:formData,
    //     onUploadProgress: function(progressEvent) {
    //         console.log("progr",progressEvent)
    //         var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
    //         console.log("uploaded %",percentCompleted)

    //         onUploadProgressPercentage(percentCompleted)
    //     },
    //     headers
    // }).catch((err)=>{
    //     console.log("Error uploading to S3",err)
    //     throw err
    // })



    const contentLength=headers['Content-Length']


   
    // await new Promise((resolve,reject)=>{
    //     fileReadStream.pipe(request.post(data.url).set(headers))
    //     .on('error',(err)=>{
    //         console.error("err",err)
    //         reject(err)
    //     })
    //     .on('end', ()=>{
    //         resolve()
    //     });
    // })

   
    const targetS3URL=url.parse(data.url);

    var request = https.request({
        method: 'post',
        host: targetS3URL.host,
        path: targetS3URL.path,
        headers
    });

    let uploaded=0;

    formData.on('data', function(data)
    {
      uploaded += data.length;

      onUploadProgress({
          uploaded,
          total:contentLength
      })
    });
  
    // var str = progress({
    //     time: 1000
    // });

    // str.on('progress', function(progress) {
    //     console.log(Math.round(progress.percentage)+'%');
    // });

    formData.pipe(request);

    
    await new Promise((resolve,reject)=>{
        request.on('response', function(res) {
        

            const hasSuccessStatusCode=res.statusCode>=200&&res.statusCode<300
    

            if (hasSuccessStatusCode){
                resolve()
            }

            try {
            
                if (!hasSuccessStatusCode){
                    console.debug("Error response:")
                    res.on('data',(data)=>{
                        console.debug(data.toString())
                    })
                }

                res.on('end',()=>{
                    console.log('end()')
                    if (!hasSuccessStatusCode){
                        reject(new Error(`Error status code response: ${res.statusCode}`))
                    }
                })
               
            }catch(err){
                reject(err)
            }
        });
    })
    


    

    // console.log("dfdsf",typeof formData)

    // console.log("data.url",data.url)
    // await superagent.post(data.url)
    //      .send(fileReadStream)
    //     // .set(headers)
    //     // .attach('file', file)
    //     .on('progress', e => {
    //         console.log('Percentage done: ', e);
    //     })
    
    //     // .end((err, res) => {
    //     // // console.log(err);
    //     // console.log(res);
    //     // });


    return {
        url:urljoin(baseApiURL,`/bucket/${data.fields.key}`)
    }
}