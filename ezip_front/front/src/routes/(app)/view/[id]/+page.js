

import axios from "axios";
import { back_api } from "$src/lib/const";
import moment from "moment-timezone";


export const load = async ({ params }) => {

    const getParams = params['id']
    let view_data = {}

    try {
        const res = await axios.post(`${back_api}/get_view`, { params: getParams })
        if(res.status){
            view_data = res.data.view_data
        }
    } catch (error) {

    }

    return { view_data }


}