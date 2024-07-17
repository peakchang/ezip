import { back_api } from "$src/lib/const";
import axios from "axios";

export const load = async ({ fetch, url, params }) => {
    let cu_data = [];
    const res = await axios.post(`${back_api}/admin/load_customers`)
    if (res.data.status) {
        console.log(res.data);
        cu_data = res.data.cu_data;
    }
    return { cu_data }
}