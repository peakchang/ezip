<script>
    export let data;
    let landList = [];
    $: data, setData();
    function setData() {
        landList = data.land_list;
    }

    
</script>

<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    {#each landList as land}
        <a href="/view/{land.ld_id}">
            <div class="border rounded-md overflow-hidden">
                <div class="h-40 flex justify-center items-center">
                    <img
                        alt=""
                        class="w-full h-full"
                    />
                </div>
                <div class="py-2 text-center">
                    {land.ld_name}
                </div>
            </div>
        </a>
    {/each}
</div>
