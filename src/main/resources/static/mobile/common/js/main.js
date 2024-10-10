linkTabbar();

function linkTabbar() {
    const menuItems = document.querySelectorAll(".menu-item");
    const links = document.querySelectorAll(".menu-wrap");

    let currentPath = window.location.pathname;

    if (currentPath.endsWith('/')) {
        currentPath = currentPath.slice(0, -1);
    }

    const setActive = (index, isActive) => {
        const tabIcon = links[index].querySelector(".tab-icon");
        const tabText = links[index].querySelector(".menu-wrap > p");
        if (isActive) {
            tabIcon.classList.add('on');
            tabText.classList.add('on');
            localStorage.setItem(`menu-open-${index}`, true);
        } else {
            tabIcon.classList.remove('on');
            tabText.classList.remove('on');
            localStorage.removeItem(`menu-open-${index}`);
        }
    };

    links.forEach((link, index) => {
        const href = link.getAttribute('href');
        const isOpen = localStorage.getItem(`menu-open-${index}`) === "true";

        setActive(index, isOpen);

        const conditions = [
            href === currentPath,
            (href.includes('dispatch') && currentPath.includes('stockout')),
            (href.includes('warehousing') && currentPath.includes('stockIn')),
            (href.includes('index') && currentPath.includes('delivery-detail')),
        ];

        if (conditions.some(condition => condition)) {
            setActive(index, true);
        } else {
            setActive(index, false);
        }
    });

    menuItems.forEach((menu, index) => {
        menu.addEventListener("click", (e) => {
            const tabIcon = menu.querySelector(".tab-icon");
            const tabText = menu.querySelector(".menu-wrap > p");

            const isCurrentlyOpen = tabText.classList.contains("on");
            setActive(index, !isCurrentlyOpen);

            if (!isCurrentlyOpen) {
                menuItems.forEach((other, otherIndex) => {
                    if (other !== menu) {
                        setActive(otherIndex, false);
                    }
                });
            }
        });
    });
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
    $("#confirm-delete").on("click", function() {
        func();
        divArea.remove(); // 모달 제거
    });

    // 취소 버튼 클릭 이벤트
    $("#cancel-delete").on("click", function() {
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
    $(".modal-btn.confirm").on("click", function() {
        divArea.remove(); // 모달 제거
        if(focusElement) {
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
    $(".modal-btn.confirm").on("click", function() {
        divArea.remove(); // 모달 제거
        if(focusElement) {
            focusElement.focus();
        }
    });

    $("#confirm-delete").focus();
}