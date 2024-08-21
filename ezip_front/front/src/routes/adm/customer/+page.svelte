<script>
    import axios from "axios";
    import moment from "moment-timezone";
    import { invalidateAll } from "$app/navigation";
    import { back_api } from "$src/lib/const";
    import { formatPhoneNumber } from "$lib/lib";

    export let data;
    let allData = [];
    let statusList = [];
    let checkedList = [];
    console.log(data);
    $: data, setData();

    function setData() {
        allData = data.cu_data;
        statusList = [];
        const statusStr = data.base_data.status_list;
        const colorStr = data.base_data.color_list;
        if (statusStr && colorStr) {
            const statusArr = statusStr.split(",");
            const colorArr = colorStr.split(",");
            for (let i = 0; i < statusArr.length; i++) {
                statusList.push({ status: statusArr[i], color: colorArr[i] });
            }
        }

        console.log(statusList);
        const str = JSON.stringify(statusList);
        console.log(str);
    }

    async function cuUpdateFunc() {
        let update_data = checkedList.map((num) => allData[num]);
        try {
            const res = await axios.post(`${back_api}/admin/customer_update`, {
                update_data,
            });
            if (res.data.status) {
                alert("업데이트가 완료 되었습니다.");
                invalidateAll();
                checkedList = [];
            }
        } catch (error) {
            console.error(error.message);
        }
    }
</script>

<div class="mb-5">
    <button
        class="py-1 px-3 bg-blue-500 active:bg-blue-600 text-white rounded-md"
        on:click={cuUpdateFunc}
    >
        업데이트
    </button>

    <!-- 토글 디자인 예시 -->
    <!-- <label class="toggle-switch">
        <input type="checkbox" />
        <span class="slider"></span>
    </label> -->
</div>

<div class="w-full min-w-[600px] overflow-auto">
    <div class="w-full max-w-[1200px]">
        <table class="w-full text-center">
            <tr>
                <th
                    class="border py-2 w-12"
                    on:click={() => {
                        console.log("alsdjflajslidfj");
                    }}
                >
                    <div class="flex justify-center">
                        <input type="checkbox" name="" id="" />
                    </div>
                </th>
                <th class="border py-2">고객명</th>
                <th class="border py-2">전화번호</th>
                <th class="border py-2">접수일자</th>
                <th class="border py-2">현장</th>
                <th class="border py-2">상태</th>
            </tr>

            {#each allData as data, idx}
                <tr
                    style="background-color: {(
                        statusList.find(
                            (obj) => obj.status === allData[idx]['cu_status'],
                        ) || {}
                    ).color || ''};"
                >
                    <td class="border py-2 w-12">
                        <div class="flex justify-center">
                            <label>
                                <input
                                    type="checkbox"
                                    value={idx}
                                    bind:group={checkedList}
                                />
                                <span class="custom-checkbox"></span>
                            </label>
                        </div>
                    </td>
                    <td class="border py-2">
                        <span>{allData[idx]["cu_name"]}</span>
                    </td>
                    <td class="border py-2">
                        <span
                            >{formatPhoneNumber(allData[idx]["cu_phone"])}</span
                        >
                    </td>

                    <td class="border py-2">
                        <span
                            >{moment(allData[idx]["cu_created_at"]).format(
                                "YYYY-MM-DD HH:mm:ss",
                            )}</span
                        >
                    </td>

                    <td class="border py-2">
                        <span>{allData[idx]["ld_name"]}</span>
                    </td>

                    <td class="border py-2">
                        <select
                            class="text-xs py-1 px-2 border border-gray-400 rounded-md"
                            bind:value={allData[idx]["cu_status"]}
                        >
                            {#each statusList as status}
                                <option
                                    value={status.status}
                                    selected={status.status ===
                                        allData[idx]["cu_status"]}
                                    >{status.status}</option
                                >
                            {/each}
                        </select>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</div>
