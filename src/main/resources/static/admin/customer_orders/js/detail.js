$(document).ready(function() {
	checkboxHandler();
});

$("button").on("click", function(event) {
    event.preventDefault();
});

function checkboxHandler() {
    $("#select-all").on("change", function() {
        $(".row-checkbox").prop("checked", $(this).prop("checked"));
	});
}

function requestCompletionBtn() {
	$("input[name='order_selected_status']").val($("#request-select-area").val());

	const selectedRows = $("#table-form .row-checkbox:checked").closest('.table-data-area');
	
	const form = $("#submit-form");
	
	let check = true;
	selectedRows.each(function() {
        let qty = $(this).find("input[name='input_qty']").val();
		if(!qty || qty <= 0) {
			check = false;
		}
	});
	
	selectedRows.find("input").each(function() {
	    $(this).each(function() {
			form.append($(this).clone());
		})
	});
	
	if(!check) {
		getCheckModal('처리수량을 입력해 주세요');
		return;
	} else if(selectedRows.length > 0) {
		getConfirmModal('주문 상태를 변경하시겠습니까?', function() {
			$.ajax({
				url: "/admin/customerOrdersRest/orderStatusUpdate",
				type: "POST",
				data: $('#submit-form').serialize(),
				success: function(response) {
					location.href = response;
			  	},
			  	error: function() {
					getCheckModal("재고를 확인해 주세요.");
			  	}
			});
		});
	} else {
		getCheckModal("1개 이상의 선택이 필요합니다.");
	}
}

function inputNumberMax(obj) {
	const maxNum = parseInt($(obj).attr("data-detail_qty"));
	const inputNum = parseInt($(obj).val());
	
	if(inputNum > maxNum) {
		obj.value = maxNum;
	} 
}
	

function truncate() {
	const elements = document.querySelectorAll(".book-title-data > span");

	elements.forEach(element => {
		let text = element.innerText;

		if (text.length > 14) {
			element.innerText = text.slice(0, 14) + '...';
		}
	})
}
truncate();
