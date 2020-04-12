const Axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const urljoin = require('url-join')
const mimeTypes = require('mime-types')
const url = require('url');
const https = require('https')
const path= require('path')

module.exports._uploadFile=async({baseApiURL,filePath,onUploadProgress})=>{

    if (!fs.existsSync(filePath)){
        throw new Error(`File: ${filePath} does not exist`)
    }
    
    const fileContentType=mimeTypes.lookup(filePath)

    const {data }= await Axios.post(urljoin(baseApiURL,`/bucket/upload`), {
        contentType:fileContentType,
        fileName:filePath
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

    const fileReadStream=fs.createReadStream(filePath)

    formData.append('acl',data.acl)
    formData.append('Content-Type',data['Content-Type'])
    formData.append('file', fileReadStream);

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
        

            try {
            

                if (res.statusCode>=200&&res.statusCode<300){
                    resolve()
                }else{
                    throw new Error(`Error response: ${res.statusCode}`)
                }
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