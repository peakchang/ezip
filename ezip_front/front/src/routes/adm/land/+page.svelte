<script>
    import axios from "axios";
    import { Checkbox, Toggle } from "flowbite-svelte";
    import { invalidateAll } from "$app/navigation";
    import { back_api } from "$src/lib/const";

    let allData = [];

    let checkedList = [];

    export let data;
    console.log(data);
    $: data, setData();

    function setData() {
        allData = data.land_list;
    }

    async function deleteLand() {
        if (!confirm("삭제한 내용은 복구가 불가합니다. 진행하시겠습니까?")) {
            return;
        }

        let deleteList = checkedList.map((num) => allData[num]["ld_id"]);

        try {
            const res = await axios.post(`${back_api}/admin/delete_land`, {
                delete_list: deleteList,
            });
            if (res.data.status) {
                alert("삭제가 완료 되었습니다.");
                invalidateAll();
            }
        } catch (error) {
            console.error(error.message);
        }
        console.log(deleteList);
    }
</script>

<div class="mb-5">
    <a href="/adm/land/write">
        <button
            class="bg-green-500 active:bg-green-600 px-3 py-1.5 rounded-md text-sm text-white"
        >
            현장 추가
        </button>
    </a>

    <button
        class="bg-red-500 active:bg-red-600 px-3 py-1.5 rounded-md text-sm text-white"
        on:click={deleteLand}
    >
        현장 삭제
    </button>
</div>

<div class="w-full min-w-[600px] overflow-auto">
    <div class="w-full max-w-[1000px]">
        <table class="w-full text-center">
            <tr>
                <th
                    class="border py-2 w-12"
                    on:click={() => {
                        console.log("alsdjflajslidfj");
                    }}
                >
                    <div class="flex justify-center">
                        <Checkbox />
                    </div>
                </th>
                <th class="border py-2">번호</th>
                <th class="border py-2">현장</th>
                <th class="border py-2">버튼</th>
            </tr>

            {#each allData as data, idx}
                <tr>
                    <td class="border py-2 w-12">
                        <div class="flex justify-center">
                            <input
                                type="checkbox"
                                value={idx}
                                bind:group={checkedList}
                            />
                            <!-- <Checkbox value={idx} bind:group={checkedList} /> -->
                        </div>
                    </td>

                    <td class="border py-2 w-20">
                        {allData[idx]["ld_id"]}
                    </td>
                    <td class="border py-2">
                        <a href="/">
                            <span>{allData[idx]["ld_name"]}</span>
                        </a>
                    </td>

                    <td class="border py-2">
                        <a href="/adm/land/write?id={allData[idx]['ld_id']}">
                            <button
                                class="bg-blue-500 active:bg-blue-600 py-1 px-3 rounded-md text-white text-sm"
                            >
                                수정
                            </button>
                        </a>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
    alsdjfilasjdflij
</div>
