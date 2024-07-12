import express from "express";
import bcrypt from "bcrypt";
import { sql_con } from "../back-lib/db.js";
import moment from "moment-timezone";
import jwt from 'jsonwebtoken'
import { mailSender, getQueryStr } from "../back-lib/lib.js";

import cookieParser from 'cookie-parser';
import axios from "axios";

moment.tz.setDefault("Asia/Seoul");

const authRouter = express.Router();



authRouter.post('/join', async (req, res, next) => {
    const body = req.body;
    let status = true;
    let message;
    console.log(body);
    console.log('*******************************');

    try {
        body['mb_pwd'] = await bcrypt.hash(body.mb_pwd, 12);
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const mbStr = getQueryStr(body, 'insert', 'mb_created_at')
        console.log(mbStr);
        const joinQuery = `INSERT INTO members (${mbStr.str}) VALUES (${mbStr.question})`;
        console.log(joinQuery);
        await sql_con.promise().query(joinQuery, mbStr.values);
    } catch (error) {
        status = false;
        console.error(error.message);
        if (error.message.includes('mb_email')) {
            message = '이미 가입된 이메일 입니다. 다른 이메일 주소를 입력해주세요.'
        } else if (error.message.includes('mb_phone')) {
            message = '이미 가입된 전화번호 입니다. 다른 전화번호를 입력해주세요.'
        } else if (error.message.includes('mb_nick')) {
            message = '사용중인 닉네임 입니다. 다른 닉네임을 입력해주세요.'
        }
    }

    res.json({ status, message })
})

// 회원가입 시 이메일 인증 발송하기
authRouter.use('/join_email_chk', async (req, res, next) => {
    console.log('일단 여기는 들어오니?!?!?!');
    let status = true;
    let duplicated = false;
    try {
        const chkEmailQuery = 'SELECT mb_email FROM members WHERE mb_email = ?';
        const chkEmail = await sql_con.promise().query(chkEmailQuery, [req.body.email]);
        const chk_mail = chkEmail[0][0]
        console.log(chk_mail);

        const insertAuthInfo = "INSERT INTO auth_temp (at_email, at_authnum) VALUES (?, ?)";
        await sql_con.promise().query(insertAuthInfo, [req.body.email, req.body.randomNumber]);
        console.log(chk_mail);
        if (!chk_mail) {
            duplicated = false;
            const emailTemplate = `
            <div style="width:80%; border:1px solid #EAEAEA; margin: 0 auto; padding: 15px; border-radius:10px;">
                <div style="background-color:#D9E5FF; padding:15px; border-radius:10px; font-size: 16px; color:#003399;">
                    올댓분양 이메일 인증 입니다. 아래 인증번호를 입력해주세요.
                </div>
                <div style="padding:15px; font-weight:800; margin:20px 0 50px 0;">
                    인증번호 : ${req.body.randomNumber}
                </div>
                <div style="background-color:#FAE0D4; padding:10px; border-radius:10px; font-size: 14px; color:#993800; line-height: 30px;">
                    <p>● 인증번호는 3분동안만 유효합니다.</p>
                    <p>● 인증번호 유효시간이 지나면 재인증 요청하셔야 합니다.</p>
                </div>
            </div>
            `
            mailSender.sendEmail(req.body.email, '올댓 분양 회원가입 이메일 인증 입니다.', emailTemplate)
        } else {
            duplicated = true;
        }

    } catch (error) {
        status = false;
        console.error(error.message);
    }

    res.json({ status, duplicated })
})

// 이메일 인증 후 데이터 삭제까지!
authRouter.use('/join_email_auth_chk', async (req, res, next) => {

    console.log(req.body);
    let status = true;
    let message = "";
    let auth_info = {};
    try {
        // 인증정보는 이메일 / 인증번호 확인 후 맞으면 체크 하자!
        const getAuthInfoQuery = "SELECT * FROM auth_temp WHERE at_email = ? AND at_authnum = ?";
        const getAuthInfo = await sql_con.promise().query(getAuthInfoQuery, [req.body.email, req.body.authNumber]);
        auth_info = getAuthInfo[0][0]
        if (!auth_info) {
            status = false;
            message = "인증에 실패했습니다. 이메일 / 인증번호를 확인해주세요"
        } else {
            const deleteAuthQuery = "DELETE FROM auth_temp WHERE at_email = ? AND at_authnum = ?"
            await sql_con.promise().query(deleteAuthQuery, [req.body.email, req.body.authNumber]);
        }
        console.log(auth_info);
    } catch (error) {
        message = "인증에 실패했습니다. 이메일 / 인증번호를 확인해주세요"
    }
    res.json({ status, auth_info, message })
})

authRouter.use('/email_auth_over_time', async (req, res, next) => {

    let status = true;
    const body = req.body;
    const email = body.email;
    try {
        const deleteEmailAuthQuery = "DELETE FROM auth_temp WHERE at_email = ?";
        await sql_con.promise().query(deleteEmailAuthQuery, [email]);
    } catch (error) {
        status = false;
    }

    res.json({ status })
})



authRouter.use('/join_phone_chk', async (req, res, next) => {

    console.log('일단 여기는 들어오니?!?!?!');
    let status = true;
    let duplicated = false;
    try {
        const chkPhoneQuery = 'SELECT mb_phone FROM members WHERE mb_phone = ?';
        const chkPhone = await sql_con.promise().query(chkPhoneQuery, [req.body.cleanPhoneNum]);
        const chk_phone = chkPhone[0][0]

        if (!chk_phone) {
            const insertAuthInfo = "INSERT INTO auth_temp (at_email, at_authnum) VALUES (?, ?)";
            await sql_con.promise().query(insertAuthInfo, [req.body.cleanPhoneNum, req.body.randomNumber]);
            duplicated = false;

            // 여기서는 문자 발송하기~~~

        } else {
            duplicated = true;
        }

    } catch (error) {
        status = false;
        console.error(error.message);
    }

    res.json({ status, duplicated })
})

authRouter.use('/join_phone_auth_chk', async (req, res, next) => {

    console.log(req.body);
    let status = true;
    let message = "";
    let auth_info = {};
    try {
        // 인증정보는 이메일 / 인증번호 확인 후 맞으면 체크 하자!
        const getAuthInfoQuery = "SELECT * FROM auth_temp WHERE at_email = ? AND at_authnum = ?";
        const getAuthInfo = await sql_con.promise().query(getAuthInfoQuery, [req.body.cleanPhoneNum, req.body.authNumber]);
        auth_info = getAuthInfo[0][0]
        if (!auth_info) {
            status = false;
            message = "인증에 실패했습니다. 휴대폰 번호 / 인증번호를 확인해주세요"
        } else {
            const deleteAuthQuery = "DELETE FROM auth_temp WHERE at_email = ? AND at_authnum = ?"
            await sql_con.promise().query(deleteAuthQuery, [req.body.cleanPhoneNum, req.body.authNumber]);
        }
        console.log(auth_info);
    } catch (error) {
        message = "인증에 실패했습니다. 휴대폰 번호 / 인증번호를 확인해주세요"
    }
    res.json({ status, auth_info, message })
})


authRouter.use('/phone_auth_over_time', async (req, res, next) => {
    let status = true;
    const body = req.body;
    const cleanPhoneNum = body.cleanPhoneNum;
    try {
        const deleteEmailAuthQuery = "DELETE FROM auth_temp WHERE at_email = ?";
        await sql_con.promise().query(deleteEmailAuthQuery, [cleanPhoneNum]);
    } catch (error) {
        console.error(error.message);
        status = false;
    }

    res.json({ status })
})

// 닉네임 중복 체크 (input창 focus out시)
authRouter.use('/join_nick_chk', async (req, res, next) => {

    let status = 'success';
    let duplicated = false;
    try {
        const chkNickQuery = 'SELECT mb_nick FROM members WHERE mb_nick = ?';
        const chkNick = await sql_con.promise().query(chkNickQuery, [req.body.nickname]);
        const chk_nick = chkNick[0][0]
        if (!chk_nick) {
            duplicated = false;
        } else {
            duplicated = true;
        }

    } catch (error) {
        status = 'fail'
        console.error(error.message);
    }

    res.json({ status, duplicated })
})


// 로그인 영역

authRouter.post('/login', async (req, res, next) => {
    let status = true;
    const body = req.body;
    let message = ""
    let user_info = {}
    try {

        // (1) 회원 정보 찾기~!
        const getUserInfoQuery = "SELECT * FROM members WHERE mb_email = ?";
        const getUserInfo = await sql_con.promise().query(getUserInfoQuery, [req.body.email]);
        let userInfo = getUserInfo[0][0]
        console.log(userInfo);
        // 일치하는 정보 (이메일) 없으면 에러 리턴!
        if (!userInfo) {
            status = false;
            message = "가입된 이메일이 없습니다."
            return res.json({ status, message })
        }
        console.log('11111');

        // (2) 비밀번호 대조!
        const pwdCompare = await bcrypt.compare(req.body.password, userInfo.mb_pwd);
        // 비밀번호 틀리면 에러 리턴!
        if (!pwdCompare) {
            status = false;
            message = "비밀번호가 일치하지 않습니다."
            return res.json({ status, message })
        }
        console.log('22222');

        // (3) 이메일 / 비밀번호 정상일시 쿠키에 토큰 등록 / DB에 토큰 입력 하고 리턴!
        // 토큰 생성
        const token = jwt.sign(
            { userId: userInfo.mb_id },
            process.env.JWT_SECRET_KEY,
        );
        console.log(token);


        res.cookie('token', token, { sameSite: 'lax', httpOnly: true, path: '/' });
        const updateTokenQuery = "UPDATE members SET mb_token = ? WHERE mb_id = ?";
        await sql_con.promise().query(updateTokenQuery, [token, userInfo.mb_id]);

        console.log(userInfo);

        user_info = {
            email: userInfo.mb_email,
            nick: userInfo.mb_nick,
            rate: userInfo.mb_rate,
            thumbnail: userInfo.mb_thumbnail
        }
    } catch (error) {
        status = false;
        message = error.message;
    }

    console.log(user_info);
    res.json({ status, user_info })
})

// 카카오 체크

authRouter.post('/kakaochk', async (req, res, next) => {
    const data = req.body;
    const chkKakaoUserQuery = "SELECT * FROM members WHERE mb_email = ?"
    const chkKakaoUser = await sql_con.promise().query(chkKakaoUserQuery, [data.email]);
    const chk_kakao_user = chkKakaoUser[0][0];
    if (chk_kakao_user && chk_kakao_user.mb_phone && chk_kakao_user.mb_provider === 'kakao') {
        req.body.password = 'dlkfjsldjf'
        passport.authenticate('signin', async (err, user, info) => {

            if (!user) {
                // 유저 못찾았을시 에러 메세지와 함께 리턴
                return res.status(400).json({ message: info.message });
            }

            try {
                // 토큰 생성

                const token = jwt.sign(
                    { userId: user.mb_id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '7d' }
                );


                const cookieTime = 7 * 24 * 60 * 60 * 1000;
                res.cookie('token', token, { sameSite: 'lax', httpOnly: true, path: '/', maxAge: cookieTime });

                const updateTokenQuery = "UPDATE members SET mb_token = ? WHERE mb_id = ?";
                await sql_con.promise().query(updateTokenQuery, [token, user.mb_id]);

                const user_info = {
                    email: user.mb_email,
                    nick: user.mb_nick,
                    rate: user.mb_rate,
                    profile: user.mb_thumbnail,
                    like_type: user.mb_like_type,
                    like_area: user.mb_like_area,
                    like_position: user.mb_like_position
                }

                return res.json({ user_info, status: 'success' });
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }


        })(req, res, next);
        // 동일 이메일은 있는데 mb_provider가 kakao가 아닌경우에는 리턴해서 정보 받기
    } else {
        return res.status(400).json({ status: 'fail' });
    }
})

// 카카오 로그인

authRouter.post('/kakaologin', async (req, res, next) => {
    const data = req.body
    console.log(data);


    try {
        const insertKakaoUserQuery = "INSERT INTO members (mb_name, mb_email, mb_phone,mb_nick, mb_thumbnail, mb_provider) VALUES (?,?,?,?,?,?)";
        await sql_con.promise().query(insertKakaoUserQuery, [data.name, data.email, data.phone, data.nickname, data.thumbnail, data.type]);

        req.body.password = 'nonono'
        passport.authenticate('signin', async (err, user, info) => {
            console.log(user);

            if (!user) {
                // 유저 못찾았을시 에러 메세지와 함께 리턴
                return res.status(400).json({ message: info.message });
            }

            try {
                // 토큰 생성

                const token = jwt.sign(
                    { userId: user.mb_id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '7d' }
                );

                const cookieTime = 7 * 24 * 60 * 60 * 1000;

                res.cookie('token', token, { sameSite: 'lax', httpOnly: true, path: '/', maxAge: cookieTime });
                const updateTokenQuery = "UPDATE members SET mb_token = ? WHERE mb_id = ?";
                await sql_con.promise().query(updateTokenQuery, [token, user.mb_id]);

                const user_info = {
                    email: user.mb_email,
                    nick: user.mb_nick,
                    rate: user.mb_rate,
                    profile: user.mb_thumbnail,
                    like_type: user.mb_like_type,
                    like_area: user.mb_like_area,
                    like_position: user.mb_like_position
                }

                const obj = { userName: data.name, receiver: data.phone }
                aligoJoinMessage(req, obj)

                return res.json({ user_info });
            } catch (error) {
                console.log('여기서 에러가 나지는 않겠지?!?!?!??!?!?!');
                return res.status(400).json({ message: error.message });
            }


        })(req, res, next);
        // await sql_con.promise().query(insertKakaoUserQuery, [token, user.mb_id]);
    } catch (error) {
        console.error(error.message);
    }
})


// 로그아웃
authRouter.post('/logout', async (req, res, next) => {
    let status = true;
    // 로그아웃시에 DB에 저장되어 있는 토큰 없애보리기
    try {
        const logoutQuery = `UPDATE members SET mb_token = NULL WHERE mb_email = ?`;
        await sql_con.promise().query(logoutQuery, [req.body.email]);
    } catch (error) {
        status = false;
    }
    res.cookie('token', '', { sameSite: 'lax', path: '/', maxAge: 0 });
    res.json({ status })
})


// 비밀번호 재발급 이메일 발송
// mbtoken을 쓸일이 없으니 여기다 토큰 넣고 get으로 보내서 체크하자 걍
authRouter.post('/send_reset_pwd', async (req, res, next) => {

    let chkEmailQuery;
    let chkEmail;
    let chk_email;

    try {
        chkEmailQuery = "SELECT * FROM members WHERE mb_email = ?";
        chkEmail = await sql_con.promise().query(chkEmailQuery, [req.body.receiveEmail]);
        chk_email = chkEmail[0][0];
        if (!chk_email) {
            throw Error('가입된 이메일이 없습니다. 다시 확인해주세요.')
        } else if (chk_email.mb_provider) {
            throw Error(`${chk_email.mb_provider}로 가입된 이메일입니다. ${chk_email.mb_provider} 로그인으로 시도해주세요.`)
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }

    const token = jwt.sign(
        { userId: chk_email.mb_id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
    );

    try {
        const updateEmailTokenQuery = "UPDATE members SET mb_token = ? WHERE mb_email = ?";
        await sql_con.promise().query(updateEmailTokenQuery, [token, chk_email.mb_email]);
    } catch (error) {
        return res.status(401).json({ message: "에러가 발생했습니다. 다시 시도해주세요" });
    }

    const template = `
    <div style="box-shadow: 1px 5px 7px 3px #BDBDBD; text-center; padding: 15px; border-radius: .5rem; text-align:center; width:90%; margin: 0 auto;"><p>파인드 분양 비밀번호 재설정 하기!</p><p>아래 링크를 클릭해서 비밀번호를 재설정 해주세요!</p><a href="${process.env.SITE_LINK ? process.env.SITE_LINK : "http://localhost:5173"}/auth/chkpwd?tk=${token}"><button style="background-color:#008299; color:white; padding: 10px 30px; border:none; font-size:1rem; border-radius:.5rem;">파인드 분양 비밀번호 재설정 페이지 바로가기 클릭!</button></a></div>
    `
    mailSender.sendEmail(chk_email.mb_email, '파인드분양 비밀번호 재설정', template);
    return res.json({ status: 'success' })
})

// 비밀번호 재발급 링크 체크
authRouter.post('/chk_reset_pwd', async (req, res, next) => {
    const getToken = req.body.token;
    jwt.verify(getToken, process.env.JWT_SECRET_KEY, async (err, data) => {
        if (err) return res.status(401).json({ message: '올바른 링크가 아닙니다. 다시 확인해주세요!' })

        try {
            const userId = data.userId;
            const getUserInfoQuery = "SELECT * FROM members WHERE mb_id = ?"
            const getUserInfo = await sql_con.promise().query(getUserInfoQuery, [userId]);
            const get_user = getUserInfo[0][0];
            if (get_user.mb_token != getToken) {
                throw new Error('토큰 정보가 올바르지 않습니다.')
            }
            return res.json({ status: 'success', email: get_user.mb_email })
        } catch (error) {
            return res.status(401).json({ message: error.message })
        }
    });
})




// 비밀번호 비밀번호 재설정 하기
authRouter.post('/change_pwd', async (req, res, next) => {


    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const updatePasswordQuery = "UPDATE members SET mb_pwd =? WHERE mb_email =?";
        await sql_con.promise().query(updatePasswordQuery, [hash, req.body.receiveEmail]);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: '에러가 발생했습니다. 다시 시도해주세요.' })
    }
    return res.status(200).json({ status: 'success' })
})







authRouter.get('/', async (req, res, next) => {

    const getToken = req.cookies.token;

    let status = "success";
    if (!getToken) {
        status = 'fail'
        return res.json({ message: 'Token missing', status })
    }
    // 토큰 검증 시작
    // 0. payload에 담겨있는 값으로 user 정보 찾기

    jwt.verify(getToken, process.env.JWT_SECRET_KEY, async (err, data) => {
        if (err) {
            status = 'fail'
            return res.json({ message: err.message, status })
        }
        // 1. DB 내 토큰과 일치하는지 확인 (일치하지 않으면 토큰 정보가 잘못되었습니다~ 하면서 리턴)
        try {
            const getUserQuery = "SELECT * FROM members WHERE mb_id = ?";
            const getUser = await sql_con.promise().query(getUserQuery, [data.userId]);
            const get_user = getUser[0][0];
            if (get_user.mb_token == getToken) {
                const tokenRemaning = needTokenRefresh(data.iat, data.exp)
                if (tokenRemaning) {
                    // 토큰 재발급 및 DB / 쿠키에 저장하기
                    const token = jwt.sign(
                        { userId: get_user.mb_id },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '7d' }
                    );
                    res.cookie('token', token, { sameSite: 'lax', httpOnly: true, path: '/', maxAge: 259200 });
                    const updateTokenQuery = "UPDATE members SET mb_token = ? WHERE mb_id = ?";
                    await sql_con.promise().query(updateTokenQuery, [token, get_user.mb_id]);
                }
                // 2. 토큰 정상이면 user 정보 받아서 user_info 만들어서 반환
                const user_info = {
                    email: get_user.mb_email,
                    nick: get_user.mb_nick,
                    rate: get_user.mb_rate,
                    like_type: get_user.mb_like_type,
                    like_area: get_user.mb_like_area,
                    like_position: get_user.mb_like_position,
                    profile: get_user.mb_thumbnail
                }
                return res.json({ user_info, status })
            } else {
                status = 'fail'
                return res.json({ message: '토큰 정보가 잘못되었습니다.', status })
            }
        } catch (error) {
            status = 'fail'
            return res.json({ message: error.message, status })
        }
    });
})










function needTokenRefresh(iat, exp) {
    const remainingTime = exp - Math.floor(Date.now() / 1000);
    const threeDaysInSeconds = 3 * 24 * 60 * 60;
    return remainingTime < threeDaysInSeconds;
}
export { authRouter }