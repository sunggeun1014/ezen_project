$(document).ready(function() {
	conditionBtnStyle();
	Research();
	
	$(".condition-click").each(function() {
	    $(this).on("click", function() {
	        const radioId = $(this).attr("data-radio-id");
	        $(`#${radioId}`).prop("checked", true);
	    });
	});
	
	$(".search-field-click").each(function() {
	    $(this).on("click", function() {
	        const radioId = $(this).attr("data-radio-id");
	        $(`#${radioId}`).prop("checked", !$(`#${radioId}`).prop("checked"));
			
			$("#search-form").submit();
	    });
	});
	
	$(".btn-default").on("click", function(e) {
		e.preventDefault();
	});
});

function Research() {
	$("#word").on("keydown", function(e) {
		if(e.key === 'Enter') {
			$("#search-form").submit();
		}
	});
}

function conditionBtnStyle() {
	$(".order-area > span").on("click", function() {
		const obj = $("input[name='orderByValue']");
		let num = $(this).attr("data-value");
		
		if ($(this).hasClass("order-by-click")) {
			$(obj).val("");
			$(".order-area > span").removeClass("order-by-click");
		} else {
			$(obj).val(num);
			$(".order-area > span").removeClass("order-by-click");
			$(this).addClass("order-by-click");
		}
		
		$("#search-form").submit();
	});
		
	$(".condition-click").on("click", function() {
		$(".condition-click").removeClass("on");
		$(this).addClass("on");
	});
	
	$(".search-field-click").on("click", function() {
		$(".search-field-click").removeClass("on");
		$(this).addClass("on");
	});
	
	$(".date-click").on("click", function() {
		$(".date-click").removeClass("on");
		$(this).addClass("on");
		$("input[name='selectedDateCd']").val($(this).attr("data-selected-date-btn"));		
		
		$("#search-form").submit();
	});
}
function basket(obj) {
	const isbn = $(obj).attr("data-value");
	
	basketProcess([{
		"book_isbn": isbn,
		"cart_purchase_qty": 1
	}]);
}

function basketList() {
	const obj = $("#product-list-form input[type='checkbox']:checked");
		
	const checkedIsbnList = [];
	
	obj.map(function() {
	    checkedIsbnList.push({
			"book_isbn": $(this).val(),
			"cart_purchase_qty": 1
		});
	});
		
	basketProcess(checkedIsbnList);
}

function basketProcess(data) {
	const loginId = $("#member-login-user-id").val();

	if(!loginId) {
		getConfirmModal("로그인하지 않으셨습니다.", "로그인 페이지로 이동하시겠습니까?", function() {
			location.href = "/user/login";
		});
		
		return;
	}
		
	if(data.length > 0) {
		$.ajax({
			url: "/user/productsRest/productBasketSaveMulti",
			method: "POST",
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(response) {
				$(".cart-qty p").text(response);
				getCheckModal(`장바구니에 상품이 추가되었습니다.`);
			},
			error: function() {
				getErrorModal("ERROR");
		  	}
		});
	} else {
		getCheckModal("장바구니에 담으려면 최소 1개의 상품을 선택해 주세요.");	
	}
}

function buyNowBtn(obj) {
	const row = $(obj).closest(".product-list-area");
	
	const orderData = [{
            book_isbn: $(row).find("#check-btn").val(),
            cart_purchase_qty: 1,
            book_price: $(row).find("#book_price").val(),
            book_name: $(row).find("#book_name").val(),
            book_thumbnail_changed: $(row).find("#book_thumbnail_changed").val()
        }];
		
    $.ajax({
        url: '/user/productsRest/instantBuy',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function () {
            location.href = '/user/order';
        },
        error: function () {
            getErrorModal("ERROR");
        }
    });
} 