import express from "express";
import multer from "multer";
import fs from 'fs'
import moment from "moment-timezone";

moment.tz.setDefault("Asia/Seoul");

const quillEditorRouter = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        // 경로를 설정
        destination(req, file, cb) {
            const setFolder = fonderChk();
            cb(null, setFolder);
        },
        filename(req, file, cb) {
            //파일명 설정
            cb(null, file.originalname);
        },
    }),
    // limits: { fileSize: 10 * 1024 * 1024 },
});

quillEditorRouter.post('/onimg_upload', upload.single('onimg'), async (req, res, next) => {
    let baseUrl
    let saveUrl
    if (req.method === 'POST') {
        const lastFolderArr = req.file.destination.split('/');
        const lastFolder = lastFolderArr[lastFolderArr.length - 1];
        const currentUrl = req.protocol + '://' + req.get('host')
            ;
        baseUrl = currentUrl + '/editor/' + lastFolder + '/' + req.file.filename;
        saveUrl = req.file.path
    }
    res.json({ baseUrl, saveUrl })
})


quillEditorRouter.post('/img_upload', upload.single('editorimg'), async (req, res, next) => {
    let baseUrl
    let saveUrl
    if (req.method === 'POST') {
        const lastFolderArr = req.file.destination.split('/');
        const lastFolder = lastFolderArr[lastFolderArr.length - 1];
        const currentUrl = req.protocol + '://' + req.get('host')
            ;
        baseUrl = currentUrl + '/editor/' + lastFolder + '/' + req.file.filename;
        saveUrl = req.file.path
    }
    res.json({ baseUrl, saveUrl })
})


quillEditorRouter.post('/video_upload', upload.single('videofile'), async (req, res, next) => {
    let baseUrl
    let saveUrl
    if (req.method === 'POST') {
        const lastFolderArr = req.file.destination.split('/');
        const lastFolder = lastFolderArr[lastFolderArr.length - 1];
        var origin = req.get('origin');
        baseUrl = origin + '/editor/' + lastFolder + '/' + req.file.filename;
        saveUrl = req.file.path
    }
    res.json({ baseUrl, saveUrl })
})

quillEditorRouter.post('/nosave_del', async (req, res, next) => {
    const data = req.body
    const deleteArr = data.deleteArr;

    for (let i = 0; i < deleteArr.length; i++) {
        const delPath = deleteArr[i];
        try {
            fs.unlinkSync(delPath)
        } catch (error) {
            console.error(error);
        }
    }
    res.json({})
})

quillEditorRouter.post('/delete_img', async (req, res, next) => {
    let status = true;
    const body = req.body;
    const delPath = `public\\uploads\\editor\\${body.getFolder}\\${body.getImgName}`

    try {
        await fs.unlink(delPath, (err) => {

        })
    } catch (error) {
        status = false
        console.error(error);
    }
    res.json({ status })
})

function fonderChk() {
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


export { quillEditorRouter }