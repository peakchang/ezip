import { back_api } from "$src/lib/const";
import axios from "axios";

export const load = async ({ fetch, url, params }) => {

    let get_base = {}
    try {
        const res = await axios.post(`${back_api}/admin/load_base`)
        if (res.data.status) {
            get_base = res.data.get_base
        }
    } catch (error) {

    }

    return { get_base }
}