console.log("하이");

document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll(".menu-items");

    // 로컬 스토리지에서 메뉴 상태를 불러와 복원
    menuItems.forEach((item, index) => {
        const subMenu = item.querySelector(".sub-menu-list");
        const barImg = item.querySelector(".bar-img");
        const arrowRight = item.querySelector(".fa-chevron-right");
        const iconImg = item.querySelector(".icon-img");
        const listText = item.querySelector(".menu-text > p");

        const isOpen = localStorage.getItem(`menu-open-${index}`) === "true";

        if (isOpen) {
            if (subMenu) subMenu.classList.add("open");
            if (barImg) barImg.classList.add("open");
            if (arrowRight) arrowRight.classList.add("open");
            if (iconImg) iconImg.classList.add("open");
            if (listText) listText.classList.add("open");
        }
    });

    menuItems.forEach((item, index) => {
        item.addEventListener("click", function(e) {
            const subMenu = this.querySelector(".sub-menu-list");
            const barImg = this.querySelector(".bar-img");
            const arrowRight = this.querySelector(".fa-chevron-right");
            const iconImg = this.querySelector(".icon-img");
            const listText = this.querySelector(".menu-text > p");

            const isCurrentlyOpen = subMenu && subMenu.classList.contains("open");

            // 현재 상태를 로컬 스토리지에 저장
            if (!isCurrentlyOpen) {
                localStorage.setItem(`menu-open-${index}`, true);
            } //else {
                //localStorage.removeItem(`menu-open-${index}`); // 메뉴가 닫히면 데이터 삭제
            //}

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
});





const clock = document.querySelector(".clock")

const now = new Date();
const nowYear = now.getFullYear();
const nowMonth = String(now.getMonth() + 1).padStart(2, "0");
const nowDate = String(now.getDate()).padStart(2, "0");

const days = `${nowYear}-${nowMonth}-${nowDate}`;

function getClocks() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  clock.innerText = `${days} ${hours}:${minutes}:${seconds}`
}


getClocks();
setInterval(getClocks, 1000)