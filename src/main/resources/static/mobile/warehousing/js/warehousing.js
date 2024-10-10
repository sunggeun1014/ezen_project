$(document).ready(function() {
    let defaultZoneValue = 'A-01';
    $('#zone-num-display').text(defaultZoneValue);
    $('#A-01').addClass('selected');

    function updateInventoryList(dataList) {
        $('#dispatch-list').empty();
        
        dataList.forEach(function(item) {
            let truncatedTitle = item.inv_title.length > 15 ? item.inv_title.substring(0, 12) + "..." : item.inv_title;

            const listItem = `
                <div class="content-dispatch-list">
                    <div class="content-text-wrap">
                        <p class="content-text"><span>${truncatedTitle}</span></p>
                        <p class="content-text">ISBN: <span>${item.inv_isbn}</span></p>
                        <p class="content-sub-txt">등록날짜: <span>${item.inv_registration_date}</span></p>
                    </div>
                    <div class="inventoryQty">
                        <p class="content-text">재고수량: <span>${item.inv_qty}개</span></p>
                    </div>
                </div>
            `;
            $('#dispatch-list').append(listItem);
        });
    }

    function fetchInventory(zoneValue) {
        $.ajax({
            type: "POST",
            url: "/mobile/admin/get-inventoryList",
            data: { zoneNum: zoneValue },
            success: function(response) {

                if (response.status === 'success') {
                    const dataList = response.data;
                    updateInventoryList(dataList);
                } else {
                    alert('데이터를 불러오는 데 실패했습니다.');
                }
            },
            error: function(xhr, status, error) {
                alert('서버와의 통신 중 오류가 발생했습니다.');
            },
            beforeSend: function() {
                $('#dispatch-list').html('<p>로딩 중...</p>');
            }
        });
    }

    fetchInventory(defaultZoneValue);

    $('.cnt').on('click', function() {
        let zoneValue = $(this).attr('value');

        $('.cnt').removeClass('selected');
        $(this).addClass('selected');
        $('#zone-num-display').text(zoneValue);

        fetchInventory(zoneValue);
    });
	
	$('#export-btn').on('click', function() {
		
        let selectedItem = $('.cnt.selected').attr('value');
        
        if (!selectedItem) {
            alert('입고할 구역을 선택하세요.');
            return;
        }

        location.href = '/mobile/admin/stockIn?zoneNum=' + selectedItem;
    });
});
