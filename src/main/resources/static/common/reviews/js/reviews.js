$(document).ready(function() {

    var table = $('#example').DataTable({
		
        columnDefs: [
            { targets: 0, orderable: false } // 첫 번째 컬럼(체크박스 컬럼)에서 정렬 비활성화
        ],
        order: [], 
        ajax: {
            url: '/reviews',
            dataSrc: 'data'
        },
        columns: [
            {
                data: null,
                render: function(data, type, row) {
                    return '<input type="checkbox" class="row-checkbox">';
                },
                orderable: false,
            },
            { data: 'review_num' },
            { data: 'review_content' },
            { 
                data: 'book_name',
                render: function(data, type, row) {
                    return '<a href="#" class="book-title-link" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
                }
            },
            { data: 'book_isbn' },
            { data: 'member_id' },
            {
                data: 'review_write_date',
                render: function(data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        var date = new Date(data);
                        var formattedDate = date.toISOString().split('T')[0];
                        var formattedTime = date.toTimeString().split(' ')[0].substring(0, 5);
                        return formattedDate + ' ' + formattedTime;
                    }
                    return data; // Keep the original format for sorting purposes
                }
            },
            {
                data: 'review_rating',
                render: function(data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        var fullStars = '★'.repeat(data);
                        var emptyStars = '☆'.repeat(5 - data);
                        return '<span class="stars">' + fullStars + emptyStars + '</span>';
                    }
                    return data; // Keep the original format for sorting purposes
                }
            }
        ],
		
        "info": false,
        lengthChange: false,
        dom: 'lrtip',
        rowCallback: function(row, data) {
            $(row).attr('data-id', data.review_num); // 각 행에 고유 ID 설정

            // 제목 컬럼의 링크 클릭 이벤트 추가
            $(row).find('.book-title-link').on('click', function(event) {
                event.preventDefault(); // 링크 기본 동작 방지
                postToDetailPage(data); // 폼 생성 및 제출 함수 호출
            });
        }
    });

    $('#select-all').on('click', function() {
        var rows = table.rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    $('#example tbody').on('change', '.row-checkbox', function() {
        if (!this.checked) {
            $('#select-all').prop('checked', false);
        } else {
            if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
                $('#select-all').prop('checked', true);
            }
        }
    });

    // 모달 관련 변수
    var modal = document.getElementById("myModal");
    var confirmDeleteButton = document.getElementById("confirm-delete");
    var cancelDeleteButton = document.getElementById("cancel-delete");

    // 삭제 버튼 클릭 이벤트 핸들러
    $('#delete-button').on('click', function() {
        var selectedIds = [];
        $('#example').DataTable().$('.row-checkbox:checked').each(function() {
            var rowData = $('#example').DataTable().row($(this).closest('tr')).data();
            selectedIds.push(rowData.review_num); // 삭제할 리뷰 번호 수집
        });

        if (selectedIds.length > 0) {
            modal.style.display = "block"; // 모달 표시
            // 메시지를 기본 메시지로 리셋
            document.querySelector('#myModal .modal-content p').textContent = '정말로 삭제하시겠습니까?';
        } else {
            // alert 대신 모달 메시지 변경
            document.querySelector('#myModal .modal-content p').textContent = '삭제할 항목을 선택하세요.';
            modal.style.display = "block";
        }
    });

    // 모달 외부 클릭 시 닫기
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // 삭제 확인 버튼
    confirmDeleteButton.onclick = function() {
        $.ajax({
            url: '/reviews/delete',  // 서버의 삭제 처리 URL
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(selectedIds),  // 선택된 리뷰 번호들을 JSON으로 전송
            success: function(response) {
                // alert 대신 모달 메시지 변경
                document.querySelector('#myModal .modal-content p').textContent = '삭제가 완료되었습니다.';
                $('#example').DataTable().ajax.reload();  // 테이블 새로고침
            },
            error: function(error) {
                // alert 대신 모달 메시지 변경
                document.querySelector('#myModal .modal-content p').textContent = '삭제 중 오류가 발생했습니다.';
            }
        });
    };

    // 삭제 취소 버튼
    cancelDeleteButton.onclick = function() {
        modal.style.display = "none";
    };

});

function postToDetailPage(data) {
    // 폼 생성
    var form = $('<form>', {
        method: 'POST',
        action: '/reviews/details'  // 서버의 상세 페이지 URL로 설정
    });

    // 데이터를 숨김 필드로 추가
    form.append($('<input>', { type: 'hidden', name: 'review_num', value: data.review_num }));
    form.append($('<input>', { type: 'hidden', name: 'review_content', value: data.review_content }));
    form.append($('<input>', { type: 'hidden', name: 'book_name', value: data.book_name }));
    form.append($('<input>', { type: 'hidden', name: 'book_isbn', value: data.book_isbn }));
    form.append($('<input>', { type: 'hidden', name: 'member_id', value: data.member_id }));
    form.append($('<input>', { type: 'hidden', name: 'review_write_date', value: data.review_write_date }));
    form.append($('<input>', { type: 'hidden', name: 'review_rating', value: data.review_rating }));

    // 폼을 body에 추가하고 제출
    form.appendTo('body').submit();
}

function setToday() {
    var today = new Date().toISOString().split('T')[0];
    $('#startDate').val(today);
    $('#endDate').val(today).trigger('change');
}

function setDateRange(days) {
    var startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    $('#startDate').val(startDate.toISOString().split('T')[0]);
    $('#endDate').val(new Date().toISOString().split('T')[0]).trigger('change');
}

function resetFilters() {
    $('#searchKeyword').val('');
    $('#startDate').val('');
    $('#endDate').val('').trigger('change');
}
