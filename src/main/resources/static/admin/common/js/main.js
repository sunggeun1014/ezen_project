document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-items");
    let currentPath = window.location.pathname;

    // 경로의 끝에 슬래시('/')가 있으면 제거 (정규화)
    if (currentPath.endsWith('/')) {
        currentPath = currentPath.slice(0, -1);
    }

    // 페이지가 admin/home 이동하면 모든 메뉴 초기화
    if (currentPath === '/admin/home') {
        // 로컬 스토리지 초기화
        menuItems.forEach((_, index) => {
            localStorage.removeItem(`menu-open-${index}`);
        });
    }

    menuItems.forEach((item, index) => {
        const subMenu = item.querySelector(".sub-menu-list");
        const barImg = item.querySelector(".bar-img");
        const arrowRight = item.querySelector(".fa-chevron-right");
        const iconImg = item.querySelector(".icon-img");
        const listText = item.querySelector(".menu-text > p");

        // 하위 메뉴에서 현재 페이지 경로와 일치하는 링크만 굵어지게 설정
        const subMenuLinks = item.querySelectorAll(".sub-menu-list li a");
        subMenuLinks.forEach(link => {
            const originalHref = link.getAttribute('href'); // 원래의 href 저장

            const href = link.getAttribute('href');

            const trimmedPath = href.split('/').slice(0, 3).join('/') + '/';
            const trimmedCurPath = currentPath.split('/').slice(0, 3).join('/') + '/'; // 현재 경로 자르기

            if (originalHref === currentPath) {
                link.classList.add("current-page");

                // 다른 페이지에서 들어올 때 경로가 맞으면 활성화
                if (subMenu) subMenu.classList.add("open");
                // 추가 효과
                if (barImg) barImg.classList.add("open");
                if (arrowRight) arrowRight.classList.add("open");
                if (iconImg) iconImg.classList.add("open");
                if (listText) listText.classList.add("open");

                localStorage.setItem(`menu-open-${index}`, true);
            }


            if (trimmedPath === trimmedCurPath && originalHref.includes('list') && currentPath.includes('detail')) {
                link.setAttribute('href', trimmedPath + 'detail');
                link.classList.add("current-page");

                const isOpen = localStorage.getItem(`menu-open-${index}`) === "true";

                if (isOpen) {
                    if (subMenu) subMenu.classList.add("open");
                    if (barImg) barImg.classList.add("open");
                    if (arrowRight) arrowRight.classList.add("open");
                    if (iconImg) iconImg.classList.add("open");
                    if (listText) listText.classList.add("open");
                }

                if (subMenu) subMenu.classList.add("open");
                if (barImg) barImg.classList.add("open");
                if (arrowRight) arrowRight.classList.add("open");
                if (iconImg) iconImg.classList.add("open");
                if (listText) listText.classList.add("open");
            }

            if (trimmedPath === trimmedCurPath && currentPath.includes('register')) {
                if (originalHref.includes('managers/list')) {
                    return
                } else {
                    link.setAttribute('href', trimmedPath + 'register');
                    link.classList.add("current-page");

                    const isOpen = localStorage.getItem(`menu-open-${index}`) === "true";

                    if (isOpen) {
                        if (subMenu) subMenu.classList.add("open");
                        if (barImg) barImg.classList.add("open");
                        if (arrowRight) arrowRight.classList.add("open");
                        if (iconImg) iconImg.classList.add("open");
                        if (listText) listText.classList.add("open");
                    }

                    if (subMenu) subMenu.classList.add("open");
                    if (barImg) barImg.classList.add("open");
                    if (arrowRight) arrowRight.classList.add("open");
                    if (iconImg) iconImg.classList.add("open");
                    if (listText) listText.classList.add("open");
                }

            }
            link.setAttribute('href', originalHref);

        });

        // onclick에서 경로 추출하여 현재 경로와 비교
        const hrefValue = item.getAttribute('onclick') ? item.getAttribute('onclick').match(/'([^']+)'/)[1] : null;

        // 현재 경로와 메뉴 경로가 일치하면 자동으로 열림
        if (hrefValue && hrefValue === currentPath) {
            if (subMenu) subMenu.classList.add("open");
            if (barImg) barImg.classList.add("open");
            if (arrowRight) arrowRight.classList.add("open");
            if (iconImg) iconImg.classList.add("open");
            if (listText) listText.classList.add("open");

            // 현재 메뉴를 로컬스토리지에 저장
            localStorage.setItem(`menu-open-${index}`, true);
        }
    });

    // 메뉴 클릭 시 동작
    menuItems.forEach((item, index) => {
        item.addEventListener("click", function (e) {
            const subMenu = this.querySelector(".sub-menu-list");
            const barImg = this.querySelector(".bar-img");
            const arrowRight = this.querySelector(".fa-chevron-right");
            const iconImg = this.querySelector(".icon-img");
            const listText = this.querySelector(".menu-text > p");

            const isCurrentlyOpen = subMenu && subMenu.classList.contains("open");

            // 현재 상태를 로컬 스토리지에 저장
            if (!isCurrentlyOpen) {
                localStorage.setItem(`menu-open-${index}`, true);
            }

            // 하위 메뉴와 이미지가 존재하는지 확인하고 토글
            if (subMenu) subMenu.classList.toggle("open");
            if (barImg) barImg.classList.toggle("open");
            if (arrowRight) arrowRight.classList.toggle("open");
            if (iconImg) iconImg.classList.toggle("open");
            if (listText) listText.classList.toggle("open");

            // 다른 메뉴 초기화
            menuItems.forEach((otherItem, otherIndex) => {
                if (otherItem !== item) {
                    const otherSubMenu = otherItem.querySelector(".sub-menu-list");
                    const otherBarImg = otherItem.querySelector(".bar-img");
                    const otherArrowRight = otherItem.querySelector(".fa-chevron-right");
                    const otherIconImg = otherItem.querySelector(".icon-img");
                    const otherListText = otherItem.querySelector(".menu-text > p");

                    if (otherSubMenu) otherSubMenu.classList.remove("open");
                    if (otherBarImg) otherBarImg.classList.remove("open");
                    if (otherArrowRight) otherArrowRight.classList.remove("open");
                    if (otherIconImg) otherIconImg.classList.remove("open");
                    if (otherListText) otherListText.classList.remove("open");

                    // 다른 메뉴 상태를 로컬 스토리지에서 삭제
                    localStorage.removeItem(`menu-open-${otherIndex}`);
                }
            });
        });
    });

    // 로고 클릭 시 모든 메뉴 상태 초기화
    const logoWrap = document.querySelector(".logo-wrap");
    if (logoWrap) {
        logoWrap.addEventListener("click", function () {
            // 로컬 스토리지 초기화
            menuItems.forEach((_, index) => {
                localStorage.removeItem(`menu-open-${index}`);
            });
            // 홈으로 이동
            location.href = '/admin/home';
        });
    }
	
});


const clock = document.querySelector(".clock")

function getClocks() {
    const date = new Date();
    const nowYear = date.getFullYear();
    const nowMonth = String(date.getMonth() + 1).padStart(2, "0");
    const nowDate = String(date.getDate()).padStart(2, "0");

    const days = `${nowYear}-${nowMonth}-${nowDate}`;

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    clock.innerText = `${days} ${hours}:${minutes}:${seconds}`
}

getClocks();
setInterval(getClocks, 1000)

function datepicker(start, end) {
    const checkDates = () => {
        const startDate = startDatePicker.selectedDates[0];
        const endDate = endDatePicker.selectedDates[0];

        if (startDate && endDate && startDate > endDate) {
            startDatePicker.clear();
        }
    }

    const startDatePicker = flatpickr(`#${start}`, {
        dateFormat: "Y-m-d",
        enableTime: false,
        defaultDate: null,
        onChange: checkDates
    });

    const endDatePicker = flatpickr(`#${end}`, {
        dateFormat: "Y-m-d",
        enableTime: false,
        defaultDate: null,
        onChange: checkDates
    });

}

// 날짜 옵션 기능
function setDateOption(day, obj) {
    const now_date = new Date();
    const new_date = new Date();

    new_date.setDate(now_date.getDate() - day);

    const start_year = new_date.getFullYear();
    const start_month = (new_date.getMonth() + 1).toString().padStart(2, '0');
    const start_day = new_date.getDate().toString().padStart(2, '0');

    const end_year = now_date.getFullYear();
    const end_month = (now_date.getMonth() + 1).toString().padStart(2, '0');
    const end_day = now_date.getDate().toString().padStart(2, '0');

    $(".startDate").val(`${start_year}-${start_month}-${start_day}`);
    $(".endDate").val(`${end_year}-${end_month}-${end_day}`);
	
    $(".date-btn").removeClass("active");
    $(obj).addClass("active");
}

function getConfirmModal(msg, func) {
    let divArea = $("<div id='myModal' class='modal' style='display : block;'></div>");
    let contentArea = $("<div class='modal-content'></div>");

    let messageArea = $(`<div class='modal-text'><p>${msg}</p></div>`);
    let modalFotter = $(`<div class='modal-footer'></div>`)
    let btnArea = $("<button id='confirm-delete' class='modal-btn confirm'>확인</button><button id='cancel-delete' class='modal-btn cancel'>취소</button>");

    contentArea.append(messageArea);

    contentArea.append(modalFotter);
    modalFotter.append(btnArea);
    divArea.append(contentArea);


    $("body").append(divArea);
    $("#confirm-delete").on("click", function () {
        func();
        divArea.remove(); // 모달 제거
    });

    // 취소 버튼 클릭 이벤트
    $("#cancel-delete").on("click", function () {
        divArea.remove(); // 모달 제거
    });

    $("#confirm-delete").focus();
}

function getCheckModal(msg, focusElement) {
    let divArea = $("<div id='myModal' class='modal' style='display: block;'></div>"); // 잘못된 따옴표 수정
    let contentArea = $("<div class='modal-content'></div>");

    let messageArea = $(`<div class='modal-text'><p>${msg}</p></div>`);
    let modalFotter = $("<div class='modal-footer'></div>");  // 문자열 수정
    let btnArea = $("<button id='confirm-delete' class='modal-btn confirm'>확인</button>");

    contentArea.append(messageArea);
    contentArea.append(modalFotter);

    modalFotter.append(btnArea);
    divArea.append(contentArea);

    $("body").append(divArea);
    $(".modal-btn.confirm").on("click", function () {
        divArea.remove(); // 모달 제거
        if (focusElement) {
            focusElement.focus();
        }
    });

    $("#confirm-delete").focus();
}

function getErrorModal(focusElement) {
    let divArea = $("<div id='myModal' class='modal' style='display: block;'></div>"); // 잘못된 따옴표 수정
    let contentArea = $("<div class='modal-content'></div>");

    let messageArea = $(`<div class='modal-text error-text'><i class="fa-solid fa-triangle-exclamation"></i><p>오류가 발생했습니다.</p></div>`);
    let modalFotter = $("<div class='modal-footer'></div>");
    let btnArea = $("<button id='confirm-delete' class='modal-btn confirm error'>확인</button>");

    contentArea.append(messageArea);
    contentArea.append(modalFotter);

    modalFotter.append(btnArea);
    divArea.append(contentArea);

    $("body").append(divArea);
    $(".modal-btn.confirm").on("click", function () {
        divArea.remove(); // 모달 제거
        if (focusElement) {
            focusElement.focus();
        }
    });

    $("#confirm-delete").focus();
}

/**
 * Ajax post 요청 공용함수
 * @param {string} url ajax 요청 보낼 주소
 * @param {object} params ajax에 담아보낼 파라미터
 * @param {function} successFc 통신 성공 시 실행할 콜백함수
 */
function fnPostAjax(url, params, successFc) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(params),
        success: function (jsonData) {
            if (typeof successFc === 'function') {
                successFc(jsonData);
            }
        },
        error: function () {
            getCheckModal('통신 중 오류가 발생했습니다.');
        }
    });
}

function getByteLen(str) {
    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode <= 0x007F) {
            byteLength += 1;
        } else if (charCode <= 0x07FF) {
            byteLength += 2;
        } else {
            byteLength += 3;
        }
		
		if (str[i] === '\n') {
            byteLength += 1;
        }
    }
    return byteLength;
}

function textLengthCheck(obj, maxLength) {
    let content = $(obj).val();
    let contentLength = getByteLen(content);
    
    while (contentLength > maxLength) {
        content = content.slice(0, -1);
        contentLength = getByteLen(content);
    }
    $(obj).val(content);
    $("#current-length").text(contentLength);
    $("#max-length").text(maxLength);
}

function getFormatDate(data) {
    const date = new Date(data);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
	
    return `${year}-${month}-${day}`;
}