var table;
$(document).ready(function() {
	// 테이블이 이미 초기화되어 있는지 확인
	if (!$.fn.DataTable.isDataTable('#reviews')) {
		table = $('#reviews').removeAttr('width').DataTable({
			autoWidth: false,
			columnDefs: [
				{ targets: 0, orderable: false }, // 첫 번째 컬럼(체크박스 컬럼)에서 정렬 비활성화
				{
					targets: 0,
					width: '40px'
				}
			],
			order: [[6, 'desc']], // 리뷰 작성 날짜 컬럼을 최신 날짜순으로 정렬 (내림차순)
			ajax: {
				url: '/admin/reviews/json'
			},
			columns: [
				{
					data: null,
					render: function() {
						return '<input type="checkbox" class="data-check row-checkbox"><label class="data-check-label"></label>';
					},
					orderable: false,
				},
				{
					data: null, // 실제 데이터는 변경하지 않습니다.
					orderable: false // 이 컬럼은 정렬 가능
				},
				{
					data: 'book_name',
					className: 'text-ellipsis',
					render: function(data) {
						const editText = data.length > 14 ? data.substring(0, 14) + '...' : data.substring(0, 14) + '...';

						return '<a href="#" class="book-title-link" data-menu-link="reviews" style="color: inherit; text-decoration: underline; cursor: pointer;">' + editText + '</a>';
					},
				},
				{ data: 'book_isbn' },
				{
					data: 'review_content',
					className: 'text-ellipsis',
					render: function(data) {
						if (data.length > 15) {
							return data.substring(0, 15) + '...';
						} else {
							return data;
						}
					}
				},
				{ data: 'member_id' },
				{
					data: 'review_write_date',
					render: function(data, type) {
						if (type === 'display' || type === 'filter') {
							var date = new Date(data);
							var year = date.getFullYear();
							var month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
							var day = String(date.getDate()).padStart(2, '0');
							var formattedDate = `${year}-${month}-${day}`;
							return formattedDate;
						}
						return data;
					}
				},
				{
					data: 'review_rating',
					render: function(data, type) {
						if (type === 'display') {
							return '<span class="fas fa-star stars"></span>'.repeat(data) + '<span class="far fa-star empty-stars"></span>'.repeat(5 - data);
						} else if (type === 'filter') {
							return data;
						}
						return data;
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

			    $('#total-row').text('총 ' + filteredRecords + '건');

			    api.column(1, { page: 'current' }).nodes().each(function(cell, i) {
			        let pageStart = api.settings()[0]._iDisplayStart;
			        $(cell).html(pageStart + i + 1);
			    });
			},
			rowCallback: function(row, data, index) {
				// 화면에 표시되는 열을 1부터 시작하도록 변경
				var pageInfo = table.page.info(); // 현재 페이지 정보를 가져옴
				var rowIndex = pageInfo.start + index + 1; // 현재 페이지 시작 인덱스 + 현재 행 인덱스 + 1
				$('td:eq(1)', row).html(rowIndex); // 행 번호를 이어서 설정

				$(row).attr('data-id', data.review_num); // 각 행에 고유 ID 설정

				// 제목 컬럼의 링크 클릭 이벤트 추가
				$(row).find('.book-title-link').on('click', function(event) {
					event.preventDefault(); // 링크 기본 동작 방지
					postToDetailPage(data); // 폼 생성 및 제	출 함수 호출
				});
			}
		});
	}

	$('#select-all').on('click', function() {
		var rows = $('#reviews').DataTable().rows({ 'search': 'applied' }).nodes();
		$('input[type="checkbox"]', rows).prop('checked', this.checked);
	});

	// 개별 체크박스 선택 시 배경색 변경
	$('#reviews tbody').on('change', '.row-checkbox', function() {
		const $row = $(this).closest('tr');
		if (this.checked) {
			$row.addClass('selected-row'); // 체크된 경우 배경색을 추가
		} else {
			$row.removeClass('selected-row'); // 체크 해제된 경우 배경색을 제거
		}
		// 전체 선택 체크박스 상태 업데이트
		if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
			$('#select-all').prop('checked', true);
		} else {
			$('#select-all').prop('checked', false);
		}
	});

	// '전체 선택' 체크박스의 상태 변경 시
	$('#select-all').on('change', function() {
		const isChecked = $(this).prop('checked'); // '전체 선택' 체크박스의 상태

		// 모든 개별 체크박스를 '전체 선택'의 상태에 맞춰 변경
		$('.row-checkbox').prop('checked', isChecked);

		// 각 행에 대해 배경색을 업데이트
		if (isChecked) {
			$('#reviews tbody tr').addClass('selected-row'); // 모든 행에 배경색 클래스 추가
		} else {
			$('#reviews tbody tr').removeClass('selected-row'); // 모든 행에서 배경색 클래스 제거
		}
	});



	$('#reviews tbody').on('change', '.row-checkbox', function() {
		if (!this.checked) {
			$('#select-all').prop('checked', false);
		} else {
			if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
				$('#select-all').prop('checked', true);
			}
		}
	});

	// 삭제 버튼 클릭 이벤트 핸들러
	$('#delete-button').on('click', function() {
		var selectedIds = [];
		$('#reviews .row-checkbox:checked').each(function() {
			var rowData = table.row($(this).closest('tr')).data();
			selectedIds.push(rowData.review_num);
		});
		// 선택된 항목이 있으면 삭제 확인 모달을 띄움
		if (selectedIds.length > 0) {
			getConfirmModal(`${selectedIds.length}개의 항목을 삭제하시겠습니까?`, deleteBtn);
		} else {
			getCheckModal('삭제할 항목을 선택하세요.');
		}
	});


	// 모달 외부 클릭 시 닫기
	window.onclick = function(event) {
		if (event.target == $('#myModal')[0]) {
			$('#myModal').hide();
		}
	};

	// 삭제 확인 버튼
	const deleteBtn = function() {
		var selectedIds = [];
		$('#reviews').DataTable().$('.row-checkbox:checked').each(function() {
			var rowData = $('#reviews').DataTable().row($(this).closest('tr')).data();
			selectedIds.push(rowData.review_num);
		});

		fnPostAjax('/admin/reviews/delete', selectedIds, function(jsonData) {
			getCheckModal(jsonData.resultMsg);
			if (jsonData.resultCode === 'S') {
				$('#reviews').DataTable().ajax.reload();  // 테이블 새로고침
			}
		});

	};


	// 검색 버튼 클릭 이벤트 핸들러
	$('#searchButton').on('click', function() {
		applySearchFilter(); // 검색 필터 적용 함수 호출
	});

	// 검색 입력에서 Enter 키를 누를 때 검색 필터 적용
	$('#searchKeyword').on('keypress', function(event) {
		if (event.key === 'Enter') {
			applySearchFilter();
		}
	});

	// 검색 필터 적용 함수
	function applySearchFilter() {
		var selectedColumn = $('#searchColumn').val(); // 선택한 열의 인덱스
		var keyword = $('#searchKeyword').val().trim(); // 입력된 검색어
		
		table.column(selectedColumn).search(keyword).draw();
	}

	const collator = new Intl.Collator('ko');

	$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex) {
			var startDate = $('#startDate').val();
			var endDate = $('#endDate').val();

			var searchColumn = $('#searchColumn').val();
			var keyword = $('#searchKeyword').val().trim();
			var memberId = data[5]; 
			var reviewDate = data[6];  
			var bookTitle = data[3].trim(); 
			var bookIsbn = data[4];
			var rating = data[7];
			
		
			
			if (searchColumn === '5' && !memberId.includes(keyword)) {
				return false;
			}
			
			if (searchColumn === '3' && collator.compare(bookTitle, keyword) == 0) {
				return false;  
			}
			
			if (searchColumn === '4' && !bookIsbn.includes(keyword)) {
				return false;  
			}
			
			if (searchColumn === '7' && !rating.includes(keyword)) {
				return false;  
			}

			
			if (startDate && new Date(reviewDate) < new Date(startDate)) return false;
			if (endDate && new Date(reviewDate) > new Date(endDate)) return false;
			
			return true;
		}
	);

	document.querySelectorAll('.input-box input').forEach(function(input) {
		input.addEventListener('focus', function() {
			// Input 박스를 클릭하면 기존 값을 제거
			this.value = '';
		});
	});

	document.querySelector('[onclick="resetFilters()"]').addEventListener('click', resetFilters);

	// 모든 date-option 버튼에 클릭 이벤트 리스너 추가
	document.querySelectorAll('.date-option').forEach(function(button) {
		button.addEventListener('click', function() {
			setActive(this);  // 클릭된 버튼에 'active' 클래스 설정
		});
	});

	datepicker("startDate", "endDate");
});

function postToDetailPage(data) {
	var existingForm = $('#postToDetailForm');

	if (existingForm.length) {
		existingForm.remove();
	}

	// 폼 생성
	var form = $('<form>', {
		id: 'postToDetailForm',
		method: 'POST',
		action: '/admin/reviews/detail'  // 서버의 상세 페이지 URL로 설정
	});


	// 데이터를 숨김 필드로 추가
	form.append($('<input>', { type: 'hidden', name: 'review_num', value: data.review_num }));

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
	// 검색어 필터 초기화
	$('#searchKeyword').val('');
	$('#searchColumn').val('5');

	// 날짜 필터 초기화
	$('#startDate').val('');
	$('#endDate').val('');
	$('.date-btn').removeClass('active');

	// DataTables 검색 및 필터링 초기화
	table.search('').columns().search('').draw(); // 검색어 및 모든 컬럼 필터 초기화

	table.draw();
}


function setActive(element) {
	// 모든 date-option 버튼에서 'active' 클래스를 제거
	var options = document.querySelectorAll('.date-option');
	options.forEach(function(option) {
		option.classList.remove('active');
	});

	// 클릭된 요소에 'active' 클래스를 추가
	element.classList.add('active');
}