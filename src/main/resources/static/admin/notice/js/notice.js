var table;
$(document).ready(function() {
	// 테이블이 이미 초기화되어 있는지 확인
	if (!$.fn.DataTable.isDataTable('#notice')) {
		table = $('#notice').removeAttr('width').DataTable({
			autoWidth: false,
			columnDefs: [
				{ targets: 0, orderable: false } // 첫 번째 컬럼(체크박스 컬럼)에서 정렬 비활성화
			],
			order: [[3, 'desc']], // 리뷰 작성 날짜 컬럼을 최신 날짜순으로 정렬 (내림차순)
			ajax: {
				url: '/admin/notice/json'
			},
			columns: [
				{
					data: null,
					render: function(data, type, row) {
						return '<input type="checkbox" class="data-check row-checkbox"><label class="data-check-label"></label>';
					},
					orderable: false,
				},
				{
					data: 'notice_num', // 실제 데이터는 변경하지 않습니다.
					orderable: true // 이 컬럼은 정렬 가능
				},
				{
					data: 'notice_title',
					render: function(data, type, row) {
						return '<a href="#" class="book-title-link" data-menu-link="notice" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
					}
				},
				{
					data: 'notice_write_date',
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
					data: null,
					render: function(data, type, row) {
						if (type === 'display' || type === 'filter') {
							var startDate = new Date(row.notice_start_date);
							var endDate = new Date(row.notice_end_date);

							// 날짜만 추출 (시간은 00:00:00로 설정)
							var startFormatted = [
								startDate.getFullYear(),
								String(startDate.getMonth() + 1).padStart(2, '0'),
								String(startDate.getDate()).padStart(2, '0')
							].join('-');

							var endFormatted = [
								endDate.getFullYear(),
								String(endDate.getMonth() + 1).padStart(2, '0'),
								String(endDate.getDate()).padStart(2, '0')
							].join('-');
							return startFormatted + ' ~ ' + endFormatted;
						}
						return '';
					}
				},
				{
					data: 'notice_visible',
					render: function(data, type, row) {

						if (type === 'display') {
							if (data == '01') {
								return "<span style='color: #4777F6;'>노출<span>"
							} else {
								return "<span>비노출<span>"
							}

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

				$(row).attr('data-id', data.notice_num); // 각 행에 고유 ID 설정

				// 제목 컬럼의 링크 클릭 이벤트 추가
				$(row).find('.book-title-link').off('click').on('click', function(event) {
					event.preventDefault(); // 링크 기본 동작 방지
					postToDetailPage(data); // 폼 생성 및 제출 함수 호출
				});
			}
		});
	}
	// 개별 체크박스 선택 시 배경색 변경
	$('#notice tbody').on('change', '.row-checkbox', function() {
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
			$('#notice tbody tr').addClass('selected-row'); // 모든 행에 배경색 클래스 추가
		} else {
			$('#notice tbody tr').removeClass('selected-row'); // 모든 행에서 배경색 클래스 제거
		}
	});



	$('#notice tbody').on('change', '.row-checkbox', function() {
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
		$('#notice').DataTable().$('.row-checkbox:checked').each(function() {
			var rowData = $('#notice').DataTable().row($(this).closest('tr')).data();
			selectedIds.push(rowData.notice_num); // 삭제할 리뷰 번호 수집
		});


		if (selectedIds.length > 0) {
			// 메시지를 기본 메시지로 리셋
			getConfirmModal(`${selectedIds.length}개의 항목을 삭제하시겠습니까?`, deleteBtn);

			// Yes와 No 버튼을 보이게 설정
		} else {
			// alert 대신 모달 메시지 변경
			getCheckModal('삭제할 항목을 선택하세요.')
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
		$('#notice').DataTable().$('.row-checkbox:checked').each(function() {
			var rowData = $('#notice').DataTable().row($(this).closest('tr')).data();
			selectedIds.push(rowData.notice_num);
		});

		if (selectedIds.length === 0) {
			alert("삭제할 항목을 선택하세요.");
			return;
		}
		$.ajax({
			url: '/admin/notice/delete',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(selectedIds),
			success: function() {
				getCheckModal('삭제가 완료되었습니다.')
				$('#notice').DataTable().ajax.reload();  // 테이블 새로고침
			},
			error: function() {
				getCheckModal('삭제 중 오류가 발생했습니다.')
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
		var keyword = $('#searchKeyword').val(); // 입력된 검색어
		// 선택한 열로 검색 필터를 적용
		table.column(2).search(keyword).draw();
	}


	// 날짜 필터링 로직 추가
	$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex) {
			var startDate = $('#startDate').val();
			var endDate = $('#endDate').val();
			var memberDate = data[3];

			// 날짜 형식을 Date 객체로 변환
			var start = startDate ? new Date(startDate) : null;
			var end = endDate ? new Date(endDate) : null;
			var member = new Date(memberDate);

			if ((start === null && end === null) ||
				(start <= member && (end === null || member <= end))) {
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

	document.querySelector('[onclick="resetFilters()"]').addEventListener('click', resetFilters);

	// 모든 date-option 버튼에 클릭 이벤트 리스너 추가
	document.querySelectorAll('.date-option').forEach(function(button) {
		button.addEventListener('click', function() {
			setActive(this);  // 클릭된 버튼에 'active' 클래스 설정
		});
	});

	datepicker("startDate", "endDate");
});


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



function postToDetailPage(data) {
	// 폼이 중복 생성되는 것을 방지하기 위해 기존 폼을 제거합니다.
	$('#postToDetailForm').remove();

	// 폼을 새로 생성합니다.
	var form = $('<form>', {
		id: 'postToDetailForm',
		method: 'POST',
		action: '/admin/notice/detail'  // 서버의 상세 페이지 URL로 설정
	});

	// 숨겨진 필드에 데이터를 추가합니다.
	form.append($('<input>', { type: 'hidden', name: 'notice_num', value: data.notice_num }));

	// 폼을 body에 추가하고 제출합니다.
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

	// 날짜 필터 초기화
	$('#startDate').val('');
	$('#endDate').val('');
	$(".date-btn ").removeClass("active");
	
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