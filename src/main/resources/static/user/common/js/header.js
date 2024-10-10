document.addEventListener('DOMContentLoaded', function() {
	const allCategoriesButtons = document.querySelectorAll(".nav-all-categories");
	const modal = document.getElementById('categoryModal');
	const modalCategoryItems = document.querySelectorAll('.modal-category-item');
	const modalSelectedIcons = document.querySelectorAll('.modal-category-icon');
	const korCategories = document.getElementById('modal-categories-kor');
	const foreignCategories = document.getElementById('modal-categories-foreign');
	const headerFixed = document.querySelector('.header-fixed');
	const fixedPosition = 120; // 모달을 고정할 스크롤 위치

	// 스크롤 위치에 따라 헤더 고정 여부 결정 및 모달 고정
	function handleScroll() {
		if (window.scrollY > 120) {
			headerFixed.classList.add('visible');
		} else {
			headerFixed.classList.remove('visible');
		}

		// 모달 고정 처리
		if (window.scrollY > fixedPosition) {
			modal.classList.add('fixed-modal');
		} else {
			modal.classList.remove('fixed-modal');
		}
	}

	handleScroll();
	window.addEventListener('scroll', handleScroll);

	// 모달 열기 또는 닫기
	function toggleModal() {
		const isVisible = modal.classList.contains('visible');

		if (isVisible) {
			closeModal();
		} else {
			openModal();
		}
	}

	function openModal() {
		allCategoriesButtons.forEach(button => {
			const icon = button.querySelector('.all-categories-icon');
			if (icon) {
				icon.src = '/user/common/imgs/category-list-button-open.svg'; // 아이콘 변경
			}
		});
		modal.classList.add('visible');
		resetModal();
	}

	function closeModal() {
		modal.classList.remove('visible');
		allCategoriesButtons.forEach(button => {
			const icon = button.querySelector('.all-categories-icon');
			if (icon) {
				icon.src = '/user/common/imgs/category-list-button.svg'; // 아이콘 원래대로
			}
		});
	}

	allCategoriesButtons.forEach(button => {
		button.addEventListener('click', toggleModal);
	});

	// 모달 밖을 클릭하면 모달 닫기
	window.addEventListener('click', function(event) {
		if (event.target === modal) {
			closeModal();
			resetModal();
		}
	});

	function resetModal() {
		modalCategoryItems.forEach(item => item.classList.remove('active'));
		modalSelectedIcons.forEach(icon => icon.classList.remove('active'));

		korCategories.classList.add('active');
		foreignCategories.classList.remove('active');

		const defaultItem = Array.from(modalCategoryItems).find(item => item.textContent.includes('국내도서'));
		if (defaultItem) {
			defaultItem.classList.add('active');
			const correspondingIcon = defaultItem.nextElementSibling;
			if (correspondingIcon && correspondingIcon.classList.contains('modal-category-icon')) {
				correspondingIcon.classList.add('active');
			}
		}
	}

	function handleCategoryClick(event) {
		event.preventDefault();

		// 초기화
		modalCategoryItems.forEach(item => item.classList.remove('active'));
		modalSelectedIcons.forEach(icon => icon.classList.remove('active'));
		korCategories.classList.remove('active');
		foreignCategories.classList.remove('active');

		// 클릭된 항목에 active 클래스 추가
		const clickedItem = event.currentTarget;
		clickedItem.classList.add('active');

		// 해당 항목의 아이콘도 active 클래스 추가
		const clickedItemsIcon = clickedItem.nextElementSibling;
		if (clickedItemsIcon && clickedItemsIcon.classList.contains('modal-category-icon')) {
			clickedItemsIcon.classList.add('active');
		}

		if (clickedItem.textContent.includes('국내도서')) {
			korCategories.classList.add('active');
		} else if (clickedItem.textContent.includes('외국도서')) {
			foreignCategories.classList.add('active');
		}
	}

	modalCategoryItems.forEach(item => {
		item.addEventListener('click', handleCategoryClick);
	});

	// 장바구니 수량 업데이트
	$.ajax({
		url: "/user/members/getBasketCount",
		method: "GET",
		success: function(response) {
			$(".cart-qty p").text(response);
		},
		error: function() {
			getErrorModal("ERROR");
		}
	});


	$(".search-input").on("keydown", function(e) {
		if (e.key === 'Enter') {
			location.href = `/user/products/searchForm?word=${$(this).val()}`;
		}
	});

	$.get('/user/login-status', function(loggedIn) {
		if (loggedIn) {
			// 로그인 상태일 때
			$('#loginMenu').hide();
			$('#userMenu').show();
		} else {
			// 로그인 상태가 아닐 때
			$('#loginMenu').show();
			$('#userMenu').hide();
		}
	});
});