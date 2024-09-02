<script>
    import { goto } from "$app/navigation";
    import Modal from "$components/Modal.svelte";
    import ModalCustom from "$components/design/ModalCustom.svelte";
    import { page } from "$app/stores";

    let getLocation = "전체";
    let locationModalVisible = false;

    export let data;
    $: data, setData();
    function setData() {
        if (!data.getLocation) {
            getLocation = "전체";
        }
    }
    
    let locationArr = [
        "전체",
        "서울시",
        "경기북부",
        "경기남부",
        "인천광역시",
        "충청도",
        "경상도",
        "전라도",
        "강원도",
    ];

    function changeLocation() {
        console.log(this.value);
        getLocation = this.value;
        goto(`/?location=${getLocation}`, { invalidateAll: true });
        locationModalVisible = false;
    }
</script>

<ModalCustom bind:open={locationModalVisible}>
    <div class="pl-8 font-bold">지역 변경 선택</div>
    <div class="grid grid-cols-3 gap-5 py-3">
        {#each locationArr as location}
            <div class="text-center">
                <button
                    class="border w-2/3 py-2 rounded-full"
                    class:bg-gray-500={location == $page.url.searchParams.get('location')}
                    class:text-white={location == $page.url.searchParams.get('location')}
                    value={location}
                    on:click={changeLocation}
                >
                    {location}
                </button>
            </div>
        {/each}
    </div>
</ModalCustom>

<div
    class="container mx-auto px-1 max-w-[860px] pt-5 flex justify-between items-center"
>
    <div>
        <a href="/">
            <img src="/logo.png" alt="" class="max-w-[120px]" />
        </a>
    </div>
    <div>
        <button
            class="px-3 py-1 text-sm rounded-md bg-blue-500 active:bg-blue-600 text-white"
            on:click={() => {
                locationModalVisible = true;
            }}
        >
            <span class="mr-1">
                <i class="fa fa-compass" aria-hidden="true"></i>
            </span>
            <span>지역 변경</span>
        </button>

        <!-- <span class="mr-1 text-gray-600">
            <i class="fa fa-compass" aria-hidden="true"></i>
            지역 :
        </span>
        <select
            class="p-1.5 border-gray-400 rounded-md text-sm"
            bind:value={getLocation}
            on:change={changeLocation}
        >
            {#each locationArr as location}
                <option value={location}>{location}</option>
            {/each}
        </select> -->
    </div>
</div>

<hr class="my-5" />

<div class=" container mx-auto px-1 max-w-[860px] pretendard relative">
    <slot></slot>
</div>
