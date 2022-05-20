//This is a microservice for fetching the list of images from pixabay
var path = require('path');
var fs = require('fs');
var axios = require('axios');
const catalyst = require('zcatalyst-sdk-node');


module.exports = async(context, basicIO) => {
    const catalystApp = catalyst.initialize(context);
    // var URL = basicIO.getArgument(url) ; //where to use this ?
    var URL = 'http://www.cartoonbucket.com/wp-content/uploads/2015/08/Ursula-Holding-Mickey-Mouse.jpg';
    infoSent = await upload2FS(URL, catalystApp);
    console.log(infoSent);

    // basicIO.getParameter("file_id");

    //								res.send('<img id="theImg" src="/baas/v1/project/343000000063001/folder/343000000106004/file/' + newuploadedFile.id + '/download" >');
    //  var mailContents = "https://click2call-698833516.development.zohocatalyst.com/server/click_2_call/download?fileId=" + uploadedFile.id;

    //TODO: need to send back the url for download , both of these fail

    // basicIO.write('File Uploaded. Download from :-  ' + 'https://fetchimage4murlandupload2fs-698833516.development.catalystserverless.com/server/fetch_image_4_m_url_and_upload_2_fs_function/download?fileId=' + infoSent[0]);
    //THIS WONT WORK AS WE DO NOT SUPPORT UNAUTHENTICATED FILE DOWNLOAD URL
    // basicIO.write('     File Uploaded. Download from :-  ' + 'https://fetchimage4murlandupload2fs-698833516.development.catalystserverless.com/baas/v1/project/3296000000603141/folder/3296000000603182/file/' + infoSent[0] + '/download');
    basicIO.write(infoSent);
    context.close();
};

const upload2FS = async(fileUrl, catalystApp) => {
    console.log('in downloadImages ');
    try {
        let filestore = catalystApp.filestore();
        var info2send = [];

        const fileName = path.basename(fileUrl);
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        });
        let uploadedfolder = await filestore.folder('3296000000603182');

        let uploadedfile = await uploadedfolder.uploadFile({
            code: response.data,
            name: fileName
        });

        info2send.push(uploadedfile.id);
        info2send.push(fileName);
        console.log(info2send);
        return info2send;

    } catch (err) {
        console.log(err);
    }
};