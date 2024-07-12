<script>
    import SunEditor from "$components/SunEditor.svelte";
    import { back_api } from "$src/lib/const";
    import { goto } from "$app/navigation";

    import axios from "axios";

    async function writeContent(e) {
        console.log(";asljdflaisjdfliasjfd");
        const detail = e.detail;
        console.log(detail);

        try {
            const res = await axios.post(`${back_api}/upload_content`, {
                title: detail.title,
                contents: detail.contents,
            });

            if (res.status) {
                alert("업로드가 완료 되었습니다.");
                goto("/adm", { replaceState: true });
                console.log(res.data);
            }
        } catch (error) {}
    }
</script>

<SunEditor
    titlePlaceholder="현장명을 입력해주세요"
    on:writeContent={writeContent}
/>
