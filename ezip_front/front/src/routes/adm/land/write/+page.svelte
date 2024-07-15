<script>
    import SunEditor from "$components/SunEditor.svelte";
    import { back_api, locationArr } from "$src/lib/const";
    import { goto } from "$app/navigation";

    import axios from "axios";

    export let data;
    let title = "";
    let modifyContents = "";
    let getId = "";
    let writeType = "write";
    let getLocation = "default";

    $: data, setData();

    function setData() {
        title = data.modify_title;
        modifyContents = data.modify_content;
        if (data.modify_location) {
            getLocation = data.modify_location;
        }

        getId = data.get_id;
        if (getId) {
            writeType = "modify";
        }
    }

    async function writeContent(e) {
        if (!getLocation || getLocation == "default") {
            alert("위치를 선택하세요.");
            return;
        }

        const detail = e.detail;
        if (detail.writeType == "insert") {
            try {
                const res = await axios.post(
                    `${back_api}/admin/upload_content`,
                    {
                        title: detail.title,
                        contents: detail.contents,
                        location: getLocation,
                    },
                );

                if (res.status) {
                    alert("업로드가 완료 되었습니다.");
                    goto("/adm/land", { replaceState: true });
                    console.log(res.data);
                }
            } catch (error) {
                alert("에러가 발생 했습니다.");
            }
        } else {
            try {
                const res = await axios.post(
                    `${back_api}/admin/update_content`,
                    {
                        title: detail.title,
                        contents: detail.contents,
                        location: getLocation,
                        getId,
                    },
                );

                if (res.status) {
                    alert("업데이트가 완료 되었습니다.");
                    goto("/adm/land", { replaceState: true });
                    console.log(res.data);
                }
            } catch (error) {
                alert("에러가 발생 했습니다.");
            }
        }
    }
</script>

<div class="mb-3">
    <select class="py-1 px-5 text-sm" bind:value={getLocation}>
        <option value="default">항목을 선택하세요</option>
        {#each locationArr as location}
            <option value={location}>{location}</option>
        {/each}
    </select>
</div>
<SunEditor
    titlePlaceholder="현장명을 입력해주세요"
    {title}
    {modifyContents}
    type={writeType}
    on:writeContent={writeContent}
/>
