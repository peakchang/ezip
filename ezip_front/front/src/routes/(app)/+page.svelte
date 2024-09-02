<script>
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    export let data;
    let landList = [];
    let addStatus = true;
    $: data, setData();
    $: landList, setupObserver();
    let addLandNum = 12;

    onMount(() => {
        setupObserver();
    });

    function setupObserver() {
        if (browser) {
            try {
                const io = new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                observer.unobserve(entry.target);
                                loadMoreData();
                            }
                        });
                    },
                    {
                        rootMargin: "100px", // 더 큰 값으로 설정하여 호출 빈도를 줄입니다.
                    },
                );
                if (addStatus) {
                    const landListElement =
                        document.querySelectorAll(".land_element");
                    io.observe(landListElement[landListElement.length - 1]);
                }
            } catch (error) {
                // console.error(error.message);
            }
        }
    }

    async function loadMoreData() {
        try {
            const res = await axios.post(`${back_api}/update_land_list`, {
                add_land_num: addLandNum,
            });
            if (res.data.status) {
                const addLandList = res.data.add_land_list;

                // 기존 landList 배열에 추가된 addLandList[0] 의 ld_id 값이 중복이 있는지 판단 (없어야 추가)
                if (
                    !landList.some(
                        (element) => element.ld_id === addLandList[0].ld_id,
                    )
                ) {
                    if (addLandList && addLandList.length > 0) {
                        landList = [...landList, ...addLandList];
                        addLandNum = addLandNum + 12;
                    }
                }
            } else {
                addStatus = false;
            }
        } catch (error) {
            // console.error(error.message);
        }
    }

    function setData() {
        landList = data.land_list;
        console.log(landList);
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
    {#each landList as land, idx}
        <a href="/view/{land.ld_id}" class="land_element">
            <div class="border rounded-md overflow-hidden">
                <div class="flex justify-center items-center square-container">
                    <div
                        class="square-content bg-cover"
                        style="background-image: url('{extractFirstImageSrc(
                            land.ld_content,
                        )}')"
                    ></div>
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
