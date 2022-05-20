const catalyst = require('zcatalyst-sdk-node');
var Readable = require('stream').Readable;
var fs = require("fs");

//THIS WONT WORK AS ITS BASICIO

module.exports = (context, basicIO) => {

    console.log('in downloadfile method');
    const catalystApp = catalyst.initialize(context);
    let filestore = catalystApp.filestore();

    let fileId = basicIO.getParameter("file_id");
    let filename = basicIO.getParameter("filename");
    console.log('fileId is  ' + fileId + '  filename is  ' + filename);

    filestore.folder('3296000000603182').downloadFile(fileId).then((fileObject) => {
        fileObject.data.pipe(basicIO);

        var stream = new Readable();
        stream.push(fileObject);
        stream.push(null);
        basicIO.setHeader('Content-Disposition', 'attachment; filename=' + filename);
        basicIO.setHeader('Content-Type', 'image/jpeg');
        basicIO.write(stream);

    }).catch(err => {
        basicIO.write("Error occurred during download of  file ......" + err);
    })

    console.log('successfully downloaded file');
    context.close(); //end of application
};