

const {uploadFile,registerClipboard} = require('./lib/api');
const {getCopiedClipboard,renderClipboardWindow} = require('./lib/clipboard');

const saveClipboard=require('./lib/saveClipboard')

const main=async()=>{



    const clipboardItem=await saveClipboard({
        appendText:"./test.txt",
        channelToken:"channel1",
        tags:"tag1"
    })
  
    await renderClipboardWindow([clipboardItem])


    


}
main()
