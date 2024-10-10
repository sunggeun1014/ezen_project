function getConfirmModal(msg1, msg2, func) {
    let divArea = $("<div id='myModal' class='modal' style='display : block;'></div>");
    let contentArea = $("<div class='modal-content'></div>");

    let messageArea = $(`<div class='modal-text'><p>${msg1}</p><p>${msg2}</p></div>`);
    let modalFooter = $(`<div class='modal-footer'></div>`)
    let btnArea = $("<button id='confirm-delete' class='modal-btn confirm'>확인</button><button id='cancel-delete' class='modal-btn cancel'>취소</button>");

    contentArea.append(messageArea);

    contentArea.append(modalFooter);
    modalFooter.append(btnArea);
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

function getDataCheckModal(msg, func) {
    let divArea = $("<div id='myModal' class='modal' style='display: block;'></div>"); // 잘못된 따옴표 수정
    let contentArea = $("<div class='modal-content'></div>");

    let messageArea = $(`<div class='modal-text'><p>${msg}</p></div>`);
    let modalFooter = $("<div class='modal-footer'></div>");  // 문자열 수정
    let btnArea = $("<button id='confirm-delete' class='modal-btn confirm'>확인</button>");

    contentArea.append(messageArea);
    contentArea.append(modalFooter);

    modalFooter.append(btnArea);
    divArea.append(contentArea);

    $("body").append(divArea);
    $(".modal-btn.confirm").on("click", function() {
        func()
        divArea.remove(); // 모달 제거
    });

    $("#confirm-delete").focus();
}


function getCheckModal(msg, focusElement) {
    let divArea = $("<div id='myModal' class='modal' style='display: block;'></div>"); // 잘못된 따옴표 수정
    let contentArea = $("<div class='modal-content'></div>");

    let messageArea = $(`<div class='modal-text'><p>${msg}</p></div>`);
    let modalFooter = $("<div class='modal-footer'></div>");  // 문자열 수정
    let btnArea = $("<button id='confirm-delete' class='modal-btn confirm'>확인</button>");

    contentArea.append(messageArea);
    contentArea.append(modalFooter);

    modalFooter.append(btnArea);
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

function getErrorModal(msg, focusElement) {
    let divArea = $("<div id='myModal' class='modal' style='display: block;'></div>"); // 잘못된 따옴표 수정
    let contentArea = $("<div class='modal-content'></div>");

    let messageArea = $(`<div class='modal-text error-text'><i class="fa-solid fa-triangle-exclamation"></i><p>${msg}</p></div>`);
    let modalFooter = $("<div class='modal-footer'></div>");
    let btnArea = $("<button id='confirm-delete' class='modal-btn confirm error'>확인</button>");

    contentArea.append(messageArea);
    contentArea.append(modalFooter);

    modalFooter.append(btnArea);
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


// 탑버튼
const BODY = document.body; //scrolling
const topBtn = document.querySelector("#top-btn");

window.addEventListener("scroll", function () {
    let i = this.document.documentElement.scrollTop;

    if (i > 600) {
        BODY.classList.add("scrolling");
    } else {
        BODY.classList.remove("scrolling");
    }
});

// 탑버튼 클릭 스크롤링
if(topBtn != null) {
	topBtn.addEventListener("click", function () {
	    window.scrollTo({
	        top: 0,
	        behavior: "smooth",
	    });
	});
}


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

function drawNoResult(parentEl, msg, additionalSpans = []) {
    const parentElement = document.querySelector(`${parentEl}`);

    const resultWrap = document.createElement("div")
    const p = document.createElement("p")
    const titleText = document.createElement("span")

    resultWrap.classList.add("result-wrap")

    p.textContent = "!";
    titleText.textContent = `${msg}`

    resultWrap.appendChild(p);
    resultWrap.appendChild(titleText);

    additionalSpans.forEach(text => {
        const newSpan = document.createElement("span")
        newSpan.textContent = text;
        resultWrap.appendChild(newSpan);
    })

    parentElement.appendChild(resultWrap)
}

function drawNoResultDefault(parentEl, msg) {
    const parentElement = document.querySelector(`${parentEl}`)

    const resultWrap = document.createElement("div")
    const p = document.createElement("p")
    const titleText = document.createElement("span")

    resultWrap.classList.add("result-wrap")

    p.textContent = "!";
    titleText.textContent = `${msg}`

    resultWrap.appendChild(p);
    resultWrap.appendChild(titleText);

    parentElement.appendChild(resultWrap)
}


let scrollPosition = 0;
// 스크롤 불가
function disableScroll() {
    scrollPosition = window.scrollY
    BODY.style.position = 'fixed';
    BODY.style.top = `-${scrollPosition}px`;
    BODY.style.overflow = 'hidden';
    BODY.style.width = '100%';
}

// 스크롤 가능
function enableScroll() {
    BODY.style.position = '';
    BODY.style.top = '';
    BODY.style.overflow = '';
    window.scrollTo(0, scrollPosition);
}

// function disableScroll() {
//     BODY.classList.add('hidden')
//     document.documentElement.classList.add('hidden')
// }
//
// function enableScroll() {
//     BODY.classList.remove('hidden')
//     document.documentElement.classList.remove('hidden')
// }