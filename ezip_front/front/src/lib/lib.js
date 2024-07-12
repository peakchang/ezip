import Cookies from "js-cookie";


// ******************  에디터 관련

// 글 작성(업로드)시 HTML 태그에서 base64 코드 
export function extractAndReplaceBase64(htmlContent) {
    // 정규식으로 base64 코드를 찾기
    const base64Regex = /<img\s+[^>]*src="(data:[^"]*)"[^>]*>/g;
    let base64Codes = [];
    let match;

    // HTML 내용에서 base64 이미지를 찾고 배열에 저장
    while ((match = base64Regex.exec(htmlContent)) !== null) {
        base64Codes.push(match[1]);
    }

    // base64 코드를 "업로드한 이미지"로 대체
    const updatedHtmlContent = htmlContent.replace(
        base64Regex,
        '<img src="업로드한 이미지" alt="" />',
    );

    return { updatedHtmlContent, base64Codes };
}

// 업로드 후 "업로드한 이미지" 라고 되어 있는 부분 순차적으로 교체
export function replaceWithImageLinks(htmlContent, imageLinks) {
    let index = 0;

    // 정규식으로 "업로드한 이미지" 부분을 찾고 링크로 대체
    const updatedHtmlContent = htmlContent.replace(
        /<img\s+[^>]*src="업로드한 이미지"[^>]*>/g,
        (match) => {
            if (index < imageLinks.length) {
                return `<img src="${imageLinks[index++]}" alt="" />`;
            }
            return match; // 만약 링크가 부족하면 기존 태그 유지
        },
    );

    return updatedHtmlContent;
}

// *************** 에디터 관련 끝~~~~


export const isStrongPassword = (password) => {
    // 비밀번호가 6자리 이상이고, 숫자, 문자, 특수문자가 혼합되었는지 확인하는 정규표현식
    const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W).{6,}$/;
    return regex.test(password);
}


export const cleanPhoneNumber = (phoneNumber) => {
    // 전화번호에서 하이픈(-)을 제거하여 숫자만 남깁니다.
    const cleanedNumber = phoneNumber.replace(/-/g, "");

    // 010으로 시작하는 11자리 숫자인지 확인합니다.
    const regex = /^010\d{8}$/; // 010으로 시작하고, 뒤에 8자리 숫자가 오는지 확인하는 정규표현식
    const isValidPhoneNumber = regex.test(cleanedNumber);

    // 유효한 전화번호일 경우 숫자만 남긴 값(cleanedNumber)을 반환하고, 그렇지 않을 경우 false를 반환합니다.
    return isValidPhoneNumber ? cleanedNumber : false;
}

export const isEmptyObj = (obj) => {
    let result = true;
    try {
        if (obj.constructor === Object
            && Object.keys(obj).length === 0) {
            result = false;
        }
    } catch (error) {
        result = false;
    }
    return result;
}




export const cookiesExpireAtMidnight = (name, value) => {
    var now = new Date();

    // 현재 날짜를 설정
    now.setHours(0, 0, 0, 0);

    // 당일 자정에 만료될 쿠키를 설정하기 위해
    // 날짜를 하루 뒤로 설정
    now.setDate(now.getDate() + 1);
    now.setHours(now.getHours() + 9);

    // 쿠키 설정
    Cookies.set(name, value, { expires: now });
}


export const isValidEmail = (email) => {
    // 이메일 유효성 검사를 위한 정규 표현식
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // 정규 표현식을 사용하여 이메일 주소 검사
    return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber) {
    // 정규 표현식: 숫자 또는 하이픈 외의 문자가 있는지 확인
    const regex = /^[0-9-]+$/;

    // 문자열이 "010"으로 시작하는지 확인
    if (!phoneNumber.startsWith("010")) {
        return false;
    }

    // 문자열이 오직 숫자와 하이픈으로만 구성되어 있는지 확인
    if (!regex.test(phoneNumber)) {
        return false;
    }

    // 하이픈을 제거한 숫자의 길이가 11자인지 확인
    const digitsOnly = phoneNumber.replace(/-/g, "");
    if (digitsOnly.length !== 11) {
        return false;
    }

    return true;
}



export const dataURItoBlob = (dataURI) => {
    const bytes =
        dataURI.split(",")[0].indexOf("base64") >= 0
            ? atob(dataURI.split(",")[1])
            : unescape(dataURI.split(",")[1]);
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
};


export const moveToMiddle = (target) => {
    const clientRect = target.getBoundingClientRect();
    const relativeTop = clientRect.top;
    const scrolledTopLength = window.pageYOffset;
    const absoluteTop = scrolledTopLength + relativeTop - 150;
    window.scrollTo({
        top: absoluteTop,
        behavior: "smooth",
    });

    setTimeout(() => {
        target.focus();
    }, 300)
}



export const returnObjOtherVal = (obj, inpKey, inpVal, outKey) => {
    // @ts-ignore
    for (const itj of obj) {
        if (itj[inpKey] === inpVal) {
            return itj[outKey]
        }
    }
}


export const getRandomNumbers = (maxCount, count) => {
    const randomNumbers = [];

    if (maxCount < count) {
        // maxCount가 count보다 작을 경우, 가능한 범위 내에서 모든 값을 사용합니다.
        for (let i = 0; i <= count; i++) {
            const randomNumber = Math.floor(Math.random() * (maxCount + 1));
            randomNumbers.push(randomNumber);
        }
    } else {
        // maxCount가 count 이상이면 중복 없이 랜덤 값을 생성합니다.
        while (randomNumbers.length < count) {
            const randomNumber = Math.floor(Math.random() * (maxCount + 1));

            // 중복된 값이 아니면 배열에 추가
            if (!randomNumbers.includes(randomNumber)) {
                randomNumbers.push(randomNumber);
            }
        }
    }
    return randomNumbers;
}


