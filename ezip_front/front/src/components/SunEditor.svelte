<script>
    import { onDestroy, onMount } from "svelte";
    import { browser } from "$app/environment";
    import {
        dataURItoBlob,
        extractAndReplaceBase64,
        replaceWithImageLinks,
    } from "$lib/lib";
    import axios from "axios";
    import { back_api } from "$src/lib/const";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let type = "write";
    export let titlePlaceholder = "제목을 입력해주세요";
    let editor;
    export let title = "";
    export let modifyContents = "";

    onMount(() => {
        editor = SUNEDITOR.create("test", {
            // All of the plugins are loaded in the "window.SUNEDITOR" object in dist/suneditor.min.js file
            // Insert options
            // Language global object (default: en)
            lang: SUNEDITOR_LANG["ko"],
            width: "100%",
            minWidth: 400,
            height: "500px",

            buttonList: [
                ["undo", "redo", "font", "fontSize", "formatBlock"],
                ["bold"],
                ["fontColor", "hiliteColor", "textStyle"],
                // "/", // Line break
                ["align", "horizontalRule", "list", "lineHeight"],
                ["table", "link", "image", "video" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                ["fullScreen", "showBlocks", "codeView"],
                /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
            ],
        });

        editor.onImageUploadBefore = function (
            files,
            info,
            core,
            uploadHandler,
        ) {
            try {
                ResizeImage(files, uploadHandler);
            } catch (err) {
                uploadHandler(err.toString());
            }
        };

        // 이미지 업로드 후에 스크롤 맨 아래 / 아래 공간 만들어서 커서 아래쪽으로~
        editor.onImageUpload = function () {
            editor.appendContents("");

            setTimeout(function () {
                const event = new KeyboardEvent("keydown", {
                    key: "ArrowRight",
                    keyCode: 39, // keyCode is deprecated but sometimes still used
                    code: "ArrowRight",
                    which: 39,
                    bubbles: true,
                    cancelable: true,
                });

                // Dispatch the event to the active element
                document.activeElement.dispatchEvent(event);
                const editorArea = document.querySelector(
                    ".sun-editor-editable",
                );
                editorArea.scrollTop = editorArea.scrollHeight;
            }, 100); // 3000 밀리초 = 3초
        };
    });

    onDestroy(() => {
        if (browser) {
            let editorArea = document.querySelector(".sun-editor");
            if (editorArea) {
                editorArea.remove();
            }
        }
    });

    // 글 작성하기
    async function writeContent(e) {
        if (!title || title == "") {
            alert("제목을 입력하세요");
            return;
        }

        if (!editor.getContents() || editor.getContents() == "<p><br></p>") {
            alert("내용을 입력하세요");
            return;
        }

        let getContents = extractAndReplaceBase64(editor.getContents());
        let imgUrlArr = [];
        const uploadImage = async (base64Code) => {
            const imgCon = dataURItoBlob(base64Code);
            let imgForm = new FormData();

            const timestamp = new Date().getTime();
            const fileName = `${timestamp}${Math.random().toString(36).substring(2, 11)}.webp`;
            imgForm.append("editorimg", imgCon, fileName);

            try {
                const getImgUrl = await axios.post(
                    `${back_api}/editor/editor_img_upload`,
                    imgForm,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );
                return getImgUrl.data.baseUrl; // `data.baseUrl`로 변경
            } catch (error) {
                console.error(error.message);
                alert("에러가 발생했습니다. 다시 시도해주세요");
                loading = false;
                throw error; // 에러가 발생하면 바로 중단되도록 예외를 던집니다.
            }
        };

        try {
            // 모든 비동기 작업을 병렬로 실행하고 결과를 imgUrlArr에 저장합니다.
            imgUrlArr = await Promise.all(
                getContents.base64Codes.map((base64Code) =>
                    uploadImage(base64Code),
                ),
            );
            const resultContent = replaceWithImageLinks(
                getContents.updatedHtmlContent,
                imgUrlArr,
            );

            dispatch("writeContent", {
                title: title,
                contents: resultContent,
                writeType: e.target.value,
            });
        } catch (error) {
            // 에러 핸들링
            console.error("전체 작업 중 에러 발생:", error.message);
        }
    }

    // image resize
    function ResizeImage(files, uploadHandler) {
        const maxWidth = 1200;
        const uploadFile = files[0];
        const img = document.createElement("img");
        const canvas = document.createElement("canvas");
        const reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;
            img.onload = function () {
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                let setWidth = 0;
                let setHeight = 0;
                if (img.width >= maxWidth) {
                    var share = img.width / maxWidth;
                    setHeight = Math.floor(img.height / share);
                    setWidth = maxWidth;
                } else {
                    setWidth = img.width;
                    setHeight = img.height;
                }

                canvas.width = setWidth;
                canvas.height = setHeight;

                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, setWidth, setHeight);

                canvas.toBlob(
                    function (blob) {
                        const newFile = new File(
                            [blob],
                            uploadFile.name.replace(/\.[^/.]+$/, ".webp"),
                            {
                                type: "image/webp",
                                lastModified: Date.now(),
                            },
                        );

                        uploadHandler([newFile]);
                    },
                    "image/webp",
                    0.7, // Adjust quality parameter for WebP
                );
            };
        };
        reader.readAsDataURL(uploadFile);
    }
</script>

<div class="mb-3">
    <input
        type="text"
        class="w-full border p-2 focus:outline-none focus:border-blue-400 text-sm"
        placeholder={titlePlaceholder}
        bind:value={title}
    />
</div>

<textarea id="test" placeholder="글을 작성해주세요">
    {modifyContents}
</textarea>

<div class="mt-3 text-center">
    {#if type == "write"}
        <button
            class="bg-blue-500 py-2 px-6 text-white rounded-md"
            value="insert"
            on:click={writeContent}
        >
            작성 완료하기
        </button>
    {:else}
        <button
            class="bg-blue-500 py-2 px-6 text-white rounded-md"
            value="update"
            on:click={writeContent}
        >
            수정 완료하기
        </button>
    {/if}
    <!-- 
    <button
        on:click={() => {
            console.log(editor);
        }}
    >
        촤촤
    </button> -->
</div>

<style>
</style>
