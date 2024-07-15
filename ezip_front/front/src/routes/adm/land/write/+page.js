import { back_api } from "$src/lib/const";
import axios from "axios";

export const load = async ({ fetch, url, params }) => {

    const get_id = url.searchParams.get('id');
    let modify_title = "";
    let modify_content = "";
    let modify_location = "";

    try {
        const res = await axios.post(`${back_api}/admin/get_modify_content`, { id: get_id })
        if (res.data.status) {
            modify_title = res.data.modifyData.ld_name;
            modify_content = res.data.modifyData.ld_content;
            modify_location = res.data.modifyData.ld_location;
        }
    } catch (error) {

    }

    return { get_id, modify_title, modify_content, modify_location }


}


