<script>
    import { Checkbox, Toggle } from "flowbite-svelte";
    import moment from "moment-timezone";

    let allData = [];
    export let data;
    console.log(data);
    $: data, setData();

    function setData() {
        allData = data.cu_data;
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
</script>

<div class="mb-5">alsdjflaijsdfliajsdf</div>

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
                        <Checkbox />
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
                            <Checkbox />
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

                    <td class="border py-2"> ???? </td>
                </tr>
            {/each}
        </table>
    </div>
</div>
