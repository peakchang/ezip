<script>
    import "../app.css";
</script>

<svelte:head>
    <!-- SUIT 폰트 CSS -->
    <link
        href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
        rel="stylesheet"
    />

    <link
        rel="stylesheet"
        as="style"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css"
    />

    <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <!-- Include stylesheet -->
    <link
        href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css"
        rel="stylesheet"
    />
    <!-- <link href="https://cdn.jsdelivr.net/npm/suneditor@latest/assets/css/suneditor.css" rel="stylesheet"> -->
    <!-- <link href="https://cdn.jsdelivr.net/npm/suneditor@latest/assets/css/suneditor-contents.css" rel="stylesheet"> -->
    <script
        src="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js"
    ></script>
    <!-- languages (Basic Language: English/en) -->
    <script
        src="https://cdn.jsdelivr.net/npm/suneditor@latest/src/lang/ko.js"
    ></script>
</svelte:head>
<slot />

<style>
    :global(.max_screen) {
        max-width: 800px;
        padding: 0 10px;
    }

    :global(.pretendard) {
        font-family: "Pretendard";
    }
</style>
