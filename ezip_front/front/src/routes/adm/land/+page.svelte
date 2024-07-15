<script>
    import { Checkbox, Toggle } from "flowbite-svelte";

    let allData = [];
    export let data;
    console.log(data);
    $: data, setData();

    function setData() {
        allData = data.land_list;
    }
</script>

<div class="mb-5">
    <a href="/adm/land/write">
        <button class="bg-green-500 px-3 py-1.5 rounded-md text-sm text-white">
            현장 추가
        </button>
    </a>
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
                            <Checkbox />
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
