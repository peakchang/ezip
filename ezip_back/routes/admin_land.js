import express from "express";
import { sql_con } from "../back-lib/db.js";
import { getQueryStr } from "../back-lib/lib.js";

const adminLandRouter = express.Router();







adminLandRouter.post('/upload_land', async (req, res, next) => {
    let status = true;
    const body = req.body;
    console.log(body);
    if (body.type == 'upload') {
        const queryData = getQueryStr(body.allData, 'insert');
        try {
            const insertLandQuery = `INSERT INTO land (${queryData.str}) VALUES (${queryData.question})`
            await sql_con.promise().query(insertLandQuery, queryData.values);
        } catch (error) {
            console.error(error.message);
            status = false;
        }

    } else {
        delete body.allData['ld_created_at'];

        const queryData = getQueryStr(body.allData, 'update');
        queryData.values.push(body.allData['ld_id'])
        delete body.allData['ld_id'];
        try {
            const updateBoardQuery = `UPDATE land SET ${queryData.str} WHERE ld_id = ?`;
            await sql_con.promise().query(updateBoardQuery, queryData.values);
        } catch (error) {
            status = false;
            console.error(error.message);
        }
    }

    const imgList = body.contentArr
    for (let i = 0; i < imgList.length; i++) {
        if (imgList[i]) {
            try {
                fs.unlinkSync(imgList[i]);
            } catch (error) {
                console.error(error);

            }
        }
    }
    res.json({ status })
})





export { adminLandRouter }