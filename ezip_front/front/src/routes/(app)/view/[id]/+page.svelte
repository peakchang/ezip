<script>
    export let data;
    let viewData = {};
    $: data, setData();

    function setData() {
        viewData = data.view_data;
        console.log(viewData);
    }
</script>

<div class="text-center relative">
    <span class="text-lg font-semibold">
        {viewData.ld_name}
    </span>

    <div class="absolute top-[-10px] right-4 text-xs md:text-sm">
        <button
            class=" bg-yellow-600 active:bg-yellow-700 text-white py-1 px-3 rounded-full mr-1"
        >
            광고문의
        </button>
        <button
            class=" bg-yellow-300 active:bg-yellow-400 py-1 px-3 rounded-full"
        >
            카톡공유
        </button>
    </div>
</div>

<hr class="my-5" />

<div>
    {@html viewData.ld_content}
</div>

<div class="fixed left-0 bottom-0 w-full z-50 bg-white">
    <div class="container mx-auto px-1 max-w-[860px] border rounded-t-lg">
        <div class="p-5">alsdifjalisjfliajsdlifjalisdjfliajsdlifj</div>
    </div>
</div>
