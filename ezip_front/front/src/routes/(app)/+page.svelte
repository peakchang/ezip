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
            <div class="border rounded-md overflow-hidden ">
                <div class="flex justify-center items-center square-container ">
                    <div class="square-content bg-cover" style="background-image: url('{extractFirstImageSrc(land.ld_content)}')">

                    </div>
                    <!-- <img
                        src={extractFirstImageSrc(land.ld_content)}
                        alt=""
                        class="w-full h-full"
                    /> -->
                </div>
                <div class="py-2 text-center">
                    {land.ld_name}
                </div>
            </div>
        </a>
    {/each}
</div>
<style>
    .square-container {
        position: relative;
        width: 100%; /* 또는 원하는 너비를 설정 */
    }
    .square-container::before {
        content: "";
        display: block;
        padding-top: 100%; /* 1:1 비율을 유지하기 위해 100% 사용 */
    }
    .square-content {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>