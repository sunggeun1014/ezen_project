document.addEventListener('DOMContentLoaded', function() {
	const bannersSize = $(".swiper-slide").attr("data-banners-size");
	
	// 배너 슬라이드 swiper
	new Swiper('.swiper', {
		loop: bannersSize <= 3 ? false : true, // 무한 루프 설정
		slidesPerView: 2,
		centeredSlides: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true, // 페이지네이션 클릭 가능
		},
		watchOverflow : true,
		effect: 'slide', // 효과를 슬라이드로 설정 (기본값)
		autoplay: {
			delay: 3000,   // 시간 설정
			disableOnInteraction: false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
		},
	});

	// 현재 월을 베스트셀러 제목에 반영
	const now = new Date();
	const month = now.getMonth() + 1;
	const titleElement = document.getElementById('best-seller-month');
	titleElement.textContent = titleElement.textContent.replace('월의 베스트셀러', `${month}월의 베스트셀러`);

	document.querySelectorAll('.add-cart-button').forEach(button => {
		button.addEventListener('click', function() {
			const bookIsbn = this.getAttribute('data-isbn');
			addToCart(bookIsbn, 1);
		});
	});

});

function redirectToDetailPage(isbn) {
	window.location.href = './products/detail?book_isbn=' + encodeURIComponent(isbn);
}

function addToCart(bookIsbn, qty) {
	const cartItem = { book_isbn: bookIsbn, cart_purchase_qty: qty };

	// 로그인 상태 확인
	$.ajax({
		url: '/user/login-status',
		type: 'GET',
		success: function(isLoggedIn) {
			if (!isLoggedIn) {
				// 로그인하지 않은 경우 모달창 띄우기
				getConfirmModal("로그인하지 않으셨습니다.", "로그인 페이지로 이동하시겠습니까?", function() {
					location.href = '/user/login'; // 로그인 페이지로 리다이렉트
				});
				return;
			}

			$.ajax({
				url: '/user/cart/add',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(cartItem),
				success: function(response) {
					let msg1 = '';
					let msg2 = '';
					let redirectUrl = null;

					if (response.success === true) {
						msg1 = '장바구니에 상품이 추가되었습니다.';
						msg2 = '장바구니로 이동하시겠습니까?';
						redirectUrl = '/user/cart/list';
						// 장바구니 수량을 업데이트
						updateHeaderBasketCount();
					} else if (response.status === 'warning') {
						msg1 = '장바구니에 이미 있는 상품입니다.';
						msg2 = '장바구니로 이동하시겠습니까?';
						redirectUrl = '/user/cart/list';
						// 장바구니 수량을 업데이트
						updateHeaderBasketCount();
					}

					getConfirmModal(msg1, msg2, function() {
						if (redirectUrl) {
							location.href = redirectUrl;
						}
					});
				},
				error: function(xhr) {
					if (xhr.status === 401) {
						location.href = '/user/login';
					} else {
						getErrorModal('장바구니 추가에 실패했습니다.');
					}
				}
			});
		},
	});
}


function updateHeaderBasketCount() {
	$.ajax({
		url: "/user/members/getBasketCount",
		method: "GET",
		success: function(response) {
			document.querySelectorAll('.cart-qty p').forEach(p => {
				p.textContent = response;
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			getErrorModal("ERROR");
		}
	});
}
