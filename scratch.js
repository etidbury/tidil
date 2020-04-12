const { clipboard,BrowserWindow,app } = require('electron')
const contextMenu = require('electron-context-menu');

const availableFormats= clipboard.availableFormats()
const isWindows=process.platform === "win32"

const CLIPBOARD_INDEX_PAGE_FILENAME=`file://${__dirname}/index.html`

module.exports.getCopiedClipboard=()=>{


    const copiedClipboard={
        availableFormats,
        isImage:availableFormats.filter((f)=>f.includes('image/')).length>0,
        html:clipboard.readHTML(),
        imageDataURL: clipboard.readImage().toDataURL(),
        filePath: isWindows ?
            clipboard.readBuffer('FileNameW').toString('ucs2').replace(RegExp(String.fromCharCode(0), 'g'), '')
            : clipboard.read('public.file-url').replace('file://', '')
    }

    let resultHTML=""

    if (copiedClipboard.filePath.length){
        resultHTML="\""+copiedClipboard.filePath+"\""
    }else{
        if (copiedClipboard.isImage){
          resultHTML="\"<img src='"+copiedClipboard.imageDataURL+"'/>\"";

        }else if (copiedClipboard.html.indexOf("<meta")===0){

            resultHTML=JSON.stringify(copiedClipboard.html);

        }else{
            resultHTML="'<pre>'+"+"atob(\"" + new Buffer(copiedClipboard.html).toString('base64') + "\") + '</pre>'"
        }
    }


    copiedClipboard.resultHTML=resultHTML


    return copiedClipboard
}

//var rawFilePath = clipboard.read("FileGroupDescriptorW");


module.exports.renderClipboardWindow=(copiedClipboard)=>{

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
    
    app.on('ready', () => {
        // const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
    
    
      const mainWindow = new BrowserWindow({
        width: 900,
        height: 400,
        webPreferences: {
          nativeWindowOpen: true,
         // nodeIntegration: true
        },
        title:"Tidil Clipboard"
      })

      var handleRedirect = (e, url) => {
        console.log("handlerREdir")
        if(url != mainWindow.webContents.getURL()) {
            e.preventDefault()
            require('electron').shell.openExternal(url)
        }
      }

      mainWindow.webContents.on('will-navigate', handleRedirect)
      mainWindow.webContents.on('new-window', handleRedirect)

    
    
      mainWindow.loadURL(CLIPBOARD_INDEX_PAGE_FILENAME)
    
      //mainWindow.openDevTools();
    

      mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.executeJavaScript(`
        document.getElementById("main").innerHTML=${copiedClipboard.resultHTML};
        `);
      });
    
    
    
    })
    
}


const copiedClipboard=module.exports.getCopiedClipboard()

module.exports.renderClipboardWindow(copiedClipboard)

//console.log(clipboardImage)