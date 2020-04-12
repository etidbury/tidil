
const {loadLastClipboard} = require('./api');
const {renderClipboardWindow} = require('./clipboard');

module.exports=async({
    channelToken,
   // searchTags,
})=>{


    await renderClipboardWindow("<strong>Loading...</strong>")

    const clipboard=await loadLastClipboard({ channelToken })

    await renderClipboardWindow(clipboard)
}