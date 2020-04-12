

const {uploadFile,registerClipboard} = require('./api');
const {getCopiedClipboard,

    isValidFilePath,
    parseRelativeFilePathToAbsolute

} = require('./clipboard');


const generateFileEmbedHTML=({url,fileExtension,filePath})=>{
    return `<a href='${url}' target='__blank'><span class='file-icon fiv-viv fiv-icon-${fileExtension}'></span> ${filePath}</a>`
}
module.exports=async({
    appendText="",
    channelToken,
    tags,
})=>{

        let resultURL

        if (appendText&&appendText.length&&isValidFilePath(appendText)){

            // Treat appended text as a file and upload
            //

            const filePath= parseRelativeFilePathToAbsolute(appendText)

            const { url } = await uploadFile({filePath})
            const fileExtension = url.split('.').pop()

            resultURL=url

            await registerClipboard({
                htmlText:generateFileEmbedHTML({url,filePath,fileExtension}),
                tags,
                channelToken
            }).catch((e)=>{
                throw e
            })


        }else{


            // Read and use clipboard contents
            //

            const clipboardContents=getCopiedClipboard()

            if (
                clipboardContents.isImage
                ){
    
                    const { url } = await uploadFile({filePath:clipboardContents.filePath&&clipboardContents.filePath.length?clipboardContents.filePath:"screenshot.png",fileBuffer:clipboardContents.imageBuffer})
    
                    //const fileExtension = url.split('.').pop()
        
                    resultURL=url

                    clipboardContents.embedHTML=`<a href='${url}' target='__blank'><img src='${url}'/></a>`
            
            }else if (
                clipboardContents.filePath&&clipboardContents.filePath.length
            ){
    
            
                const { url } = await uploadFile({filePath:clipboardContents.filePath})
                const fileExtension = url.split('.').pop()
        
        
                resultURL=url

                clipboardContents.embedHTML=generateFileEmbedHTML({fileExtension,filePath:clipboardContents.filePath,url})
        
            }
    
            if (!clipboardContents.embedHTML.length){
                throw new Error("No clipboard contents to save.")
            }


            await registerClipboard({
                htmlText:(appendText&&appendText.length?"<pre class='append-text'>"+appendText+"</pre>"+"<hr class='append'/>":"")+clipboardContents.embedHTML,
                tags,
                channelToken
            }).catch((e)=>{
                throw e
            })




        }

        return {resultURL}

      

       

        //await renderClipboardWindow([{htmlText:clipboardContents.embedHTML}])


}

