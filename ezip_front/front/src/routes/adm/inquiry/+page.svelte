<script>
    import axios from "axios";
    import moment from "moment-timezone";
    import { invalidateAll } from "$app/navigation";
    import { back_api } from "$src/lib/const";
    import { formatPhoneNumber } from "$lib/lib";


    let allData = [];
    export let data;
    $: data, setData();
    function setData() {
        allData = data.inquiry_list;
        console.log(allData);
    }
</script>

<div class="mb-5">
    <button> testgogo </button>
</div>

<div class="w-full min-w-[600px] overflow-auto">
    <div class="w-full max-w-[1000px]">
        <table class="w-full text-center">
            <tr>
                <th class="py-1 border">이름</th>
                <th class="py-1 border">전화번호</th>
                <th class="py-1 border">접수시간</th>
                <th class="py-1 border">상태</th>
            </tr>
            {#each allData as data, idx}
                <tr>
                    <td class="py-2 border">
                        {allData[idx]['cl_name']}
                    </td>
                    <td class="py-2 border">
                        {formatPhoneNumber(allData[idx]['cl_phone'])}
                    </td>
                    <td class="py-2 border">
                        <span
                            >{moment(allData[idx]["cl_created_at"]).format(
                                "YYYY-MM-DD HH:mm:ss",
                            )}</span
                        >
                    </td>
                    <td class="py-2 border">
                        <!-- {inquiry.cl_name} -->
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</div>
