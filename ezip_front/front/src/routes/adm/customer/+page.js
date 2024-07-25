import { back_api } from "$src/lib/const";
import axios from "axios";

export const load = async ({ fetch, url, params }) => {
    let cu_data = [];
    let base_data = {};

    try {
        const res = await axios.post(`${back_api}/admin/load_customers`)
        if (res.data.status) {
            console.log(res.data);
            cu_data = res.data.cu_data;
            base_data = res.data.base_data;

        }
    } catch (error) {

    }

    return { cu_data, base_data }
}