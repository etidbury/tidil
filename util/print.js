const path = require("path");
const fse = require("fs-extra");
const tpl = body => `
<html>

<head>
<style>
*{
    margin:0;
    padding:0;

}
html,body{
    
    margin:0;
    padding:0;
    font-family:Arial, Helvetica, sans-serif;

}
section{


    max-height:100vh;
    overflow:hidden;
}
img{
    display:block;
    height:40%;
    border:1px solid black;
    padding:5px;
}
section > h6{
    margin:0;padding:0;
    position:absolute;
}
div{

 
    width:100vw;
    
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    margin:0 auto;
    
}
</style>
</head>

<body>
    ${body}
   
</body>

</html>

`;
module.exports = async ({}) => {
  let _foundImageFiles;

  let _outputHTML;
  const _outputFile=path.join(process.cwd(),"._tidil-print-images.html");

  await require("exec-sequence").run({
    "Scan directory for image files": {
      //command: "exit 0",
      promise: () =>
        new Promise(async (resolve, reject) => {
          _foundImageFiles = await fse
            .readdirSync(process.cwd())
            .filter(
              filename =>
                filename.indexOf(".jpg") > -1 || filename.indexOf(".png")>-1
            );

          if (_foundImageFiles.length) {
            return resolve(
              `Found ${_foundImageFiles.length} images in ${process.cwd()}`
            );
          }

          reject(`No image files found in directory: ${process.cwd()}`);
        })
    },
    "Render to HTML and Save": {
      //command: "exit 0",
      promise: () =>
        new Promise(async (resolve, reject) => {
          _outputHTML = tpl(
            _foundImageFiles
              .map(
                file => `<section>
                      <h6>${file}</h6>
                      <div>
                          <img src="${file}">
                      </div>
                  </section>​`
              )
              .join("")
          ).replace(/\u200B/g,'');

         

          await fse.writeFileSync(_outputFile, _outputHTML);

          resolve(`Created file: ${path.relative(process.cwd(),_outputFile)}`);
        })
    },
    "Open in Browser": {
      command: `open ${_outputFile}`
    }
  });
};
