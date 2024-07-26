<script>
    import { back_api } from "$src/lib/const";
    import axios from "axios";
    import { invalidateAll } from "$app/navigation";

    export let data;
    let statusList = "";
    let colorList = "";
    $: data, setData();

    function setData() {
        statusList = data.get_base.status_list;
        colorList = data.get_base.color_list;
    }

    async function updateBaseFunc() {
        if (!statusList) {
            alert("상태값은 하나 이상 들어가야 합니다.");
            return;
        }
        if (!colorList) {
            alert("색상값은 하나 이상 들어가야 합니다.");
            return;
        }
        const statusListArr = statusList.split(",");
        const colorListArr = colorList.split(",");
        if (statusListArr.length != colorListArr.length) {
            alert("상태값과 색상값의 갯수가 같아야 합니다.");
            return;
        }

        try {
            const res = axios.post(`${back_api}/admin/update_base`, {
                status_list: statusList,
                color_list: colorList,
            });
            if (res.data.status) {
                alert("업데이트가 완료 되었습니다.");
                invalidateAll();
            }
        } catch (error) {}
    }
</script>

<div class="mb-5 text-right pr-10">
    <button
        class="bg-green-500 px-3 py-1 rounded-md text-white"
        on:click={updateBaseFunc}
    >
        업데이트
    </button>
</div>

<div class="w-full min-w-[600px] overflow-auto">
    <div class="w-full max-w-[1200px]">
        <table class="w-full text-center">
            <tr>
                <th class="border py-2 w-1/4">
                    <p>상태값 리스트</p>
                    <p class="text-xs font-light">
                        상태값은 콤마로 구분합니다.
                    </p>
                </th>
                <td class="border py-2 px-2">
                    <input
                        type="text"
                        class="p-2 w-full border-gray-400 rounded-md text-sm border"
                        bind:value={statusList}
                    />
                </td>
            </tr>

            <tr>
                <th class="border py-2 w-1/4">
                    <p>색상값 리스트</p>
                    <p class="text-xs font-light">
                        색상값은 콤마로 구분합니다.
                    </p>
                </th>
                <td class="border py-2 px-2">
                    <input
                        type="text"
                        class="p-1.5 w-full border-gray-400 rounded-md text-sm border focus:outline-none focus:border-blue-500"
                        bind:value={colorList}
                    />
                </td>
            </tr>
        </table>
        <div class="mt-1 text-xs ml-2">
            색상값은 네이버에서 "색상표" 를 검색해서 #000000 이딴거 입력하면 됨~
        </div>
    </div>
</div>
