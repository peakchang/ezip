<script>
    export let data;
    let landList = [];
    $: data, setData();
    function setData() {
        landList = data.land_list;
    }

    function extractFirstImageSrc(htmlContent) {
        // 첫 번째 img 태그를 찾는 정규식
        var pattern = /<img\s+[^>]*src="([^"]*)"[^>]*>/i;

        // 정규식을 사용하여 첫 번째 img 태그를 찾음
        var match = pattern.exec(htmlContent);

        // 매치가 있으면 src 값을 반환, 그렇지 않으면 null 반환
        if (match && match[1]) {
            return match[1];
        } else {
            return null;
        }
    }
</script>

<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    {#each landList as land}
        <a href="/view/{land.ld_id}">
            <div class="border rounded-md overflow-hidden">
                <div class="h-40 flex justify-center items-center">
                    <img src="{extractFirstImageSrc(land.ld_content)}" alt="" class="w-full h-full" />
                </div>
                <div class="py-2 text-center">
                    {land.ld_name}
                </div>
            </div>
        </a>
    {/each}
</div>
