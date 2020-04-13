const { clipboard,BrowserWindow,app } = require('electron')
const contextMenu = require('electron-context-menu');
const path = require('path')
const fs = require('fs')
const availableFormats= clipboard.availableFormats()
const isWindows=process.platform === "win32"

const CLIPBOARD_UI_PAGE_FILENAME=`file://${__dirname}/clipboard-ui.html`

/**
 * todo: possibly move
 */
module.exports.isValidFilePath=(text)=>{
    text=text.trim()
    return fs.existsSync( path.relative(process.cwd(),text) )
};

module.exports.parseRelativeFilePathToAbsolute=(filePath)=>{
    return path.join(process.cwd(),path.relative(process.cwd(),filePath)).trim()
}

module.exports.getCopiedClipboard=()=>{


    const copiedClipboard={
        availableFormats,
        isImage:availableFormats.filter((f)=>f.includes('image/')).length===availableFormats.length&&availableFormats.filter((f)=>f.includes('image/')).length>0,
        html:clipboard.readHTML(),
        imageBuffer: clipboard.readImage().toPNG(),
        filePath: isWindows ?
            clipboard.readBuffer('FileNameW').toString('ucs2').replace(RegExp(String.fromCharCode(0), 'g'), '')
            : clipboard.read('public.file-url').replace('file://', '')
    }
    
    let embedHTML=""

    if (
        module.exports.isValidFilePath(copiedClipboard.html)
    ){
       copiedClipboard.filePath=module.exports.parseRelativeFilePathToAbsolute(copiedClipboard.html)
    }



    if (copiedClipboard.filePath.length){

        embedHTML=copiedClipboard.filePath

    }else{
        if (copiedClipboard.html.indexOf("<meta")===0){

            embedHTML=copiedClipboard.html
        }else{
            embedHTML='<pre>'+copiedClipboard.html+'</pre>'
        }
    }


    copiedClipboard.embedHTML=embedHTML


    return copiedClipboard
}

//var rawFilePath = clipboard.read("FileGroupDescriptorW");


let mainWindow

let isAppReady=false

app.on('ready', () => {
    // const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
    isAppReady=true
})


const initWindow=()=>{
    mainWindow = new BrowserWindow({
        width: 900,
        height: 400,
        webPreferences: {
          nativeWindowOpen: true,
         // nodeIntegration: true
        },
        title:"Tidil Clipboard"
      })
    
      var handleRedirect = (e, url) => {
        if(url != mainWindow.webContents.getURL()) {
            e.preventDefault()
            require('electron').shell.openExternal(url)
        }
      }
    
      mainWindow.webContents.on('will-navigate', handleRedirect)
      mainWindow.webContents.on('new-window', handleRedirect)
}

module.exports.renderClipboardWindow=async(clipboard)=>{




    contextMenu({
        prepend: (defaultActions, params, browserWindow) => [
            // {
            // 	label: 'Rainbow',
            // 	// Only show it when right-clicking images
            // 	visible: params.mediaType === 'image'
            // },
            // {
            // 	label: 'Copy all HTML',
            // 	// Only show it when right-clicking text
            // 	visible: params.selectionText.trim().length > 0,
            // 	click: () => {
            // 		shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
            // 	}
            // }
        ]
    });
    
    //wait for main window
    while (!isAppReady){
       
        await new Promise((r)=>setTimeout(r,100))
    }

    if (!mainWindow){
        initWindow()
    }
    
      mainWindow.loadURL(CLIPBOARD_UI_PAGE_FILENAME)
    
      //mainWindow.openDevTools();
    
      mainWindow.webContents.on('did-finish-load', function() {

        if (typeof clipboard==="string"){
            mainWindow.webContents.executeJavaScript(`
            document.getElementById("main").innerHTML="${clipboard}";
            `);
        }else{
            mainWindow.webContents.executeJavaScript(`
                document.getElementById("main").innerHTML="";
                `);

            clipboard.forEach((c,i)=>{
               
                const execJs=`
                document.getElementById("main").innerHTML+=${`atob('${c.htmlTextHashed}')`};
                document.getElementById("main").innerHTML+='<hr class="clips" data-clip-index="${i}"/>';
                `

                //fs.writeFileSync("._test-out.js",execJs)

                mainWindow.webContents.executeJavaScript(execJs);
            })
        }

       
       
      });
    
    
    
   
    
}


// const copiedClipboard=module.exports.getCopiedClipboard()

// module.exports.renderClipboardWindow(copiedClipboard)

//console.log(clipboardImage)