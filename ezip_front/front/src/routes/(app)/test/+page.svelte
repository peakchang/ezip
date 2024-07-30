<script>
    import QuillEditor from "$components/QuillEditor.svelte";

    let contentArr = [];
    let getEditorContent = "";
    let modifyVal = "";
</script>

<QuillEditor
    on:getEditorContent={getEditorContent}
    {modifyVal}
    bind:contentArr
    height="500px"
/>
