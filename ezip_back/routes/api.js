import express from "express";
import { sql_con } from "../back-lib/db.js";
const apiRouter = express.Router();




apiRouter.post('/get_view', async (req, res, next) => {
    let status = true;
    let view_data = [];
    const body = req.body;
    try {
        const loadViewDataQuery = "SELECT * FROM land WHERE ld_id = ?";
        const loadView = await sql_con.promise().query(loadViewDataQuery, [body.params]);
        view_data = loadView[0][0];
    } catch (error) {

    }

    res.json({ status, view_data })
})


// 메인 페이지 리스트 불러오기~~
apiRouter.post('/load_land_list', async (req, res, next) => {
    let status = true;
    let land_list = [];

    const body = req.body;
    const getLocation = body.getLocation;
    let addQuery = ""
    console.log(body);

    if(getLocation && getLocation != '전체'){
        addQuery = `WHERE ld_location = '${getLocation}'`
    }

    try {
        const loadLandListQuery = `SELECT * FROM land ${addQuery}`;
        console.log(loadLandListQuery);
        const loadLandList = await sql_con.promise().query(loadLandListQuery);
        land_list = loadLandList[0];
    } catch (error) {

    }

    res.json({ status, land_list })
})


export { apiRouter }