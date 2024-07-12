import express from "express";
import { sql_con } from "../back-lib/db.js";
const apiRouter = express.Router();

apiRouter.post('/upload_content', async (req, res, next) => {
    let status = true;
    console.log('들어는 오는거지~~~~~~~~~~~');
    const body = req.body;
    console.log(body);
    try {
        const insertLandQuery = "INSERT INTO land (ld_name, ld_content) VALUES (?,?)";
        await sql_con.promise().query(insertLandQuery, [body.title, body.contents]);
    } catch (error) {
        console.error(error.message);
        status = false;
    }

    res.json({ status })
})

export { apiRouter }