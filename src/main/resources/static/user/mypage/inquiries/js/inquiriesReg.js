$(document).ready(function () {
	const maxByteLength = 500;


	function getByteLength(str) {
		let byteLength = 0;
		for (let i = 0; i < str.length; i++) {
			let charCode = str.charCodeAt(i);
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


	$("#inquiryContent").on("input", function () {
		let textarea = $(this);
		let content = textarea.val();
		let byteLength = getByteLength(content);

		while (byteLength > maxByteLength) {
			content = content.slice(0, -1);
			byteLength = getByteLength(content);
		}
		textarea.val(content);

		$("#charCount").text(getByteLength(textarea.val()));
	});

	$("form").on("submit", function(e){
		let title = $("#inquiryTitle").val();
		let content = $("#inquiryContent").val();
		let orderNumer = $("#order-number").val();
		let inquiryType = $('#inquiryTypeSelect').val();

		if (inquiryType !== '01' && inquiryType !== '07' && !orderNumer) {
			getErrorModal("문의할 상품을 선택해주세요");
			$("#order-number").focus();
			e.preventDefault();
			return;
		}

		if (!title) {
			getErrorModal("제목을 입력해주세요");
			$("#inquiryTitle").focus();
			e.preventDefault();
			return;
		}

		if (!content) {
			getErrorModal("문의 내용을 입력해주세요");
			$("#inquiryContent").focus();
			e.preventDefault();
			return;
		}
	});

});


function openOrderProduct() {
	let now = new Date();

	let oneMonthAgo = new Date();
	oneMonthAgo.setMonth(now.getMonth() - 1);
	let startDate = formatDateForDB(oneMonthAgo, 'start');
	let endDate = formatDateForDB(new Date(), 'end');

	$.ajax({
		url: '/user/mypage/inquiries-page/search-order',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ startDate: startDate, endDate: endDate }),
		success: function (response) {
			const orderList = response;
			createOrderModal(orderList);
		},
		error: function () {
			getErrorModal("주문 데이터를 불러오는 중 오류가 발생했습니다.");
			return;
		}
	});
}


function createOrderModal(orderList) {

	let divArea = $("<div id='myModal' class='modal' style='display: block;'></div>");
	let contentArea = $("<div class='inquiry-modal-content'></div>");
	let headArea = $("<div></div>");
	let messageArea = $("<div class='inquiry-modal-text'><h3>주문상품 선택</h3><button id='cancel-btn' class='cancel-btn-img'></button></div>");
	let modalFotter = $("<div class='custom-modal-footer'></div>");
	let btnArea = $("<button id='confirm-select' class='custom-modal-btn confirm'>선택완료</button>");


	let orderArea = $("<div class='order-list'></div>");


	function populateOrderList(orderList) {
		orderArea.empty();

		orderList.forEach(order => {
			let formattedDate = formatDate(order.order_purchase_date);
			const books = order.books || [];
			let hasMultipleBooks = books.length > 1;
			

			let orderItem = $(`
			    <div class='order-item' id="${order.order_num}">
			        <div class="flex-center">
			            <p class="sub-title-font">${formattedDate}</p>
			            <span class="btn-spacebetween">|</span>
			            <p>주문번호 ${order.order_num}</p>
			        </div>
			        <div class="flex-center between">
			            <div class="flex-center">
			                <input type='radio' name='order' id="order-${order.order_num}" value='${order.order_num}' 
			                    data-order-detail-num='${books.length > 0 ? books[0].order_detail_num : ''}' 
			                    data-qty='${books.length > 0 ? books[0].order_detail_qty - books[0].order_request_qty : ''}' 
			                    onclick="handleRadioClick('${order.order_num}')"/>
			                <label for="order-${order.order_num}">${books.length > 0 ? books[0].book_name : '책 정보 없음'} ${hasMultipleBooks ? `외 ${books.length - 1}건` : ''}</label>
			            </div>
			            ${hasMultipleBooks ? `<i class="icon-arrow-off" id="order-arrow-${order.order_num}"></i>` : ''}
			        </div>
			    </div>
			`);

			let orderDetail = (`
			${hasMultipleBooks ? `
			            <div class="order-details off" id="order-details-${order.order_num}">
			                ${books.map((book, index) => `
			                    <div class='flex-center'>
			                        <input type='checkbox' class="check-box" id='book-${order.order_num}-${index}' 
			                            data-order-num='${order.order_num}' 
			                            data-order-detail-num='${book.order_detail_num}' 
			                            data-qty='${book.order_detail_qty - book.order_request_qty}' 
			                            onclick="handleCheckboxClick('${order.order_num}', this)"/>
			                        <label for='book-${order.order_num}-${index}'></label>
			                        <label for='book-${order.order_num}-${index}'>${book.book_name}</label>
			                    </div>
			                `).join('')}
			            </div>
			        ` : ''}
			`)

			orderArea.append(orderItem);
			orderArea.append(orderDetail);
		});
	}

	populateOrderList(orderList);


	headArea.append(messageArea);
	contentArea.append(headArea);
	contentArea.append(orderArea);
	modalFotter.append(btnArea);
	contentArea.append(modalFotter);
	divArea.append(contentArea);

	$("body").append(divArea);
	disableScroll();

	function setOrderDetails(orderNumber, orderDetailNumber, maxQty) {

		$("#order-number-display").text(orderNumber);
		$("#order-detail-number-display").text(orderDetailNumber);

		$("#quantity").attr("max", maxQty);


		$("#order-number").val(orderNumber);
		$("#order-detail-number").val(orderDetailNumber);
	}


	$(".custom-modal-btn.confirm").on("click", function () {
		let selectedOrder = $("input[name='order']:checked");
		let selectedBook = $("input.check-box:checked").first();

		let inquiryType = $("#inquiryTypeSelect").val();
		let isQuantityRequired = inquiryType === '04' || inquiryType === '05' || inquiryType === '06';

		if (selectedOrder.length && !selectedBook.length) {

			let orderNumber = selectedOrder.val();
			let orderDetailNumber = selectedOrder.data('orderDetailNum');
			let orderQty = selectedOrder.data('qty');


			if (orderQty <= 0 && isQuantityRequired) {
				getErrorModal("해당 상품의 모든 수량이 이미 요청 상태입니다. 다른 문의 유형을 선택해주세요.");
				return;
			}

			setOrderDetails(orderNumber, orderDetailNumber, orderQty);

		} else if (selectedOrder.length && selectedBook.length) {

			let orderNumber = selectedBook.data('orderNum');
			let orderDetailNumber = selectedBook.data('orderDetailNum');
			let bookQty = selectedBook.data('qty');


			if (bookQty <= 0 && isQuantityRequired) {
				getErrorModal("해당 상품의 모든 수량이 이미 요청 상태입니다. 다른 문의 유형을 선택해주세요.");
				return;
			}

			setOrderDetails(orderNumber, orderDetailNumber, bookQty);
		}

		divArea.remove();
		enableScroll();

		let quantitySection = document.getElementById('quantitySection');
		quantitySection.style.display = isQuantityRequired ? 'flex' : 'none';
		$(".order-summary").css("display", "flex");
	});

	$("#cancel-btn").on("click", function() {
		divArea.remove();
		enableScroll();
	});
}


function changeQty(delta) {
	const quantityInput = document.getElementById('quantity');
	const currentValue = parseInt(quantityInput.value);
	const max = parseInt(quantityInput.max);
	const min = 1;

	let newValue = currentValue + delta;

	if (newValue < min) {
		newValue = min;
	}

	if (newValue > max) {
		newValue = max;
		getErrorModal("최초 주문수량을 넘길 수 없습니다")
	}

	quantityInput.value = newValue;
}



function formatDateForDB(date, type) {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return type === 'start' ? `${year}-${month}-${day} 00:00:00` : `${year}-${month}-${day} 23:59:59`;
}



function setButtonStyles(clickedButton) {
	$('.head-button-area button').removeClass('custom-clicked-btn').addClass('custom-btn');
	$(clickedButton).removeClass('custom-btn').addClass('custom-clicked-btn');
}

$('.order-list').on('click','.flex-center.between',  function() {
	const orderNum = $(this).find('input[type="radio"]').val();
	toggleOrderDetails(orderNum);
});

function toggleOrderDetails(orderNum) {
	resetSelections(orderNum);

	let orderItem = document.getElementById(`${orderNum}`);
	let radioInput = document.querySelector(`input[name='order'][value='${orderNum}']`);
	let detailsElement = document.getElementById(`order-details-${orderNum}`);
	let arrow = document.getElementById(`order-arrow-${orderNum}`);

	// 현재 상태 확인
	const isCurrentlyOpen = !detailsElement.classList.contains('off');

	if (isCurrentlyOpen) {
		// 현재 열려 있으면 닫기
		detailsElement.classList.add('off');
		orderItem.classList.remove('on');
		arrow.classList.remove('icon-arrow-on');
		arrow.classList.add('icon-arrow-off');

		if (radioInput && radioInput.checked) {
			radioInput.checked = false;
		}
	} else {
		// 현재 닫혀 있으면 열기
		detailsElement.classList.remove('off');
		orderItem.classList.add('on');
		arrow.classList.add('icon-arrow-on');
		arrow.classList.remove('icon-arrow-off');

		if (radioInput && !radioInput.checked) {
			radioInput.checked = true;
		}
	}
}

function handleRadioClick(orderNum) {
	let radioInput = document.querySelector(`input[name='order'][value='${orderNum}']`);
	let arrowIcon = document.querySelector(`#order-arrow-${orderNum}`);
	let allVisibleDetailsElements = Array.from(document.querySelectorAll('.order-details')).filter(el => {
		return !el.classList.contains('off')
	});

	let allOrderItems = document.querySelectorAll('.order-item');
	allOrderItems.forEach(el => {
		el.classList.remove('on');
	});

	allVisibleDetailsElements.forEach((el) => {
		el.classList.add('off')
	});

	if (radioInput) {
		radioInput.checked = true;
		$('input[type=checkbox]').prop('checked', false);
		let allArrows = document.querySelectorAll('.icon-arrow-on');
		allArrows.forEach((arrow) => {
			arrow.classList.remove('icon-arrow-on');
			arrow.classList.add('icon-arrow-off');
		});

	}

	if (arrowIcon) {
		toggleOrderDetails(orderNum);
	}
}

function resetSelections(excludeOrderNum) {
	$('input[name="order"]').each(function() {
		if (this.value != excludeOrderNum) {
			$(this).prop('checked', false);
		}
	});

	$('.icon-arrow-on').each(function() {
		const arrowId = $(this).attr('id');
		if (arrowId !== `order-arrow-${excludeOrderNum}`) {
			$(this).addClass('icon-arrow-off').removeClass('icon-arrow-on');
		}
	});
}

function handleCheckboxClick(orderNum, currentCheckbox) {
	const checkboxes = document.querySelectorAll(`input.check-box[data-order-num='${orderNum}']`);
	checkboxes.forEach(checkbox => {
		if (checkbox !== currentCheckbox) {
			checkbox.checked = false;
		}
	});

}


function toggleInquiryProduct() {
	const inquiryTypeSelect = document.getElementById('inquiryTypeSelect');
	const isTypeSelected = !!inquiryTypeSelect.value;

	const fields = ['inquiryTitle', 'inquiryContent', 'inquiryEmail'].map(id => document.getElementById(id));
	const sections = ['inquiryProduct', 'inquiryProductQty'].map(id => document.getElementById(id));

	if(inquiryTypeSelect.value !== '01' && inquiryTypeSelect.value !== '07') {
		$("#inquiryProduct").addClass("important");
	} else {
		$("#inquiryProduct").removeClass("important");
	}

	fields.forEach(field => {
		field.readOnly = !isTypeSelected;
		field.style.pointerEvents = isTypeSelected ? 'auto' : 'none';
		field.style.backgroundColor = isTypeSelected ? '' : '#EBECF0';

		if (!isTypeSelected) {
			field.value = '';
		}
	});

	sections.forEach(section => section.style.display = isTypeSelected ? 'block' : 'none');

	const imageUpload = document.getElementById('image-upload');
	const preview = document.getElementById('preview');
	imageUpload.disabled = !isTypeSelected;

	if (!isTypeSelected) {
		imageUpload.value = '';
		preview.src = '';
		preview.style.display = 'none';
	}

}

function previewImage(event) {
	const file = event.target.files[0];

	if (file) {
		const reader = new FileReader();

		reader.onload = function(e) {
			const preview = document.getElementById('preview');
			preview.src = e.target.result;
			preview.style.display = 'block';
		};

		reader.readAsDataURL(file);
	}
}

function formatDate(timestamp) {
	let date = new Date(timestamp);
	let year = date.getFullYear();
	let month = (date.getMonth() + 1).toString().padStart(2, '0');
	let day = date.getDate().toString().padStart(2, '0');
	return `${year}.${month}.${day}`;
}