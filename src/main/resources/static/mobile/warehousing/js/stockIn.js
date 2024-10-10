$(document).ready(function () {

    const zoneNum = document.getElementById("zoneNum").value;

    $('#stockIn').on('click', function () {
        getConfirmModal("상품을 입고하시겠습니까?", function () {
            let orderDetails = [];
            let orderNum = $('#search-input').val().trim();

            if (!orderNum) {
                getCheckModal('발주번호를 입력하세요.', $('#search-input'));
                return;
            }

            $('#dispatch-list .content-dispatch-list').each(function () {
                let contentWrap = $(this).find('.content-text-wrap');

                let isbn = contentWrap.attr('data-isbn');
                let title = contentWrap.attr('data-title');
                let qtyInput = $(this).find('.input-qty').val();
                let orderDetailNum = contentWrap.attr('data-detail');

                if (qtyInput && qtyInput > 0) {
                    orderDetails.push({
                        order_detail_isbn: isbn,
                        order_detail_title: title,
                        order_detail_qty: parseInt(qtyInput, 10),
                        order_detail_num: orderDetailNum
                    });
                }
            });

            if (orderDetails.length === 0) {
                getCheckModal('입력된 수량이 없습니다.');
                return;
            }

            let requestData = {
                order_num: orderNum,
                zone_num: zoneNum,
                order_details: orderDetails
            };

            $.ajax({
                type: "POST",
                url: "/mobile/admin/process-inventory",
                data: JSON.stringify(requestData),
                contentType: "application/json",
                success: function (response) {
                    if (response.status === 'success') {
                        getCheckModal('입고 처리가 완료되었습니다.');
						$("#confirm-delete").on("click", function() {
	                        location.reload();
						});
                    } else {
                        getErrorModal();
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    getErrorModal();
                    return;
                }
            });
        });
    });

    $('#search-input').on('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });

    $('#search-btn').on('click', function () {
        let orderNum = $('#search-input').val().trim();

        if (!orderNum) {
            getCheckModal('발주번호를 입력하세요.', $('#search-input'));
            return;
        }

        fetchOrderDetails(parseInt(orderNum));
    });

    $('#search-input').on('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#search-btn').click();
        }
    });

    function fetchOrderDetails(orderNum) {
        $.ajax({
            type: "POST",
            url: "/mobile/admin/get-orderDetails",
            data: {orderNum: orderNum},
            success: function (response) {

                if (response.status === 'success') {
                    const dataList = response.data;
                    updateWarehouseList(dataList);
                } else {
                    getErrorModal();
                    return;
                }
            },
            error: function (xhr, status, error) {
                getCheckModal('발주번호를 확인하세요.', $('#search-input'));
                return;
            },
            beforeSend: function () {
                $('#dispatch-list').html('<p>로딩 중...</p>');
            }
        });
    }

    function updateWarehouseList(dataList) {
        $('#dispatch-list').empty();

        dataList.forEach(function (item) {
            let truncatedTitle = item.order_detail_title.length > 20 ? item.order_detail_title.substring(0, 12) + "..." : item.order_detail_title;
            let orderDate = new Date(item.order_date);
            let formattedDate = orderDate.getFullYear() + '-' +
                ('0' + (orderDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + orderDate.getDate()).slice(-2);

            let remainingQty = item.order_detail_qty - item.order_detail_received_qty;
            let isDisabled = remainingQty <= 0 ? 'disabled' : '';
            let maxQty = remainingQty > 0 ? remainingQty : 0;

            const listItem = `
			<div class="content-dispatch-list">
                <div class="content-text-wrap"
					data-isbn="${item.order_detail_isbn}"
					data-title="${item.order_detail_title}"
					data-detail="${item.order_detail_num}">
					
                    <p class="content-text"><span>${truncatedTitle}</span></p>
                    <p class="content-text">ISBN: <span>${item.order_detail_isbn}</span></p>
                    <p class="content-sub-txt">등록날짜: <span>${formattedDate}</span></p>
                </div>
					<div class="input-qty-container">
					    <input type="number" class="input-qty" value="${maxQty}" max="${maxQty}" ${isDisabled} placeholder="수량">
					</div>
            </div>
            `;
            $('#dispatch-list').append(listItem);
        });

        $('.input-qty').on('input', function () {

            let maxVal = parseInt($(this).attr('max'), 10);
            let currentVal = parseInt($(this).val(), 10);


            if (currentVal > maxVal) {
                $(this).val(maxVal);
            }
        });

    }
});