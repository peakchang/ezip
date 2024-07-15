import { back_api } from "$src/lib/const";
import axios from "axios";

export const load = async ({ fetch, url, params }) => {

    let land_list = [];

    try {
        const res = await axios.get(`${back_api}/admin/load_land_list`);
        if (res.data.status) {
            land_list = res.data.land_list;
        }
    } catch (error) {

    }


    return { land_list }

}


