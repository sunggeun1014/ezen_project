function toggleOrderList() {
    const head = document.querySelector(".info-head")
    const listWrap = document.querySelector(".list-wrap")
    const arrow = document.querySelector(".product-info-arrow")

    head.addEventListener("click", function () {
        head.classList.toggle("active")
        listWrap.classList.toggle("active")
        arrow.classList.toggle("active")
    })
}

function moveOtherPage() {
    const goMain = document.getElementById("go-main")
    const goDetail = document.getElementById("go-detail")
    const orderNum = document.getElementById("order_num").value

    function urlAction(btn, url) {
        btn.addEventListener("click", function () {
            location.href = url
        })
    }

    urlAction(goMain, "/user/main")
    urlAction(goDetail, `/user/mypage/orderDetail?orderNum=${orderNum}`)
}


document.addEventListener('DOMContentLoaded', function () {
    toggleOrderList();
    moveOtherPage();
})