<script>
    // npm i ckeditor5-svelte

    // npm i @ckeditor/ckeditor5-build-decoupled-document/build/ckeditor

    // /node_modules\ckeditor5-svelte\src\Ckeditor.svelte 를 열어서

    // 42 라인 쯤의 //editor.isReadOnly = disabled; 를 주석처리(안하면 변경내용 binding 이 안됨)

    import { onMount } from "svelte";
    let CKEditor;
    let Font;
    let SimpleUploadAdapter;
    onMount(async () => {
        if (typeof window !== "undefined") {
            CKEditor = (await import("ckeditor5-svelte")).default;
            editor = (
                await import(
                    "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor"
                )
            ).default;
        }
    });

    // Setting up editor prop to be sent to wrapper component

    let editor;

    // Reference to initialised editor instance

    let editorInstance = null;

    // Setting up any initial data for the editor

    export let editorData = "";

    //아래 설정 지우시면 let editorConfig: any = {} 모든 에디터 기능 다 나옵니다.

    //버튼에 마우스오버하면 설정이름 나오는데, 눈찌껏 대문자 넣어서 네이밍 옵션에 넣으면 사굥가능합니다.

    let editorConfig = {

        toolbar: {
            items: [
                "undo",
                "redo",
                "|",
                "heading",
                "|",
                "fontFamily",
                "fontSize",
                "bold",
                // "italic",
                "underline",
                "fontColor",
                "fontBackgroundColor",
                "|",
                "link",
                "uploadImage",
                "|",
                "alignment",
            ],
        },
    };

    function onReady({ detail: editor }) {
        // Insert the toolbar before the editable area.
        editorInstance = editor;
        editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement(),
            );
    }
</script>

<main>
    <div class="backboard">
        {#if CKEditor && editor}
            <CKEditor
                bind:editor
                on:ready={onReady}
                bind:config={editorConfig}
                bind:value={editorData}
            />
        {/if}
    </div>
</main>

<style>
    .backboard {
        width: 100%;

        /* border: 1px solid #ccc; */

        background-color: #fff;

        border-radius: 5px;

        box-sizing: border-box;
    }
</style>
