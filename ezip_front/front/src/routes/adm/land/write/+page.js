import { back_api } from "$src/lib/const";
import axios from "axios";

export const load = async ({ fetch, url, params }) => {

    const get_id = url.searchParams.get('id');
    let all_data = {}

    try {
        const res = await axios.post(`${back_api}/admin/get_modify_content`, { id: get_id })
        if (res.data.status) {
            console.log(res.data);
            all_data = res.data.modifyData;

        }
    } catch (error) {

    }



    return { get_id, all_data }


}


