<script>
    import DrawerCustom from "$components/design/DrawerCustom.svelte";
    import { sineIn } from "svelte/easing";

    import { admin_sidebar, admin_sidebar_width } from "$src/lib/store";
    import { afterNavigate } from "$app/navigation";

    let innerWidth;
    let smallSidebar;

    let backdrop = true;
    const width = 208;

    $: {
        if (innerWidth < 1200) {
            $admin_sidebar = false;
            $admin_sidebar_width = false;
        } else {
            $admin_sidebar = true;
            $admin_sidebar_width = true;
        }
    }

    function changeDrawerOpt(bool) {}

    // 바탕을 클릭하면 액션을 줄지 말지
    let activateClickOutside = false;

    // 바탕을 클릭하면 drawer을 닫을지 말지
</script>

<svelte:window bind:innerWidth />

<div
    class="fixed top-0 left-0 w-full bg-stone-300 py-2 px-6 suit-font z-30 flex items-center pretendard"
    class:ml-52={$admin_sidebar && $admin_sidebar_width}
>
    <button on:click={() => ($admin_sidebar = !$admin_sidebar)}>
        <i class="fa fa-bars" aria-hidden="true"></i>
    </button>

    <a href="/" class="ml-10">
        <i class="fa fa-home text-xl" aria-hidden="true"></i>
    </a>

    <a href="/" class="ml-2"> 로그아웃 </a>
</div>

<DrawerCustom drawerOpen={$admin_sidebar} bgGray={false} {width}>
    <div class="flex justify-between mb-5">
        <div>Admin</div>
        <div>
            <button
                on:click={() => {
                    $admin_sidebar = false;
                }}
            >
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>
        </div>
    </div>

    <a href="/adm">
        <div class="p-2 text-base cursor-pointer mb-1.5">
            <span class="mr-2">
                <i class="fa fa-cog" aria-hidden="true"></i>
            </span>
            <span>기본설정</span>
        </div>
    </a>

    <a href="/adm/land">
        <div class="p-2 text-base cursor-pointer mb-1.5">
            <span class="mr-2">
                <i class="fa fa-building" aria-hidden="true"></i>
            </span>
            <span>현장관리</span>
        </div>
    </a>

    <a href="/adm/customer">
        <div class="p-2 text-base cursor-pointer mb-1.5">
            <span class="mr-2">
                <i class="fa fa-users" aria-hidden="true"></i>
            </span>
            <span class="text-sm">현장문의관리</span>
        </div>
    </a>

    <a href="/adm/inquiry">
        <div class="p-2 text-base cursor-pointer mb-1.5">
            <span class="mr-2">
                <i class="fa fa-folder-open-o" aria-hidden="true"></i>
            </span>
            <span class="text-sm">광고문의관리</span>
        </div>
    </a>


    
</DrawerCustom>

<div
    class="mt-14 px-2 text-sm suit-font"
    class:ml-52={$admin_sidebar && $admin_sidebar_width}
>
    <slot />
</div>

<style>
    :global(.suit-font) {
        font-family: "SUIT";
    }

    /* 숨겨진 기본 체크박스 */

    :global(input[type="checkbox"]) {
        display: none;
    }

    /* 사용자 정의 체크박스 컨테이너 */
    :global(.custom-checkbox) {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-color: #f0f0f0;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease;
    }

    /* 체크 표시 */
    :global(.custom-checkbox::after) {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20.285,5.285l-11,11c-0.195,0.195-0.451,0.293-0.707,0.293s-0.512-0.098-0.707-0.293l-5-5c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0L8.5,13.086l10.586-10.586c0.391-0.391,1.023-0.391,1.414,0S20.676,4.894,20.285,5.285z"/></svg>');
        background-size: 70%;
        background-position: center;
        background-repeat: no-repeat;
        transform: translate(-50%, -45%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    /* 체크박스가 체크된 경우 스타일 */
    :global(input[type="checkbox"]:checked + .custom-checkbox) {
        background-color: #ff6c6c;
    }

    :global(input[type="checkbox"]:checked + .custom-checkbox::after) {
        opacity: 1;
    }

    /* 토글 CSS */
    /* 숨겨진 기본 체크박스 */
    :global(.toggle-switch) {
        position: relative;
        display: inline-block;
        width: 47px;
        height: 24px;
    }

    :global(.toggle-switch input) {
        display: none;
    }

    /* 슬라이더 */
    :global(.slider) {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 34px;
    }

    :global(.slider:before) {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    :global(input:checked + .slider) {
        background-color: #ff6c6c;
    }

    :global(input:checked + .slider:before) {
        transform: translateX(23px);
    }
</style>
