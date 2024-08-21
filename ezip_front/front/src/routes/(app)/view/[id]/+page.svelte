<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    import { page } from "$app/stores";

    // import { Modal, Button } from "flowbite-svelte";

    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import {
        isValidPhoneNumber,
        cleanPhoneNumber,
        extractFirstImageLink,
    } from "$lib/lib";

    import Modal from "$src/components/Modal.svelte";

    export let data;
    let viewData = {};
    $: data, setData();

    let cu_name = "";
    let phNum1 = "010";
    let phNum2 = "";
    let phNum3 = "";

    let modalBool = false;
    let inqueryModalBool = false;

    let client_name = "";
    let client_phone = "";

    let persnalBool = false;

    function setData() {
        viewData = data.view_data;
        console.log(viewData);
        const getFirstImg = extractFirstImageLink(viewData.ld_content);
        console.log(getFirstImg);
        console.log($page);
        console.log($page.url.href);
    }

    onMount(() => {
        try {
            Kakao.init(import.meta.env.VITE_KAKAO_JSKEY);
            console.log(Kakao);
        } catch (error) {
            console.error(error.message);
        }
    });

    function kakaoShareLink() {
        Kakao.Link.sendDefault({
            objectType: "feed",
            content: {
                title: viewData.ld_name,
                // description: viewData.ld_name,
                imageUrl: extractFirstImageLink(viewData.ld_content), // 공유할 이미지 URL을 입력하세요.
                link: {
                    mobileWebUrl: $page.url.href,
                    webUrl: $page.url.href,
                },
            },
            buttons: [
                {
                    title: "사이트 바로가기",
                    link: {
                        mobileWebUrl: $page.url.href,
                        webUrl: $page.url.href,
                    },
                },
                // {
                //     title: "앱으로 보기",
                //     link: {
                //         mobileWebUrl: "https://your_website.com",
                //         webUrl: "https://your_website.com",
                //     },
                // },
            ],
        });
    }

    async function submitPersnalInfo() {
        if (!cu_name) {
            alert("이름을 입력하세요.");
            return false;
        }

        if (!phNum1 || !phNum2 || !phNum3) {
            alert("전화번호를 입력하세요.");
            return false;
        }

        if (!persnalBool) {
            const goPersnamBool = confirm(
                "개인정보 수집 및 이용 동의에 동의하셔야 합니다. 동의 하고 진행하시겠습니까?",
            );
            if (goPersnamBool) {
                persnalBool = true;
            } else {
                return false;
            }
        }

        const cu_phone = phNum1 + phNum2 + phNum3;

        if (!isValidPhoneNumber(cu_phone)) {
            alert("올바른 전화번호가 아닙니다. 확인 해주세요");
            return false;
        }

        const cu_land = viewData.ld_id;

        console.log(cu_land);
        

        // try {
        //     const res = await axios.post(`${back_api}/upload_customer_info`, {
        //         cu_name,
        //         cu_phone,
        //         cu_land,
        //     });
        //     if (res.data.status) {
        //         alert(
        //             "접수가 완료 되었습니다. 전문 상담사가 곧 전화 빠른 시간 내 전화드릴 예정입니다.",
        //         );
        //         cu_name = "";
        //         phNum1 = "010";
        //         phNum2 = "";
        //         phNum3 = "";
        //         modalBool = false;
        //     }
        // } catch (error) {
        //     console.error(error.message);
        // }
    }

    async function uploadClient() {
        if (!client_name) {
            alert("이름을 입력하세요.");
            return false;
        }

        if (!client_phone) {
            alert("전화번호를 입력하세요.");
            return false;
        }

        if (!isValidPhoneNumber(client_phone)) {
            alert("올바른 전화번호가 아닙니다. 확인 해주세요");
            return false;
        }

        try {
            const res = await axios.post(`${back_api}/upload_client`, {
                client_name,
                client_phone: cleanPhoneNumber(client_phone),
            });

            if (res.data.status) {
                alert(
                    "접수가 완료 되었습니다. 빠른 시일 내 연락 드리겠습니다.",
                );
                client_name = "";
                client_phone = "";
                inqueryModalBool = false;
            }
        } catch (error) {}
    }
</script>

<!-- <svelte:head>
    <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
</svelte:head> -->

<Modal bind:modalShowBoolean={inqueryModalBool}>
    <div class="w-full md:w-3/4 mx-auto">
        <table class="w-full mt-3">
            <tr>
                <th class="w-1/4 text-sm pb-5">담당자 성함</th>
                <td class="pb-5">
                    <input
                        type="text"
                        class="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
                        bind:value={client_name}
                    />
                </td>
            </tr>

            <tr>
                <th class="w-1/4 text-sm">전화번호</th>
                <td>
                    <input
                        type="text"
                        class="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
                        bind:value={client_phone}
                    />
                </td>
            </tr>
        </table>

        <div class="text-center pl-10 mt-4">
            <button
                class="w-1/4 border border-blue-500 bg-blue-500 active:bg-blue-600 py-1 rounded-md text-white text-sm"
                on:click={uploadClient}
            >
                제출
            </button>
            <button
                class="w-1/4 border border-blue-500 active:bg-blue-500 active:text-white py-1 px-3 rounded-md text-sm"
                on:click={() => {
                    inqueryModalBool = false;
                }}
            >
                닫기
            </button>
        </div>
    </div>
</Modal>

<Modal
    title="개인정보 수집 및 이용에 대한 안내"
    bind:modalShowBoolean={modalBool}
    autoclose
>
    <div class="mt-5">
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            '(주)애드피크' / '이집어때' 는 고객님의 개인정보를 중요시하며,
            "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
            회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가
            어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한
            조치가 취해지고 있는지 알려드립니다.
        </p>
        <p><br /></p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            고객님은 개인정보 수집 및 이용 동의에 거부하실 수 있습니다. 다만,
            필수항목 동의를 거부하실 경우 {viewData.ld_name} 상담 및 모델하우스 방문예약
            등이 제한됩니다.
        </p>

        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            1. 수집/이용 목적 : {viewData.ld_name} 상담 및 모델하우스 방문예약
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            2. 수집하는 항목 : 성명, 연락처 등
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            3. 보유 / 이용 기간 : 이용목적 달성 혹은 폐기 요청시
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            4. 동의를 거부할 수 있으며, 거부시 이용이 제한될 수 있습니다.
        </p>
        <p><br /></p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            *개인정보 수집 및 이용 동의서*
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {viewData.ld_name} 상담 및 모델하우스 방문예약 등을 위해 아래와 같이
            개인정보를 수집,이용합니다.
        </p>
        <p><br /></p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            1. 개인정보의 수집/이용목적
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            ● 수집한 개인정보는 본인확인 및 {viewData.ld_name} 상담 및 모델하우스
            방문예약 등의 요청사항 처리를 위해 활용합니다.
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            2. 수집하려는 개인정보의 항목
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            ● 수집하는 개인정보의 항목: 성명, 연락처 등
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            3. 개인정보의 보유 및 이용기간
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            ● 이용목적 달성 혹은 폐기 요청시
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            4. 개인정보 제공 및 공유
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            ● 신청자가 제공한 모든 정보는 상기 목적에 필요한 용도 이외로는
            사용되지 않으며 이용목적이 변경될 시에는 사전 동의를 구할 것입니다.
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            5. 개인정보의 수집,이용에 관한 동의 거부
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            ● 개인정보 수집,이용 동의를 거부할 수 있으나, 동의하지 않을 경우에는 {viewData.ld_name}
            상담 및 모델하우스 방문예약 등이 제한 될 수 있습니다.
        </p>
        <p><br /></p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            * 개인정보 제 3자 제공 동의 *
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            다음과 같이 개인정보를 제3자에게 제공하고 있습니다.
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            1. 개인정보를 제공받는 자 : 한가인, 심재용
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            2. 제공받는 자의 개인정보 이용목적 : {viewData.ld_name} 상담 및 모델하우스
            방문예약
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            3. 제공하는 개인정보 항목 : 성명, 연락처 등
        </p>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            4. 제공받는 자의 보유 및 이용기간 : 이용목적 달성 혹은 개인정보
            제3자 제공 철회 시까지
        </p>
    </div>

    <svelte:fragment slot="footer">
        <!-- <Button
            color="blue"
            on:click={() => {
                persnalBool = true;
                console.log("aslidfjalisjdf");
            }}
        >
            동의함
        </Button>
        <Button color="alternative">닫기</Button> -->
    </svelte:fragment>
</Modal>

<div class="text-center relative">
    <span class="text-lg font-semibold">
        {viewData.ld_name}
    </span>

    <div class="absolute top-[-10px] right-4 text-xs md:text-sm">
        <button
            class=" bg-yellow-600 active:bg-yellow-700 text-white py-1 px-3 rounded-full mr-1"
            on:click={() => {
                inqueryModalBool = true;
            }}
        >
            광고문의
        </button>
        <button
            class=" bg-yellow-300 active:bg-yellow-400 py-1 px-3 rounded-full"
            on:click={kakaoShareLink}
        >
            카톡공유
        </button>
    </div>
</div>

<hr class="my-5" />

<div id="view_area">
    {@html viewData.ld_content}
</div>

<div class="w-full z-50 bg-white">
    <div class="container mx-auto px-1 max-w-[860px] border rounded-t-lg">
        <div class="p-5 w-full md:w-4/5 mx-auto">
            <div class="mb-3 text-center">
                <span class="font-semibold">{viewData.ld_name}</span>
            </div>

            <table class="w-full mx-auto text-xs md:text-sm">
                <tr>
                    <td class="text-center w-1/4 pb-1.5 md:pb-3">
                        이름 <span class="text-red-800">*</span>
                    </td>
                    <td class="w-3/4 pb-1.5 md:pb-3">
                        <input
                            type="text"
                            class="w-full py-1 px-3 border rounded-md focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                            bind:value={cu_name}
                        />
                    </td>
                </tr>
                <tr>
                    <td class="text-center w-1/4">
                        전화번호 <span class="text-red-800">*</span>
                    </td>
                    <td class="flex justify-around">
                        <input
                            type="text"
                            class="w-full py-1 px-3 border rounded-md focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                            bind:value={phNum1}
                        />
                        <div class="flex justify-center items-center px-2">
                            -
                        </div>
                        <input
                            type="text"
                            class="w-full py-1 px-3 border rounded-md focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                            bind:value={phNum2}
                        />
                        <div class="flex justify-center items-center px-2">
                            -
                        </div>
                        <input
                            type="text"
                            class="w-full py-1 px-3 border rounded-md focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                            bind:value={phNum3}
                        />
                    </td>
                </tr>
            </table>

            <div class="pt-3 text-xs md:text-sm flex justify-between">
                <div class="w-1/4 text-center">
                    개인정보 수집 및 이용 동의 <span class="text-red-800">
                        *
                    </span>
                </div>

                <div>
                    <label class="flex justify-center items-center">
                        <input
                            type="checkbox"
                            class="mr-1.5"
                            bind:checked={persnalBool}
                        />
                        <span class="mr-3">동의</span>

                        <button
                            class="text-blue-600"
                            on:click={() => {
                                modalBool = true;
                            }}
                        >
                            (보기)
                        </button>
                    </label>
                </div>
            </div>

            <div class="pt-6 text-center">
                <button
                    class="w-3/4 md:w-2/4 bg-blue-500 active:bg-blue-600 text-white py-2 rounded-lg"
                    on:click={submitPersnalInfo}
                >
                    등록
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    :global(figure) {
        max-width: 100%;
    }
</style>
