$(document).ready(function() {
	$("#selected-all").on("change", function() {
		$(".check-box").prop("checked", $(this).prop("checked"));
	});
	
	$(".check-box").on("change", function() {
	    calculateTotalAmount();
		selectedCountChange();
	});
	
	$("#info-change-btn").on("click", function() {
		initRefundModal();
		$(".info-change-modal").css({ "display": "block" });
	});
	
	$(".close-btn-area").on("click", function() {
		initRefundModal();
		$(".info-change-modal").css({ "display": "none" });
	});
	
	commonEntranceShow();
});

function countValidation(obj) {
	const cnt = parseInt($(obj).val());
	const maxQty = Math.max(parseInt($(obj).attr("data-max-qty")), 0);
	
	if(maxQty < cnt) {
		$(obj).val(maxQty);
	} 
	
	const isChecked = $(obj).closest(".cancel-book-detail").find(".checked").prop("checked");
	
	if(isChecked) {
		calculateTotalAmount();
	}
}

function calculateTotalAmount() {
    let totalAmount = 0;

    $(".cancel-book-detail").each(function() {
		const isChecked = $(this).find(".checked").prop("checked");
		
		if(isChecked) {
			const quantity = parseInt($(this).find(".input-count input").val()) || 0;
			const price = parseInt($(this).find(".book-price").attr("data-detail-price"));
			
   			totalAmount += quantity * price;
		}
    });

	$("#refund-price").text(numberFormatter(totalAmount));
}

function numberFormatter(number) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return formatter.format(number) + "원";
}

function selectedCountChange() {
	const selectedCount = $(".cancel-book-detail").find("input[type='checkbox']:checked").length;
	
	$("#selected-count").text(`(${selectedCount})`);
}

function initRefundModal() {
	const name = $("input[name='retrieve_name']").val();
	const phoneNo = $("input[name='retrieve_phoneNo']").val();
	const addr = $("input[name='retrieve_addr']").val();
	const addrDetail = $("input[name='retrieve_addr_detail']").val();
	const commonEntPw = $("input[name='common_ent_pw']").val();
	
	$("#modal-user-name").val(name);
	$("#modal-user-phoneNo").val(phoneNo);
	$("#modal-user-addr").val(addr);
	$("#modal-user-addr-detail").val(addrDetail);
	
	if(commonEntPw && commonEntPw != "자유출입") {
		$("#modal-user-common-entrance-pw").css({ "display": "block" });
		$("#common-entrance-on").prop("checked", true);
		$("#modal-user-common-entrance-pw").val(commonEntPw);
	} else {
		$("#modal-user-common-entrance-pw").css({ "display": "none" });
		$("#common-entrance-off").prop("checked", true);
		$("#modal-user-common-entrance-pw").val("");
	}
}

function commonEntranceShow() {
	$("#common-entrance-on").on("change", function() {
		const isChecked = $(this).prop("checked");
		
		if(isChecked) {
			$("#modal-user-common-entrance-pw").css({ "display": "block" });
			$("#modal-user-common-entrance-pw").val($("input[name='common_ent_pw']").val());
		}
	});
	
	$("#common-entrance-off").on("change", function() {
		const isChecked = $(this).prop("checked");
		
		if(isChecked) {
			$("#modal-user-common-entrance-pw").css({ "display": "none" });
			$("#modal-user-common-entrance-pw").val("");
		}
	});
}

function infoChangeBtn() {
	const name = $("#modal-user-name").val();
	const phoneNo = $("#modal-user-phoneNo").val();
	const addr = $("#modal-user-addr").val();
	const addrDetail = $("#modal-user-addr-detail").val();
	const commonEntPw = $("#modal-user-common-entrance-pw").val();
	
	if(!name) {
		$("#warning-message").text("⚠️ 이름을 입력하세요");
		$("#warning-message").addClass("warning-message");
		return;
	} else if(!phoneNo) {
		$("#warning-message").text("⚠️ 전화번호를 입력하세요");
		$("#warning-message").addClass("warning-message");
		return;
	} else if(!addr) {
		$("#warning-message").text("⚠️ 주소를 입력하세요");
		$("#warning-message").addClass("warning-message");
		return;
	}
	
	$("input[name='retrieve_name']").val(name);
	$("input[name='retrieve_phoneNo']").val(phoneNo);
	$("input[name='retrieve_addr']").val(addr);
	$("input[name='retrieve_addr_detail']").val(addrDetail);
	
	$("#refund-name").text(name);
	$("#refund-phoneNo").text(phoneNo);
	$("#refund-addr").text(`${addr} ${addrDetail}`);
	
	if(commonEntPw) {
		$("input[name='common_ent_pw']").val(commonEntPw);
		$("#refund-commonent-pw").text(commonEntPw);
	} else {
		$("input[name='common_ent_pw']").val("자유출입");
		$("#refund-commonent-pw").text("자유출입");
	}
	
	$("#warning-message").text("");
	$("#warning-message").removeClass("warning-message");
	
	$(".info-change-modal").css({ "display": "none" });
}

function phoneNoCheck(obj) {
	let phoneNo = $(obj).val();
	
	phoneNo = phoneNo.replace(/[^0-9]/g, '');
	
	if (phoneNo.length > 11) {
        phoneNo = phoneNo.substring(0, 11);
    }
		
	if (phoneNo.length === 11) {
	    phoneNo = phoneNo.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
	}
	
	$(obj).val(phoneNo);
}

function addrSearchBtn() {
	const addrInputBox = $("#modal-user-addr");
	const addrDetailInputBox = $("#modal-user-addr-detail");
	
    new daum.Postcode({
        oncomplete: function(data) {
            $(addrInputBox).val(data.address);
			
			addrDetailInputBox.focus();
        }
    }).open();
}

function orderCancelBtn() {
	const list = [];
	 
	$(".cancel-book-detail").each(function() {
		if($(this).find(".checked").prop("checked")) {
			const qty = $(this).find("input[name='order_request_qty']").val();
			const name = $(this).find("input[name='order_detail_num']").val();
			
			if(qty > 0) {
				list.push({
					"order_detail_num": name,
					"order_request_qty": qty
				});
			} 
		}
	});
	
	const data = {
		"list": list,
		"dto": {
			"order_num": $("input[name='order_num']").val(),
			"retrieve_name": $("input[name='retrieve_name']").val(),
			"retrieve_phoneNo": $("input[name='retrieve_phoneNo']").val(),
			"retrieve_addr": $("input[name='retrieve_addr']").val(),
			"retrieve_addr_detail": $("input[name='retrieve_addr_detail']").val(),
			"common_ent_pw": $("input[name='common_ent_pw']").val()
		}		
	};
	
	if(list.length <= 0) {
		getCheckModal("1개 이상의 반품할 상품을 선택해 주세요.");
	} else {
		$.ajax({
			url: "/user/mypage/returnRequest",
			method: "POST",
			data: JSON.stringify(data),
			contentType: "application/json",
			success: function(response) {
				if(response === list.length) {
					getCheckModal("<span class='modal-font-bold'>반품신청 완료</span><span class='modal-font-size'>상품 회수 후 반품이 완료 되며 완료 후<br> 환불이 진행 됩니다.</span>");
					$("#confirm-delete").on("click", function() {
						location.href = `/user/mypage/returnDetail?orderNum=${data.dto.order_num}`;
					});
				} else {
					getCheckModal("다시 시도해 주세요.");
				}
			},
			error: function() {
				getErrorModal("ERROR");
			}
		});
	}
	
}