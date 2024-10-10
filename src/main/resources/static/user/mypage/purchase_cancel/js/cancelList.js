function orderCancelBtn() {
	const list = $(".cancel-book-detail").map(function(index, obj) {
		return {
			"order_num": $(obj).find("input[name='order_num']").val(),
			"order_detail_num": $(obj).find("input[name='order_detail_num']").val(),
			"order_detail_qty": $(obj).find("input[name='order_detail_qty']").val()
		}
	});
	
	$.ajax({
		url: "/user/mypage/orderCancel",
		method: "PUT",
		data: JSON.stringify(Array.from(list)),
		contentType: "application/json",
		success: function(response) {
			if(response > 0) {
				getCheckModal("<span>취소가 완료 되었습니다.</span><br> 결제 취소는 카드사에 따라<br> 3일~2주 이내에 완료 됩니다.");
				
				$("#confirm-delete").on("click", function() {
					location.href = `/user/mypage/cancelCompletion?orderNum=${list[0].order_num}`;
				});
			} else {
				getCheckModal("고객센터에 문의 바랍니다.");
			}
			
		},
		error: function() {
			getErrorModal("다시 시도해 주세요.");
		}
	});
	
	 
}