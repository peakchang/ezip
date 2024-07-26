import { back_api } from "$src/lib/const";
import axios from "axios";

export const load = async ({ fetch, url, params }) => {

    let inquiry_list = [];

    try {
        const res = await axios.post(`${back_api}/admin/load_inquiry_list`);
        if (res.data.status) {
            inquiry_list = res.data.inquiry_list;
        }
    } catch (error) {

    }


    return { inquiry_list }

}


