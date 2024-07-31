<script>
    import QuillEditor from "$components/QuillEditor.svelte";
    import { back_api, locationArr } from "$src/lib/const";
    import { page } from "$app/stores";
    import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
    import Cookies from "js-cookie";
    import axios from "axios";

    export let data;

    let workStatus = false; // 값이 true 면 새로고침시 체크
    let contentArr;
    let allData = {};

    $: data, setData();

    function setData() {
        if (data.all_data) {
            allData = data.all_data;
        }

        console.log(allData);
    }

    const uploadContent = async (e) => {
        const type = e.target.value;
        console.log(type);
        if (!allData["ld_name"] || !allData["ld_location"]) {
            alert("제목 or 지역항목 미선택! 선택해주세여");
            return false;
        }

        // 지울 목록 찾기 (에디터에 없는 항목만 배열로 남겨놓기)
        for (let i = 0; i < contentArr.length; i++) {
            const element = contentArr[i];
            if (element.includes("/")) {
                var ttt = element.split("/");
            } else {
                var ttt = element.split("\\");
            }

            var kkk = ttt[ttt.length - 1];
            if (allData["ld_content"].includes(kkk)) {
                contentArr[i] = "";
            }
        }

        const res = await axios.post(`${back_api}/admin_land/upload_land`, {
            type,
            allData,
            contentArr,
        });

        console.log(res);

        if (res.data.status) {
            workStatus = false;
            alert("글 작성이 완료 되었습니다.");
            goto("/adm/land");
        }
    };

    //
    const getEditorContent = (e) => {
        allData["ld_content"] = e.detail.editorContent;

        if (
            !allData["ld_content"] ||
            allData["ld_content"] == "<p><br></p>" ||
            allData["ld_content"] == '<p class="ql-align-center"><br></p>'
        ) {
            workStatus = false;
        } else {
            workStatus = true;
        }
    };

    beforeNavigate(async ({ from, to, cancel }) => {
        if (workStatus) {
            if (
                confirm(
                    "페이지에서 나가시겠습니까? 작성중인 문서는 삭제됩니다.",
                )
            ) {
                const deleteArr = contentArr;
                const del_libo_cookie = deleteArr.join(",");
                Cookies.set("del_libo_cookie", del_libo_cookie); // 혹시 모르니까 쿠키에 저장
                await axios
                    .post(`${back_api}/quill_editor/nosave_del`, { deleteArr })
                    .then(() => {
                        Cookies.remove("del_libo_cookie");
                    });
            } else {
                cancel();
            }
        }
    });

    // F5키를 누르는 경우 삭제할 이미지 리스트 쿠키 바로 저장
    function onKeyDown(e) {
        if (e.keyCode == 116) {
            Cookies.set("del_libo_cookie", contentArr);
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="mb-3">
    <select
        class="py-1 px-5 text-sm border border-gray-300 focus:outline-none focus:border-blue-500"
        bind:value={allData["ld_location"]}
    >
        <option value="default">항목을 선택하세요</option>
        {#each locationArr as location}
            <option value={location}>{location}</option>
        {/each}
    </select>
</div>

<div class="mb-3">
    <input
        type="text"
        class="w-full border p-3 focus:outline-none focus:border-blue-500"
        bind:value={allData["ld_name"]}
    />
</div>

<QuillEditor
    on:getEditorContent={getEditorContent}
    modifyVal={allData["ld_content"] ? allData["ld_content"] : ""}
    bind:contentArr
    height="500px"
/>

<div class="mt-3 text-center">
    {#if $page.url.searchParams.get("id")}
        <button
            class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
            value="update"
            on:click={uploadContent}
        >
            수정하기
        </button>
    {:else}
        <button
            class="bg-sky-700 py-2 px-10 rounded-lg text-white suit-font"
            value="upload"
            on:click={uploadContent}
        >
            등록하기
        </button>
    {/if}
</div>
