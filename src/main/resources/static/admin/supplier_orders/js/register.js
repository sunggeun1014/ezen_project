let addOrderInfoList = []; 
 
$(document).ready(function() {
	$(".form-btn").on("click", e => {
		e.preventDefault();	
	});
});

function resetBtn() {
	document.getElementById("supplier-form").reset();
}

function orderAddBtn() {
	const isbn = $("#order_detail_isbn");
	const title = $("#order_detail_title");
	const publisher = $("#order_detail_publisher");
	const price = $("#order_detail_price");
	const qty = $("#order_detail_qty");
	
	if(!isbn.val() || isbn.val().length != 13) {
		if(isbn.val().length != 13) {
			getCheckModal('13자리의 숫자를 입력해 주세요', isbn);
			return;
		}
		getCheckModal('ISBN을 입력해 주세요.', isbn);
	}else if(!title.val()){
		getCheckModal('책제목을 입력해 주세요.', title);
	}else if(!publisher.val()){
		getCheckModal('출판사를 입력해 주세요.', publisher);
	}else if(!price.val()){
		getCheckModal('단가를 입력해 주세요.', price);
	}else if(!qty.val()) {
		getCheckModal('수량을 입력해 주세요.', qty);
	}else {
		addOrderInfoList.push({
			"isbn": isbn.val(),
			"title": title.val(),
			"publisher": publisher.val(),
			"price": price.val(),
			"qty": qty.val(),
			"total_price": price.val() * qty.val(),
			"sum": price.val() * qty.val()
		});
		
		orderListDraw();
	}
	
}

function orderListDraw() {
	const sum = Array.from(addOrderInfoList).reduce((total, data) => total + parseInt(data["sum"]), 0);
	
	$("#select-all").prop("checked", false);
	$(".row-data-area").remove();
	$("#list-count").text(`총 ${addOrderInfoList.length}건`);
	$("#total-purchase-amount").text(`총 구매금액: ${numberFormatter(sum)}`);
	
	addOrderInfoList.forEach((data, index, array) => {
		let row = $("<div class='row-data-area'></div>");
		$("list-count");
		let item = $(`
			<div class="check-data">
				<span>
					<input type="checkbox" id="select-row" name="check" class="checkbox row-checkbox" value="${index}"><label for="select-row"></label>
				</span>
			</div>
			
			<div class="no-data">
				<span>${index + 1}</span>
			</div>
			
			<div class="book-title-data">
				<span>${data["title"]}</span>
			</div>
			
			<div class="isbn-data">
				<span>${data["isbn"]}</span>
			</div>
			
			<div class="price-data">
				<span>${numberFormatter(data["price"])}</span>
			</div>
			
			<div class="qty-data">
				<span>${data["qty"]}개</span>
			</div>
			
			<div class="total-price-data">
				<span>${numberFormatter(data["total_price"])}</span>
			</div>
		`);
		
		row.append(item);
		$("#order-register-list-form").append(row);	
	});
	
}

function qtyHandler(obj) {
	if($(obj).val() > 9999999) {
		$(obj).val(9999999);
	}
}

function numberFormatter(number) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal', // 또는 'currency'로 설정 가능
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return formatter.format(number) + "원";
}

function checkboxHandler() {
    $("#select-all").on("change", function() {
        $(".row-checkbox").prop("checked", $(this).prop("checked"));
	});
}

function orderDeleteBtn() {
	const checkedValues = $("#order-register-list-form input[name='check']:checked").map(function() {
		return parseInt($(this).val());
	});
	
	if(checkedValues.length != 0) {
		let temp = addOrderInfoList.filter((element, index) => {
			if(!Array.from(checkedValues).includes(index)) {
				return element;
			}
		});
		
		addOrderInfoList = temp; 
		orderListDraw();
	} else{
		getCheckModal("삭제할 항목을 선택해 주세요");
	}
}

function orderConfirmBtn() {
	getConfirmModal('발주 하시겠습니까?', function() {
		let formList = [];
		
		addOrderInfoList.forEach(data => {
			formList.push({
				"order_detail_isbn": data["isbn"],
				"order_detail_title": data["title"],
				"order_detail_publisher": data["publisher"],
				"order_detail_price": data["price"],
				"order_detail_qty": data["qty"]
			})
		});
		
		fetch('/admin/supplierOrdersRest/orderConfirm', {
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json'
		    },
		    body: JSON.stringify(formList)
		})
		.then(() => location.href='/admin/supplierOrders/list')
	});
	
}