var table;
$(document).ready(function() {
    // 테이블이 이미 초기화되어 있는지 확인
    if (!$.fn.DataTable.isDataTable('#product')) {
        table = $('#product').DataTable({
            columnDefs:
			[
				{ targets: 0, orderable: false }, // 첫 번째 컬럼(체크박스 컬럼)에서 정렬 비활성화
				// 가운데정렬
				{
				    className: 'table-center',
				    targets: '_all'
				}
			],
			order: [[8, 'asc']], // 리뷰 작성 날짜 컬럼을 최신 날짜순으로 정렬 (내림차순)
            ajax: {
                url: '/admin/products/json',
                dataSrc: 'data',
                data: function (d) {
                    d.bookState = $('input[name="bookState"]:checked').val();
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
		            data: null,  // 이 컬럼은 데이터베이스에서 가져오는 데이터를 사용하지 않음
		            render: function(data, type, row, meta) {
		               return meta.row + 1;  // meta.row는 0부터 시작하는 행 인덱스이므로 +1 해줌
		            },
		            orderable: false,  // 이 컬럼에 대해 정렬을 비활성화
		         },
                {
                    data: 'book_isbn',
                    render: function(data, type, row) {
                        const url = '/admin/index?path=/admin/products/editProduct&book_isbn=' + encodeURIComponent(data);
                        return '<a href="' + url + '" class="book-isbn-link" data-isbn="' + data + '">' + data + '</a>';
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
                                console.error("Invalid date:", data);
                                return data; // 잘못된 날짜일 경우 원본 데이터 반환
                            }
                        }

                        return data; // 소팅을 위한 원본 형식 반환
                    }
                },

				{
				  data: 'book_state',
				  render: function(data, type, row) {
				    const onClass = data === '01' ? ' on' : '';
				    const offClass = data === '02' ? ' off' : '';
				    return '<div class="status-btn-wrap">' +
				           '<button class="status-btn' + onClass + '">판매중</button>' +
				           '<button class="status-btn' + offClass + '">판매중지</button>' +
				           '</div>';
				  }
				}

            ],
            "info": false,
            lengthChange: false,
            dom: 'lrtip',
            rowCallback: function(row, data) {
                $(row).attr('data-id', data.book_isbn); // 각 행에 고유 ID 설정

                // 제목 컬럼의 링크 클릭 이벤트 추가
                $(row).find('.book-isbn-link').on('click', function(event) {
                    event.preventDefault(); // 링크 기본 동작 방지
                    getToDetailPage(data); // 폼 생성 및 제출 함수 호출
                });
            }
        });
    }

    // 판매중/판매중지 라디오버튼
    $('input[name="bookState"]').on('change', function () {
        table.ajax.reload();
    })


    // 체크박스
    $('#check-all').on('click', function() {
        const rows = $('#product').DataTable().rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    $('#product tbody').on('change', '.row-checkbox', function() {
        if (!this.checked) {
            $('#check-all').prop('checked', false);
        } else if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
            $('#check-all').prop('checked', true);
        }
    });

    // 모달 관련 변수
    var modal = document.getElementById("myModal");
    var confirmDeleteButton = document.getElementById("confirm-delete");
    var cancelDeleteButton = document.getElementById("cancel-delete");

    // 삭제 버튼 클릭 이벤트 핸들러
    $('#delete-button').on('click', function() {
        var selectedIds = [];
        $('#product').DataTable().$('.row-checkbox:checked').each(function() {
            var rowData = $('#product').DataTable().row($(this).closest('tr')).data();
            selectedIds.push(rowData.book_isbn); // 삭제할 리뷰 번호 수집
        });

        if (selectedIds.length > 0) {
            // 메시지를 기본 메시지로 리셋
            document.querySelector('#myModal .modal-content p').textContent = `${selectedIds.length}개의 항목을 삭제하시겠습니까?`;

            // Yes와 No 버튼을 보이게 설정
            document.getElementById('confirm-delete').style.display = "inline-block";
            document.getElementById('cancel-delete').style.display = "inline-block";
            modal.style.display = "block"; // 모달 표시
        } else {
            // alert 대신 모달 메시지 변경
            document.querySelector('#myModal .modal-content p').textContent = '삭제할 항목을 선택하세요.';
            document.getElementById('confirm-delete').style.display = "none";
            document.getElementById('cancel-delete').style.display = "none";
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
        var selectedIds = [];
        $('#product').DataTable().$('.row-checkbox:checked').each(function() {
            var rowData = $('#product').DataTable().row($(this).closest('tr')).data();
            selectedIds.push(rowData.review_num);
        });

        $.ajax({
            url: '/admin/products/delete',  // 서버의 삭제 처리 URL
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(selectedIds),  // 선택된 리뷰 번호들을 JSON으로 전송
            success: function(response) {
                modal.style.display = "none";
                document.querySelector('#myModal .modal-content p').textContent = '삭제가 완료되었습니다.';
                $('#reviews').DataTable().ajax.reload();  // 테이블 새로고침
            },
            error: function(error) {
                document.getElementById('confirm-delete').style.display = "none";
                document.getElementById('cancel-delete').style.display = "none";
                document.querySelector('#myModal .modal-content p').textContent = '삭제 중 오류가 발생했습니다.';
                setTimeout(function() {
                    modal.style.display = "none";
                    document.getElementById('confirm-delete').style.display = "inline-block";
                    document.getElementById('cancel-delete').style.display = "inline-block";
                }, 3000);
            }
        });
    };

    // 삭제 취소 버튼
    cancelDeleteButton.onclick = function() {
        modal.style.display = "none";
    };


	// 검색 버튼 클릭 이벤트 핸들러
	const searchBtn = document.querySelector("#searchButton");
	    searchBtn.addEventListener('click', function() {
	        const columnIndex = $('#select-lists').val();
            let column = 0;
            switch (columnIndex) {
                case 'book_isbn' : column = 2; break;
                case 'book_name' : column = 3; break;
                default: column = 0;
            }

	        let keyword = $('#search-keyword').val();
	        // 선택된 컬럼과 입력된 키워드로 필터링
	        table.column(column).search(keyword).draw();
	    });

	    // search-keyword에서 Enter 키를 누를 때 searchButton 클릭 이벤트 실행
	    $('#search-keyword').on('keypress', function(event) {
	        if (event.key === 'Enter') {
	            searchBtn.click();
	        }
	    });

		$('#startDate, #endDate').on('change', function() {
			table.draw(); // 날짜 변경 시 테이블 다시 그리기
		});

		// 날짜 필터링 로직 추가
		$.fn.DataTable.ext.search.push(
			function(settings, data, dataIndex) {
				var startDate = $('#startDate').val();
				var endDate = $('#endDate').val();
				var registerDate = data[8];

				// 날짜 형식을 Date 객체로 변환
				var start = startDate ? new Date(startDate) : null;
				var end = endDate ? new Date(endDate) : null;
				var bookRegister = new Date(registerDate);

				if ((start === null && end === null) ||
					(start <= bookRegister && (end === null || bookRegister <= end))) {
					return true;
				}
				return false;
			}
		);

		document.querySelectorAll('.input-box input').forEach(function(input) {
			input.addEventListener('focus', function() {
				// Input 박스를 클릭하면 기존 값을 제거
				this.value = '';
			});
		});

    document.addEventListener("DOMContentLoaded", function() {
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', resetFilters);
        }
    });
});

pickDateBtn();
datepicker("startDate", "endDate");
setToday();

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
	// 기본 첫 번째 옵션으로 설정 html쪽 select 4번째로 초기화 시켜준다
	$('#select-lists').prop('selectedIndex', 0)

	// 날짜 필터 초기화
	$('#startDate').val('');
	$('#endDate').val('');

	// DataTables 검색 및 필터링 초기화
	table.search('').columns().search('').draw(); // 검색어 및 모든 컬럼 필터 초기화

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

function getToDetailPage(data) {
    // 폼 생성
    var form = $('<form>', {
        method: 'GET',
        action: '/admin/products/editProduct'  // 서버의 상세 페이지 URL로 설정
    });

    // 데이터를 숨김 필드로 추가
    form.append($('<input>', { type: 'hidden', name: 'book_isbn', value: data.book_isbn }));

    // 폼을 body에 추가하고 제출
    form.appendTo('body').submit();
}

// 보류
function changeStateBtn() {
    const statusBtns = document.querySelectorAll(".status-btn");

    statusBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const isActive = this.textContent === "판매중";

            statusBtns.forEach((otherBtn) => {
                otherBtn.classList.remove("on", "off");
            });

            this.classList.add(isActive ? "on" : "off");
        });
    });
}
