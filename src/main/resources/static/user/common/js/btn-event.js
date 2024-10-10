// 함수실행
/*activeButton();
filterTextActive();
dateFilterActive();
tabBarActive();*/

// 인풋에 밸류 들어가면 버튼 활성화 (로그인, 회원가입때)
function activeButton() {
    const loginInput = document.querySelector(".input-long");
    const longBtn = document.querySelector(".default-btn.long");
    loginInput.addEventListener("keyup", (e) => {
        longBtn.disabled = loginInput.value === "";
    });
}

// 검색페이지 필터 조건 클릭효과
function filterTextActive() {
    const textBtn = document.querySelectorAll(".filter-text-btn");

    textBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            btn.classList.toggle("on");
        });
    });
}

// 주문번호 검색 최근1개월 버튼클릭 효과
function dateFilterActive() {
    const latestDate = document.querySelectorAll(".latest-date");

    latestDate.forEach((btn) =>
        btn.addEventListener("click", () => {
            latestDate.forEach((otherBtn) => otherBtn.classList.remove("active"));
            btn.classList.add("active");
        })
    );
}

// 인풋 넘버 숫자 (상품 상세페이지 주문수량 인풋)
/**
 * input-qty 숫자에 따른 가격 변동 함수
 * @param {string} priceElement total-price를 표시할 태그의 선택자 (클래스 or 아이디)
 * @param {string} priceData data 속성으로 price를 보내줌
 * ex) th:data-price="${?.book_price}"
 */
// function calcQty(priceElement, priceData) {
//     const inputQty = document.querySelector(".input-qty");
//     const minus = document.querySelector(".fa-minus");
//     const plus = document.querySelector(".fa-plus");
//     let totalPrice = document.querySelector(`${priceElement}`);
//     const price = parseInt(totalPrice.getAttribute(`${priceData}`)) || 0;
//
//     let qty = parseInt(inputQty.value) || 1;
//
//     function updatePrice() {
//         totalPrice.innerText = (price * qty).toLocaleString();
//     }
//
//     updatePrice();
//
//     minus.addEventListener("click", () => {
//         if (qty > 1) {
//             qty--;
//             inputQty.value = qty;
//             updatePrice();
//         } else {
//             getCheckModal("수량은 1개 이상 선택하셔야 합니다.")
//         }
//     });
//
//     plus.addEventListener("click", () => {
//         qty++;
//         inputQty.value = qty;
//         updatePrice();
//     });
//
//     function handleQtyChange() {
//         let newQty = parseInt(inputQty.value);
//         if (isNaN(newQty) || newQty < 1) {
//             newQty = 1;
//         }
//         qty = newQty;
//         inputQty.value = qty;
//         updatePrice();
//     }
//
//     inputQty.addEventListener("change", handleQtyChange);
//     inputQty.addEventListener("input", handleQtyChange);
// }

// 마이페이지 (리뷰, 1:1문의 등 탭 버튼)
function tabBarActive() {
    const tabBtn = document.querySelectorAll(".tab-btn");

    tabBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            // 모든 버튼에서 active 클래스 제거
            tabBtn.forEach((otherBtn) => {
                if (otherBtn !== btn) {
                    otherBtn.classList.remove("active");
                }
            });

            // 클릭된 버튼에 active 클래스 추가
            btn.classList.add("active");
        });
    });
}