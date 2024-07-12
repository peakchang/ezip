import express from "express";
import multer from "multer";
import path from "path";
import fs from 'fs'
import moment from "moment-timezone";

moment.tz.setDefault("Asia/Seoul");

const editorRouter = express.Router();

let img_upload = multer({
    storage: multer.diskStorage({
        // 경로를 설정
        destination(req, file, cb) {
            const setFolder = imgFolderChk();
            cb(null, setFolder);
        },
        filename(req, file, cb) {
            //파일명 설정
            cb(null, file.originalname);
        },
    }),
    // limits: { fileSize: 10 * 1024 * 1024 },
});

let editor_img_upload = multer({
    storage: multer.diskStorage({
        // 경로를 설정
        destination(req, file, cb) {
            console.log();
            const setFolder = editorFolderChk();

            cb(null, setFolder);
        },
        filename(req, file, cb) {
            //파일명 설정
            cb(null, file.originalname);
        },
    }),
    // limits: { fileSize: 10 * 1024 * 1024 },
});

function editorFolderChk() {
    let setFolder
    const now = moment().format('YYMMDD')



    try {
        fs.readdirSync(`uploads`);
    } catch (error) {
        fs.mkdirSync(`uploads`);
    }

    try {
        fs.readdirSync(`uploads/editor`);
    } catch (error) {
        fs.mkdirSync(`uploads/editor`);
    }

    try {
        fs.readdirSync(`uploads/editor/editor${now}`);
    } catch (error) {
        fs.mkdirSync(`uploads/editor/editor${now}`);
    }
    setFolder = `uploads/editor/editor${now}`


    return setFolder;
}

function imgFolderChk() {
    let setFolder
    const now = moment().format('YYMMDD')

    try {
        fs.readdirSync(`uploads`);
    } catch (error) {
        fs.mkdirSync(`uploads`);
    }

    try {
        fs.readdirSync(`uploads/img`);
    } catch (error) {
        fs.mkdirSync(`uploads/img`);
    }

    try {
        fs.readdirSync(`uploads/img/img${now}`);
    } catch (error) {
        fs.mkdirSync(`uploads/img/img${now}`);
    }
    setFolder = `uploads/img/img${now}`


    return setFolder;
}



editorRouter.post('/img_upload', img_upload.single('onimg'), async (req, res, next) => {

    let status = true;
    let baseUrl
    let saveUrl

    try {

        console.log(req.file);
        const lastFolderArr = req.file.destination.split('/');
        const lastFolder = lastFolderArr[lastFolderArr.length - 1];
        var origin = req.get('host');
        baseUrl = 'http://' + origin + '/img/' + lastFolder + '/' + req.file.filename;
        saveUrl = req.file.path

    } catch (error) {
        status = false;
    }


    res.json({ status, baseUrl, saveUrl })
})


editorRouter.post('/delete_img', async (req, res, next) => {
    let status = true;
    const body = req.body;
    const delPath = `uploads\\img\\${body.getFolder}\\${body.getImgName}`
    try {
        await fs.unlink(delPath, (err) => {

        })
    } catch (error) {
        status = false
        console.error(error);
    }
    res.json({ status })
})


editorRouter.post('/delete_imgs', async (req, res, next) => {
    let status = true;
    const body = req.body.paths;
    for (let i = 0; i < body.length; i++) {
        const data = body[i];
        const delPath = `uploads\\img\\${data.getFolder}\\${data.getImgName}`
        try {
            await fs.unlink(delPath, (err) => {

            })
        } catch (error) {
            status = false
            console.error(error);
        }
    }


    res.json({ status })
})


editorRouter.post('/delete_many_img', async (req, res, next) => {
    console.log('여기로는 일단 들어오지?!?!');
    let status = 'success';

    const deleteArr = req.body.deleteArr;
    console.log(deleteArr);
    for (let i = 0; i < deleteArr.length; i++) {
        const delPath = deleteArr[i].saveUrl
        console.log(delPath);
        try {
            await fs.unlink(delPath, (err) => {
            })
        } catch (error) {
            status = 'fail'
            console.error(error);
        }
    }

    res.json({ status })
})





editorRouter.post('/editor_img_upload', editor_img_upload.single('editorimg'), async (req, res, next) => {
    let baseUrl
    let saveUrl

    console.log(req.file);

    const lastFolderArr = req.file.destination.split('/');
    console.log(lastFolderArr);
    const lastFolder = lastFolderArr[lastFolderArr.length - 1];
    console.log(lastFolder);
    var origin = req.get('host');
    baseUrl = 'http://' + origin + '/editor/' + lastFolder + '/' + req.file.filename;
    saveUrl = req.file.path

    res.json({ baseUrl, saveUrl })
})


editorRouter.post('/video_upload', editor_img_upload.single('videofile'), async (req, res, next) => {
    let baseUrl
    let saveUrl


    const lastFolderArr = req.file.destination.split('/');
    console.log(lastFolderArr);
    const lastFolder = lastFolderArr[lastFolderArr.length - 1];
    console.log(lastFolder);
    var origin = req.get('host');
    baseUrl = 'http://' + origin + '/editor/' + lastFolder + '/' + req.file.filename;
    saveUrl = req.file.path


    res.json({ baseUrl, saveUrl })
})

editorRouter.post('/nosave_del', async (req, res, next) => {
    console.log('nosave_del router!!!');
    const data = req.body
    const deleteArr = data.deleteArr;


    for (let i = 0; i < deleteArr.length; i++) {
        const delPath = deleteArr[i];
        if (delPath != 'undefined') {
            try {
                fs.unlinkSync(delPath)
            } catch (error) {
                console.error(error);
            }
        }

    }


    res.json({})
})



export { editorRouter }