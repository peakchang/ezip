import express from "express";
import { sql_con } from "../back-lib/db.js";
const adminRouter = express.Router();



// 기본 베이스 작업~~~~

adminRouter.post('/load_base', async (req, res, next) => {
    let status = true;
    const body = req.body;
    console.log(body);
    let get_base = {};

    try {
        const getBaseQuery = "SELECT * FROM base WHERE base = 'base'";
        const getBase = await sql_con.promise().query(getBaseQuery);
        get_base = getBase[0][0];
    } catch (error) {
        status = false;
    }


    res.json({ status, get_base })
})


adminRouter.post('/update_base', async (req, res, next) => {
    let status = true;
    const body = req.body;
    console.log(body);

    try {

        // 먼저 있는지 체크 부터~
        const getBaseQuery = "SELECT * FROM base WHERE base = 'base'";
        const getBase = await sql_con.promise().query(getBaseQuery);
        console.log(getBase[0][0]);
        if (getBase[0][0]) {
            // 업데이트 하기~
            const updateBaseQuery = "UPDATE base SET status_list =?, color_list =? WHERE base = 'base'";
            await sql_con.promise().query(updateBaseQuery, [body.status_list, body.color_list]);
        } else {
            // insert 하기~
            const insertBaseQuery = "INSERT INTO base (base, status_list, color_list) VALUES (?,?,?)";
            await sql_con.promise().query(insertBaseQuery, ['base', body.status_list, body.color_list]);
        }
    } catch (error) {
        status = false;
    }

    res.json({ status })
})



adminRouter.post('/delete_land', async (req, res, next) => {
    let status = true;
    const body = req.body;
    const deleteList = body.delete_list;

    console.log(deleteList);

    try {
        for (let i = 0; i < deleteList.length; i++) {
            const deleteListQuery = "DELETE FROM land WHERE ld_id = ?";
            await sql_con.promise().query(deleteListQuery, [deleteList[i]]);
        }
    } catch (error) {
        status = false;
    }

    res.json({ status })
})



adminRouter.post('/load_customers', async (req, res, next) => {
    let status = true;
    let cu_data = [];
    let base_data = {};
    try {
        const getBaseQuery = "SELECT * FROM base WHERE base = 'base'";
        const getBase = await sql_con.promise().query(getBaseQuery);
        base_data = getBase[0][0];
        const loadCustomersQuery = "SELECT cu_info.*, land.ld_location FROM cu_info LEFT JOIN land ON cu_info.cu_land = land.ld_id ORDER BY cu_id DESC"
        const loadCustomers = await sql_con.promise().query(loadCustomersQuery);
        cu_data = loadCustomers[0];
    } catch (error) {

    }

    res.json({ status, cu_data, base_data })
})




// 어드민 현장 업로드 부분~~~~~
adminRouter.post('/upload_content', async (req, res, next) => {
    let status = true;
    console.log('들어는 오는거지~~~~~~~~~~~');
    const body = req.body;
    console.log(body);
    try {
        const insertLandQuery = "INSERT INTO land (ld_name, ld_content, ld_location) VALUES (?,?,?)";
        await sql_con.promise().query(insertLandQuery, [body.title, body.contents, body.location]);
    } catch (error) {
        console.error(error.message);
        status = false;
    }

    res.json({ status })
})

adminRouter.post('/update_content', async (req, res, next) => {
    let status = true;
    console.log('들어는 오는거지~~~~~~~~~~~');
    const body = req.body;
    console.log(body);
    try {
        const insertLandQuery = "UPDATE land SET ld_name = ?, ld_content =?, ld_location=? WHERE ld_id = ?";
        await sql_con.promise().query(insertLandQuery, [body.title, body.contents, body.location, body.getId]);
    } catch (error) {
        console.error(error.message);
        status = false;
    }

    res.json({ status })
})



// land list 불러오는 부분
adminRouter.get('/load_land_list', async (req, res, next) => {
    let status = true;
    let land_list = [];
    try {
        const loadLandListQuery = "SELECT * FROM land ORDER BY ld_id DESC";
        const loadLandList = await sql_con.promise().query(loadLandListQuery);
        land_list = loadLandList[0];
    } catch (error) {
        status = false;
    }

    res.json({ status, land_list })
})

// 수정할 content 불러오는 부분
adminRouter.post('/get_modify_content', async (req, res, next) => {
    let status = true;

    let modifyData = {};
    const getId = req.body.id
    console.log(getId);

    try {

        const getModyfyContentQuery = "SELECT * FROM land WHERE ld_id = ?";
        const getModyfyContent = await sql_con.promise().query(getModyfyContentQuery, [getId]);
        const modifyContent = getModyfyContent[0];
        console.log(modifyContent);
        modifyData = modifyContent[0]

    } catch (error) {
        status = false;
    }
    res.json({ status, modifyData })
})




export { adminRouter }