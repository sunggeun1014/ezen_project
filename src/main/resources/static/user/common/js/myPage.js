window.onload = function () {
    showSideMenu();
    getProfileImg();
}

// 마이페이지 사이드메뉴
function showSideMenu() {
    const menus = document.querySelectorAll(".sub-menu-list");
    const links = document.querySelectorAll(".sub-menu-list > a");
    let fullURL = window.location.href;

    if (fullURL.endsWith('/')) {
        fullURL = fullURL.slice(0, -1);
    }

    links.forEach((link, index) => {
        const originHref = link.getAttribute('href');
        const isOpen = localStorage.getItem(`menu-open-${index}`) === "true";

        if (isOpen) {
            link.classList.add('on');
        }

        if (fullURL.includes('order') && originHref.includes('order') ||
            fullURL.includes('update') && originHref.includes('update') ||
            fullURL.includes('delete') && originHref.includes('delete') ||
            fullURL.includes('review') && originHref.includes('review') ||
            fullURL.includes('notice') && originHref.includes('notice') ||
            fullURL.includes('inquiries') && originHref.includes('inquiries')) {
            link.classList.add('on');
            localStorage.setItem(`menu-open-${index}`, true);

            if (fullURL.includes('review') && fullURL.includes('order') && originHref.includes('review')) {
                links[0].classList.remove('on');
                localStorage.removeItem(`menu-open-0`);
            }
        } else {
            link.classList.remove('on');
            localStorage.removeItem(`menu-open-${index}`);
        }
    });

    // 메뉴 클릭 이벤트
    menus.forEach((list, index) => {
        list.addEventListener("click", (e) => {
            // 클릭한 메뉴의 링크
            const menuText = list.querySelector(".sub-menu-list > a");

            // 다른 메뉴 클래스 제거
            menus.forEach((otherList, otherIndex) => {
                const otherText = otherList.querySelector(".sub-menu-list > a");
                if (otherList !== list) {
                    otherText.classList.remove("on");
                    localStorage.removeItem(`menu-open-${otherIndex}`);
                }
            });

            // 클릭한 메뉴 토글
            const isCurrentlyOpen = menuText.classList.contains("on");
            if (isCurrentlyOpen) {
                menuText.classList.remove("on");
                localStorage.removeItem(`menu-open-${index}`);
            } else {
                menuText.classList.add("on");
                localStorage.setItem(`menu-open-${index}`, true);
            }
        });
    });
}


function getProfileImg() {
    const imgs = ['홍길동.png', '고길동.jpg'];

    const randomIndex = Math.floor(Math.random() * imgs.length);

    const randomImg = imgs[randomIndex];

    const userImg = document.querySelector(".user-img");
    userImg.setAttribute("src", `/user/common/imgs/${randomImg}`);
}