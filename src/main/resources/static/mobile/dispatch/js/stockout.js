$(document).ready(function () {


    $('#stockIn').on('click', function () {
        getConfirmModal("상품을 출고하시겠습니까?", function () {
            let requestDetails = [];
            let requestNum = $('#search-input').val().trim();

            if (!requestNum) {
                getCheckModal('요청번호를 입력하세요.', $('#search-input'));
                return;
            }

            $('#dispatch-list .content-dispatch-list').each(function () {
                let contentWrap = $(this).find('.content-text-wrap');

                let isbn = contentWrap.attr('data-isbn');
                let title = contentWrap.attr('data-title');
                let qtyInput = contentWrap.attr('data-qty');
                requestDetails.push({
                    book_isbn: isbn,
                    book_name: title,
                    total_order_quantity: qtyInput,
                    request_num: requestNum
                });
            });


            let requestData = {
                request_details: requestDetails
            };

            console.log(requestData);

            $.ajax({
                type: "POST",
                url: "/mobile/admin/stockout-inventory",
                data: JSON.stringify(requestData),
                contentType: "application/json",
                success: function (response) {
                    if (response.status === 'success') {
                        getCheckModal('출고 처리가 완료되었습니다.');
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
        let requestNum = $('#search-input').val().trim();

        if (!requestNum) {
            getCheckModal('요청번호를 입력하세요.', $('#search-input'));
            return;
        }

        fetchOrderDetails(parseInt(requestNum));
    });

    $('#search-input').on('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#search-btn').click();
        }
    });

    function fetchOrderDetails(requestNum) {
        $.ajax({
            type: "POST",
            url: "/mobile/admin/get-requestDetails",
            data: {requestNum: requestNum},
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
                getCheckModal('요청번호를 확인하세요.', $('#search-input'));
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
            let truncatedTitle = item.book_name.length > 20 ? item.book_name.substring(0, 12) + "..." : item.book_name;
            let requestDate = new Date(item.book_request_date);
            let formattedDate = requestDate.getFullYear() + '-' +
                ('0' + (requestDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + requestDate.getDate()).slice(-2);

            let remainingQty = item.total_order_quantity;
            let isDisabled = remainingQty <= 0 ? 'disabled' : '';

            const listItem = `
	            <div class="content-dispatch-list">
	                <div class="content-text-wrap"
	                    data-isbn="${item.book_isbn}"
	                    data-title="${item.book_name}"
	                    data-qty ="${item.total_order_quantity}"
	                    data-detail="${item.order_detail_num}">
	                    
	                    <p class="content-text"><span>${truncatedTitle}</span></p>
	                    <p class="content-text">ISBN: <span>${item.book_isbn}</span></p>
	                    <p class="content-sub-txt">등록날짜: <span>${formattedDate}</span></p>
	                </div>
	                    <div class="input-qty-container">
							<input type="number" class="input-qty" value="${item.total_order_quantity}" disabled placeholder="수량">
	                    </div>
	            </div>
	        `;
            $('#dispatch-list').append(listItem);
        });


    }

});
