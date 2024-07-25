<script>
    import { Checkbox, Toggle } from "flowbite-svelte";
    import moment from "moment-timezone";

    export let data;
    let allData = [];
    let statusList = [];
    let checkedList = [];
    console.log(data);
    $: data, setData();

    function setData() {
        allData = data.cu_data;
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
    }

    function formatPhoneNumber(phoneNumbers) {
        // 전화번호를 '/'로 분할
        var numbers = phoneNumbers.split(" / ");

        // 각 전화번호를 포맷팅
        var formattedNumbers = numbers.map(function (number) {
            return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        });

        // 포맷팅된 전화번호를 '/'로 결합
        return formattedNumbers.join(" / ");
    }

    async function cuUpdateFunc(){
        console.log(checkedList);
    }


    
</script>

<div class="mb-5">
    <button on:click={cuUpdateFunc}>업데이트</button>
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
                        <input type="checkbox" name="" id="">
                    </div>
                </th>
                <th class="border py-2">고객명</th>
                <th class="border py-2">전화번호</th>
                <th class="border py-2">접수일자</th>
                <th class="border py-2">현장</th>
                <th class="border py-2">상태</th>
            </tr>

            {#each allData as data, idx}
                <tr>
                    <td class="border py-2 w-12">
                        <div class="flex justify-center">

                            <label>
                                <input type="checkbox" value={idx} bind:group={checkedList}>
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
                        <span>{allData[idx]["ld_location"]}</span>
                    </td>

                    <td class="border py-2">
                        <select class="text-xs py-1 px-2">
                            <option value="">-- 선택 --</option>
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


<style>
    /* 숨겨진 기본 체크박스 */
    input[type="checkbox"] {
        display: none;
    }

    /* 사용자 정의 체크박스 컨테이너 */
    .custom-checkbox {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-color: #f0f0f0;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;
    }

    /* 체크 표시 */
    .custom-checkbox::after {
        content: '';
        position: absolute;
        top: 40%;
        left: 50%;
        width: 12px;
        height: 12px;
        border: solid white;
        border-width: 0 3px 3px 0;
        /* transform: translate(-50%, -50%) rotate(40deg); */
        transform: translate(-50%, -60%) rotate(45deg);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    /* 체크박스가 체크된 경우 스타일 */
    input[type="checkbox"]:checked + .custom-checkbox {
        background-color: red;
    }

    input[type="checkbox"]:checked + .custom-checkbox::after {
        opacity: 1;
    }
</style>