function agreeClickHandler() {
    const agreeTitles = document.querySelectorAll('.agree-title');
    const agreeTexts = document.querySelectorAll('.agree-content');

    agreeTitles.forEach((title, index) => {
        title.addEventListener('click', function () {
            const text = agreeTexts[index]; // Get the corresponding text element
            const isActive = title.classList.contains('active');

            agreeTitles.forEach((otherTitle, i) => {
                otherTitle.classList.remove('active');
                agreeTexts[i].classList.remove('on');
            });

            if (!isActive) {
                title.classList.add('active');
                text.classList.add('on');
            }
        });
    });
}


function showDoorPWInput() {
    const doorPW = document.querySelector("#door-pw");
    const doorFree = document.querySelector("#door-free");
    const doorPwInput = document.querySelector(".input-wrap");

    doorPW.addEventListener('click', function () {
        if (doorPW.checked) {
            doorPwInput.style.display = 'block';
        }
    });

    doorFree.addEventListener('click', function () {
        if (doorFree.checked) {
            doorPwInput.style.display = 'none';
        }
    });
}

const hyphenTel = (target) => {
    target.value = target.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
}

const deliverName = document.getElementById("deliver-name");
const deliverNumber = document.getElementById("deliver-number");
const deliverAddr = document.getElementById("deliver-addr");
const deliverAddrDe = document.getElementById("deliver-addr-detail");

function showEditAddrModal() {
    const editBtn = document.querySelector("#edit-btn");
    const closeBtn = document.querySelector("#close-btn");
    const addrModal = document.querySelector("#edit-addr-modal");
    const confirmBtn = document.getElementById("confirm-btn");

    // 주소 입력 관련 요소
    const editAddInput = document.getElementById("edit-addr");
    const editDetailAddrInput = document.getElementById("edit-addr-detail");
    const searchBtn = document.getElementById("search-btn");
    const addrBox = document.querySelector(".addr-input-box");
    const errorMsg = document.querySelector(".edit-error");

    editBtn.addEventListener('click', function () {
        addrModal.classList.add("on");
    });

    closeBtn.addEventListener("click", function () {
        addrModal.classList.remove("on");
    });

    // 주소 검색 팝업 열기
    function openAddrPopUP() {
        new daum.Postcode({
            oncomplete: function (data) {
                // 주소 입력 필드에 값 설정
                editAddInput.value = data.address;

                // 상세주소 입력 필드에 포커스 주기 (약간의 지연 추가)
                setTimeout(function () {
                    if (editDetailAddrInput) {
                        editDetailAddrInput.value = '';
                        editDetailAddrInput.focus();
                    }
                }, 100);  // 100ms 지연
            }
        }).open(); // 팝업 창을 엽니다
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", openAddrPopUP);
    }

    if (addrBox) {
        addrBox.addEventListener("click", openAddrPopUP);
    }

    editDetailAddrInput.addEventListener("keyup", function () {
        editDetailAddrInput.classList.remove("error");
        errorMsg.textContent = '';
    })

    const consonantRegex = /^[ㄱ-ㅎ]*$/;
    const vowelRegex = /^[ㅏ-ㅣ]*$/;

    editDetailAddrInput.classList.remove("error");
    errorMsg.textContent = "";

    confirmBtn.addEventListener("click", function () {
        const detailAddrValue = editDetailAddrInput.value.trim();
		
		if(!$("#edit-name").val()) {
			$("#edit-name").addClass("error");
			errorMsg.textContent = "⚠️ 이름을 입력하세요";
			return;
		}
		
		if(!$("#edit-number").val()) {
			$("#edit-number").addClass("error");
			errorMsg.textContent = "⚠️ 전화번호를 입력하세요";
			return;
		}

        const nameInput = document.getElementById("edit-name");
        const numberInput = document.getElementById("edit-number");

        // 변경된 주소정보 업데이트
        let newName = nameInput.value;
        let newNumber = numberInput.value;
        let newAddr = editAddInput.value;
        let newAddrDetail = editDetailAddrInput.value;

        deliverName.textContent = newName;
        deliverNumber.textContent = newNumber;
        deliverAddr.textContent = newAddr;
        deliverAddrDe.textContent = newAddrDetail;

        addrModal.classList.remove("on");
    });
}

function toggleProductList() {
    const head = document.querySelector(".product-head")
    const list = document.querySelector(".list-wrap")
    const arrow = document.querySelector(".product-info-arrow")

    head.addEventListener("click", function () {
        list.classList.toggle("off")
        arrow.classList.toggle("off")
        head.classList.toggle("off")
    })
}

function showLoginCheckModal() {
    const memberCheck = document.getElementById("member-check")
    let isLogin = memberCheck.getAttribute("data-member")

    if (isLogin === "false") {
        getDataCheckModal("잘못된 접근입니다.", function () {
            location.href = '/user/login'
        });
    }
}

function goToOrder() {
    const payBtn = document.getElementById("pay-btn");
    const entPwInput = document.getElementById("common_ent_pw");
    const errorMsg = document.querySelector(".error-message")

    entPwInput.addEventListener('keyup', function () {
        entPwInput.classList.remove("error")
        errorMsg.style.display = 'none';
    })

    const memberId = document.getElementById("member_id").value;
    const totalAmount = parseInt(document.querySelector(".price > p:first-child").textContent.replace(/,/g, ''));
    const orderNameInput = document.getElementById("order_name")
    const orderName = orderNameInput.getAttribute("data-order-name")
    const paymentId = `${Date.now()}_${totalAmount}`
    const cartNums = document.querySelectorAll(".cart_num");

    // 디테일 정보
    const bookIsbns = document.querySelectorAll(".order-book-isbn");
    const orderQtys = document.querySelectorAll(".order_detail_qty");
    const orderPrices = document.querySelectorAll(".order_detail_price");
	
    let details = [];

    bookIsbns.forEach((isbn, index) => {
        const detail = {
            book_isbn: isbn.getAttribute("data-isbn"),
            order_detail_qty: orderQtys[index].value,
            order_detail_price: orderPrices[index].value
        };
        details.push(detail);
    });

    payBtn.addEventListener('click', function (e) {
        showLoginCheckModal();

        const entPwInputValue = entPwInput.value.trim();
        const isCommonDoor = document.getElementById("door-pw").checked;
        const isFreeDoor = document.getElementById("door-free").checked;

        let commonPW;
        if (isFreeDoor) {
            commonPW = '자유출입'
        } else if (isCommonDoor) {
            commonPW = entPwInputValue;
        }

        if (isCommonDoor && entPwInputValue === "") {
            entPwInput.classList.add("error")
            errorMsg.textContent = '⚠️ 공동현관 비밀번호를 입력하세요'
            return
        }

        const customerInfo = {
            customerId: memberId,
        }

        let cartNum = [];
        cartNums.forEach(num => {
            cartNum.push(num.value);
        })

        const data = {
            order_addr: deliverAddr.textContent,
            order_addr_detail: deliverAddrDe.textContent,
            common_ent_pw: commonPW,
            member_id: memberId,
            recipient_name: deliverName.textContent,
            recipient_phoneno: deliverNumber.textContent,
            paymentId: paymentId,
            cart_num: Array.isArray(cartNum) && cartNum.length > 0 ? cartNum : [], // 빈 배열로 초기화
            orderDetails: details,
        };

        // // cart_num이 비어있으면 아예 해당 속성을 제거
        // if (cartNum && cartNum.length > 0) {
        //     data.cart_num = cartNum; // 카트넘이 있을 경우만 추가
        // }

        PortOne.requestPayment({
            storeId: "store-5d54b2b0-bf88-45dd-8265-7018895b8a38",
            channelKey: "channel-key-db630549-a619-4ab8-8739-466edb7307c6",
            paymentId: paymentId,
            orderName: orderName,
            customer: customerInfo,
            totalAmount: totalAmount,
            payMethod: "CARD",
            currency: "CURRENCY_KRW"
        }).then(response => {
            if (response.code != null) {
				
                return;
            }
            $.ajax({
                url: '/user/payment/request',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (response, status, xhr) {
                    const jsonResponse = JSON.parse(response);
                    if (xhr.status === 200 && jsonResponse.order_num) {
                        // 페이지 이동
                        window.location.href = `/user/complete-order?order_num=${jsonResponse.order_num}&member_id=${memberId}`;
                    } else {
						
                    }
                },
                error: function (xhr, status, error) {
					
                }
            })
        }).catch(error => {
			
        });

    })
}

document.addEventListener('DOMContentLoaded', function () {
    showDoorPWInput();
    agreeClickHandler();
    showEditAddrModal();
    toggleProductList();
    goToOrder();
});

window.onload = function () {
    showLoginCheckModal();
}
