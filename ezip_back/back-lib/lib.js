import nodemailer from 'nodemailer';
import fs from 'fs'
import multer from "multer";
import moment from "moment-timezone";
import aligoapi from "aligoapi";

moment.tz.setDefault("Asia/Seoul");

export const mailSender = {
    // 메일발송 함수
    sendEmail: function (reciever, subject, content) {
        var transporter = nodemailer.createTransport({
            service: 'naver',   // 메일 보내는 곳
            prot: 465,
            host: 'smtp.naver.com',
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.N_MAIL_ID,
                pass: process.env.N_MAIL_PWD
            }
        });
        // 메일 옵션
        var mailOptions = {
            from: `${process.env.N_MAIL_ID}@naver.com`, // 보내는 메일의 주소
            to: reciever, // 수신할 이메일
            subject: subject, // 메일 제목
            html: content // 메일 내용
        };

        // 메일 발송    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}


export const getQueryStr = (data, type, addTimeStr = '') => {
    let returnData = {
        str: '',
        question: '',
        values: []
    }
    if (type == 'insert') {

        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key},`
            returnData['question'] = returnData['question'] + `?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {

            const now = moment().format('YYYY-MM-DD HH:mm:ss')
            returnData['str'] = returnData['str'] + addTimeStr;
            returnData['question'] = returnData['question'] + '?';
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
            returnData['question'] = returnData['question'].replace(/,$/, '');
        }

    } else if (type == 'update') {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        for (const key in data) {
            returnData['str'] = returnData['str'] + `${key}=?,`
            returnData['values'].push(data[key])
        }

        if (addTimeStr) {
            returnData['str'] = returnData['str'] + `${addTimeStr} = ?`;
            returnData['values'].push(now)
        } else {
            returnData['str'] = returnData['str'].replace(/,$/, '');
        }

    }

    return returnData;
}



export const aligoKakaoNotification_formanager = async (req, customerInfo) => {

    console.log('Kakao Message Send Is Started!!!!!!!!!!!!!!!!');
    try {
        const AuthData = {
            apikey: process.env.ALIGOKEY,
            // 이곳에 발급받으신 api key를 입력하세요
            userid: process.env.ALIGOID,
            // 이곳에 userid를 입력하세요
        }

        req.body = {
            type: 'i',  // 유효시간 타입 코드 // y(년), m(월), d(일), h(시), i(분), s(초)
            time: 1, // 유효시간
        }
        // console.log('req.body', req.body)

        const result = await new Promise((resolve, reject) => {
            if (true) {
                aligoapi.token(req, AuthData)
                    .then((r) => {
                        // console.log('alligo', r);
                        resolve(r);
                    })
                    .catch((e) => {
                        // console.error('err', e)
                        reject(e)
                    })
            } else {
                // console.log(2)
                resolve(true)
            }
        })

        req.body = {
            senderkey: process.env.ALIGO_SENDERKEY,
            tpl_code: 'TM_5684',
            token: result.token,
            sender: '010-4478-1127',
            receiver_1: '010-4478-1127',
            receiver_2: '010-2190-2197',
            subject_1: '분양정보 신청고객 알림톡',
            message_1: `고객 인입 안내!
  ${customerInfo.ciSite} ${customerInfo.ciName}님 접수되었습니다.
  고객 번호 : ${customerInfo.ciReceiver}`,
        }

        // console.log(req.body);

        let resultSend = await new Promise((resolve, reject) => {
            if (true) {

                // console.log('kakao send arrived~~!!');
                // console.log(req.body);
                // console.log(AuthData);
                aligoapi.alimtalkSend(req, AuthData).then((r) => {
                    // console.log('alligo', r);
                    console.log('kakao send is success!!!!!!!!!!!!');
                    resolve(true);
                }).catch((e) => {
                    console.error('err', e)
                    console.log('kakao send is false T.T');
                    reject(false);
                })
            } else {
                console.log('kakao send is false T.T');
                // console.log(2)
                resolve(true)
            }
        })
    } catch (e) {
        // await db.rollback(connection);
        // next(e);
        console.error(e);
    }
}