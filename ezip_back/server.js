import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config();

import { adminRouter } from './routes/admin.js'
import { adminLandRouter } from './routes/admin_land.js'
import { apiRouter } from './routes/api.js'
import { authRouter } from './routes/auth.js'
import { editorRouter } from './routes/editor.js';
import { quillEditorRouter } from './routes/quill_editor.js';


app.set('port', process.env.PORT || 4002);
app.set('trust proxy', '127.0.0.1');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET))

// ESM 오류 해결을 위해 __dirname, __filename 직접 변수 작성
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static('public', { ignore: ['favicon.ico'] }));
app.use('/editor', express.static(path.join(__dirname, 'uploads/editor')));
app.use('/img', express.static(path.join(__dirname, 'uploads/img')));
app.use('/profile', express.static(path.join(__dirname, 'uploads/profile')));


let corsOptions = {
    // 여기는 svelte (프론트엔드) 가 돌아가는 주소
    origin: true,
    // optionsSuccessStatus: 200,
    credentials: true
}
app.use(cors(corsOptions));


app.use('/api/v9/admin', adminRouter);
app.use('/api/v9/admin_land', adminLandRouter);

app.use('/api/v9/editor', editorRouter);
app.use('/api/v9/auth', authRouter);
app.use('/api/v9/', apiRouter);
app.use('/api/v9/quill_editor', quillEditorRouter);


app.get('/chkserver', (req, res) => {
    res.send('서버 생성 완료!!!!')
})


app.listen(app.get('port'), () => {
    console.log(`server running in port ${app.get('port')}`);
})
