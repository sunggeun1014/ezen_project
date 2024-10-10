var table;
$(document).ready(function() {
    // 테이블이 이미 초기화되어 있는지 확인
    if (!$.fn.DataTable.isDataTable('#product')) {
        table = $('#product').removeAttr('width').DataTable({
            autoWidth: false,
            columnDefs:
                [
                    { targets: 0, orderable: false }, // 첫 번째 컬럼(체크박스 컬럼)에서 정렬 비활성화
                    // 가운데정렬
                    {
                        className: 'table-center',
                        targets: '_all'
                    },
                    {
                        width: '40px',
                        targets: 0
                    },
                ],
            order: [[8, 'desc']],
            ajax: {
                dataSrc: 'data',
                url: '/admin/products/json',
                data: function (d) {
                    d.book_state = $('input[name="book_state"]:checked').val();
                }
            },
            columns: [
                {
                    data: null,
                    render: function(data, type, row) {
                        return '<input type="checkbox" id="data-check" class="row-checkbox"><label for="data-check"></label>';
                    },
                    orderable: false,
		        },
				{ 
					data: null,
					orderable: false
				},
                {
                    data: 'book_isbn',
                    render: function(data, type, row) {
                        const url = '/admin/products/detail?book_isbn=' + encodeURIComponent(data);
                        return '<a href=' + url + ' class="book-isbn-link" data-menu-link="products" data-isbn="' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: 'book_name',
                    className: 'text-ellipsis',
                    render: function(data) {
                        if (data.length > 10) {
                            return data.substring(0, 10) + '...';
                        } else {
                            return data;
                        }
                    }
                },
                {
                    data: 'book_country_type',
                    render: function(data) {
                        if (data === '01') {
                            return '국내';
                        } else if (data === '02') {
                            return '국외';
                        } else {
                            return ''; // 데이터가 '01' 또는 '02'가 아닐 경우 빈 문자열 반환
                        }
                    }
                },
                {
                    data: 'book_author',
                    className: 'text-ellipsis',
                    render: function(data) {
                        if (data.length > 3) {
                            return data.substring(0, 3) + '...'; // 5글자까지 표시하고 나머지는 '...'으로 대체
                        } else {
                            return data; // 5글자 이하일 경우 그대로 반환
                        }
                    }
                },
                {
                    data: 'book_publisher',
                    className: 'text-ellipsis',
                    render: function(data) {
                        if (data.length > 3) {
                            return data.substring(0, 3) + '...';
                        } else {
                            return data;
                        }
                    }
                },
                {
                    data: 'book_price',
                    render: function(data) {
                        if (data >= 1000) {
                            return data.toLocaleString(); // 1,000 이상의 숫자에 콤마 추가
                        } else {
                            return data.toString(); // 1,000 미만의 숫자는 그대로 반환
                        }
                    }
                },
                {
                    data: 'book_register_date',
                    render: function(data, type, row) {
                        if (!data) {
                            return '-'; // 데이터가 없을 경우 - 로 표시
                        }

                        if (type === 'display' || type === 'filter') {
                            var date = new Date(data);

                            // Date가 유효한 경우만 처리
                            if (!isNaN(date.getTime())) {
                                // 로컬 시간으로 변환
                                var year = date.getFullYear();
                                var month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1
                                var day = ('0' + date.getDate()).slice(-2);

                                // yyyy-mm-dd 형식으로 반환
                                var formattedDate = year + '-' + month + '-' + day;
                                return formattedDate;
                            } else {
                                return data; // 잘못된 날짜일 경우 원본 데이터 반환
                            }
                        }

                        return data; // 소팅을 위한 원본 형식 반환
                    }
                },
                {
                    data: 'book_state',
                    render: function(data, type, row) {
                        const productState = data === '01' ? '#4777f6' : '#666666';
                        const isSale = data === '01' ? '판매중' : '판매중지';
                        return '<p style="color: ' + productState + '">' + isSale + '</p>';
                    }
                }

            ],
            "info": false,
            lengthChange: false,
            dom: 'lrtip',
            language: {
                searchPanes: {
                    i18n: {
                        emptyMessage: "조회된 정보가 없습니다."
                    }
                },
                infoEmpty: "조회된 정보가 없습니다.",
                zeroRecords: "조회된 정보가 없습니다.",
                emptyTable: "조회된 정보가 없습니다.",
            },
			drawCallback: function(settings) {
			    let api = this.api();
			    let filteredRecords = api.rows({ search: 'applied' }).count();

			    $('#totalCount').text(`총 ${filteredRecords}건`);

			    api.column(1, { page: 'current' }).nodes().each(function(cell, i) {
			        let pageStart = api.settings()[0]._iDisplayStart;
			        $(cell).html(pageStart + i + 1);
			    });
			},
            rowCallback: function(row, data) {
                $(row).attr('data-id', data.book_isbn); // 각 행에 고유 ID 설정

                // 제목 컬럼의 링크 클릭 이벤트 추가
                // $(row).find('.book-isbn-link').on('click', function(event) {
                //     event.preventDefault(); // 링크 기본 동작 방지
                //     getToDetailPage(data); // 폼 생성 및 제출 함수 호출
                // });
            }
        });
    }


    // 체크박스
    $('#check-all').on('click', function() {
        const rows = $('#product').DataTable().rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    // 개별 체크박스 선택 시 배경색 변경
    $('#product tbody').on('change', '.row-checkbox', function() {
        const $row = $(this).closest('tr'); // 체크박스가 있는 행을 선택

        if (this.checked) {
            $row.addClass('selected-row'); // 배경색을 변경할 클래스 추가
        } else {
            $row.removeClass('selected-row'); // 배경색을 변경할 클래스 제거
        }

        // 전체 체크박스와 개별 체크박스의 선택 상태를 비교하여 '전체 선택' 체크박스 상태를 업데이트
        if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
            $('#check-all').prop('checked', true);
        } else {
            $('#check-all').prop('checked', false);
        }
    });

    // '전체 선택' 체크박스의 상태 변경 시
    $('#check-all').on('change', function() {
        const isChecked = $(this).prop('checked'); // '전체 선택' 체크박스의 상태

        // 모든 개별 체크박스를 '전체 선택'의 상태에 맞춰 변경
        $('.row-checkbox').prop('checked', isChecked);

        // 각 행에 대해 배경색을 업데이트
        if (isChecked) {
            $('#product tbody tr').addClass('selected-row'); // 모든 행에 배경색 클래스 추가
        } else {
            $('#product tbody tr').removeClass('selected-row'); // 모든 행에서 배경색 클래스 제거
        }
    });

    // 페이지 변경 시 체크박스 초기화
    table.on('draw', function() {
        $('#select-all').prop('checked', false); // 전체 체크박스 초기화
        $('.row-checkbox').prop('checked', false); // 개별 체크박스 초기화
        $('#banners tbody tr').removeClass('selected-row'); // 선택된 행의 배경색 초기화
    });



    // 검색 버튼 클릭 이벤트 핸들러
    const searchBtn = document.querySelector("#searchButton");
    searchBtn.addEventListener('click', function() {
		table.search('').columns().search('').draw();
		
        const columnIndex = $('#select-lists').val();
        let column = 0;
        switch (columnIndex) {
            case 'book_isbn' : column = 2; break;
            case 'book_name' : column = 3; break;
            default: column = 0;
        }

        let keyword = $('#search-keyword').val();
		
        table.column(column).search(keyword).draw();
		table.ajax.reload();
    });


    // search-keyword에서 Enter 키를 누를 때 searchButton 클릭 이벤트 실행
    $('#search-keyword').on('keypress', function(event) {
        if (event.key === 'Enter') {
            searchBtn.click();
        }
    });

    // 날짜 필터링 로직 추가
    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();

        var productRegidate = data[8]; // 등록 날짜 데이터 (index 8)

        if (startDate && endDate) {
            var start = new Date(startDate);
            var end = new Date(endDate);
            var regDate = new Date(productRegidate);

            // 등록 날짜가 시작일과 종료일 사이에 있는지 확인
            if (regDate >= start && regDate <= end) {
                return true;
            }
            return false;
        }
        return true; // 날짜 필터가 없으면 모든 항목 표시
    });

    document.addEventListener("DOMContentLoaded", function() {
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', resetFilters);
        }
    });


    pickDateBtn();
    datepicker("startDate", "endDate");
    confirmDelete();
});

function confirmDelete() {
    const delBtn = document.querySelector("#delete-button");

    delBtn.addEventListener("click", function() {
        // 선택된 체크박스의 행에서 book_isbn 값을 수집
        const selectedRows = $('#product').DataTable().rows('.selected-row').data();

        const bookISBN = [];

        for (let i = 0; i < selectedRows.length; i++) {
            bookISBN.push(selectedRows[i].book_isbn)
        }

        if (bookISBN.length > 0) {
            getConfirmModal("삭제 하시겠습니까?", function() {
                $.ajax({
                    url: "/admin/products/delete",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(bookISBN), // book_isbns 배열을 JSON으로 전송
                    success: function(response) {

                        if (response === 'success') {
                            location.reload(); // 삭제하고 새로고침
                            // location.href = "/admin/products/products";

                            // 삭제 성공 시 테이블 다시 불러오기 - 이거는 새로고침할 수 없는 방법
                            // table.ajax.reload();
                        }
                    },
                    error: function(xhr, status, error) {
						
                    }
                });
            });
        } else {
            getCheckModal("숨길 항목을 선택해주세요.");
        }
    });
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
    // 검색어 필터 초기화
    $('#search-keyword').val('');
    $('#select-lists').prop('selectedIndex', 0)

    // 날짜 필터 초기화
    $('#startDate').val('');
    $('#endDate').val('');
	$(".date-btn").removeClass("active")
	$("#all").prop("checked", true);;
	
    // DataTables 검색 및 필터링 초기화
    table.search('').columns().search('').draw(); // 검색어 및 모든 컬럼 필터 초기화
	table.ajax.reload();
    table.draw();
}


function pickDateBtn() {
    const dateBtns = document.querySelectorAll(".date-btn");

    dateBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            dateBtns.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
}
