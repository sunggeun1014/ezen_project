var table;
$(document).ready(function() {
	if (!$.fn.DataTable.isDataTable('#banners')) {
		table = $('#banners').removeAttr('width').DataTable({
			autoWidth: false,
			paging: true,
			columnDefs: [
				// 가운데정렬 및 컬럼별 정렬 비활성화
				{ targets: '_all', orderable: false },
			],

			order: [[6, 'desc']],
			ajax: {
				url: '/admin/banners/json'
			},

			columns: [
				{
					data: null,
					width: '40px',
					render: function(data, type, row) {
						return '<input type="checkbox" id="data-check" class="row-checkbox"><label for="data-check"></label>';
					}
				},
				{
					data: null,
					width: '20px',
				},
				{
					data: 'banner_title',
					width: '240px',
					render: function(data, type, row) {
						return '<a href="#" class="banner-title-link" data-menu-link="banner" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
					}
				},
				{
					data: 'banner_position',
					width: '100px',
				},
				{
					data: null,
					render: function(data, type, row) {
						if (type === 'display' || type === 'filter') {
							// 'banner_start'와 'banner_end'를 로컬 날짜로 변환
							var startDate = new Date(row.banner_start);
							var endDate = new Date(row.banner_end);

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
					},
					title: '노출 기간',
					width: '240px',
				},

				{
					data: 'banner_visible',
					width: '100px',
					render: function(data, type, row) {
						var color = data === '노출' ? '#4777F6' : '#7E7E7E';
						return '<span style="color: ' + color + ';">' + data + '</span>';
					}
				},
				{
					data: 'banner_date',
					width: '200px',
					render: function(data, type, row) {
						// date값을 받아올때 -> YYYY-MM-DD HH:MM 식으로 포맷해서 출력해준다
						if (type === 'display' || type === 'filter') {
							var date = new Date(data);
							var formattedDate = date.toISOString().split('T')[0];
							var formattedTime = date.toTimeString().split(' ')[0].substring(0, 5); // Extract HH:MM
							return formattedDate + ' ' + formattedTime;
						}
						return data;
					}
				}
			],


			"info": false, // 기본 적용 텍스쳐 숨기기
			lengthChange: false, // 기본 적용 텍스쳐 숨기기
			dom: 'lrtip', // 기본 검색 필드 숨기기 (f를 제거)
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
			rowCallback: function(row, data) {
				let api = this.api();
			    api.column(1, { page: 'current' }).nodes().each(function(cell, i) {
			        let pageStart = api.settings()[0]._iDisplayStart;
			        $(cell).html(pageStart + i + 1);
			    });
								
				$(row).attr('data-id', data.banner_num); // 각 행에 고유 ID 설정

				// 제목 컬럼의 링크 클릭 이벤트 추가
				$(row).find('.banner-title-link').on('click', function(event) {
					event.preventDefault(); // 링크 기본 동작 방지
					postToDetailPage(data); // 폼 생성 및 제출 함수 호출
				});
			},
			drawCallback: function(settings) {
				let api = this.api();
				let filteredRecords = api.rows({ search: 'applied' }).count();
	
				$('#total-row').text(`총 ${filteredRecords}건`);
			}

		});

	}

	// 체크박스
	$('#select-all').on('click', function() {
		var rows = $('#banners').DataTable().rows({ 'search': 'applied' }).nodes();
		$('input[type="checkbox"]', rows).prop('checked', this.checked);
	});


	// 개별 선택
	$('#banners tbody').on('change', '.row-checkbox', function() {
		const $row = $(this).closest('tr'); // 체크박스가 있는 행을 선택

		if (this.checked) {
			$row.addClass('selected-row'); // 배경색을 변경할 클래스 추가
		} else {
			$row.removeClass('selected-row'); // 배경색을 변경할 클래스 제거
		}

		// 전체 체크박스와 개별 체크박스의 선택 상태를 비교하여 '전체 선택' 체크박스 상태를 업데이트
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
			$('#banners tbody tr').addClass('selected-row'); // 모든 행에 배경색 클래스 추가
		} else {
			$('#banners tbody tr').removeClass('selected-row'); // 모든 행에서 배경색 클래스 제거
		}
	});

	// 페이지 변경 시 체크박스 초기화
	table.on('draw', function() {
		$('#select-all').prop('checked', false); // 전체 체크박스 초기화
		$('.row-checkbox').prop('checked', false); // 개별 체크박스 초기화
		$('#banners tbody tr').removeClass('selected-row'); // 선택된 행의 배경색 초기화
	});


	// 모달 변수
	var modal = document.getElementById("myModal");

	// 삭제 버튼 클릭 이벤트 핸들러
	$('#delete-button').on('click', function() {
		var selectedIds = [];
		$('#banners').DataTable().$('.row-checkbox:checked').each(function() {
			var rowData = $('#banners').DataTable().row($(this).closest('tr')).data();
			selectedIds.push(rowData.banner_num); // 삭제할 배너 번호 수집
		});
		if (selectedIds.length > 0) {
			getConfirmModal(`${selectedIds.length}개의 항목을 삭제하시겠습니까?`, function() {
				$.ajax({
					url: '/admin/banners/delete',  // 서버의 삭제 처리 URL
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(selectedIds),  // 선택된 배너번호들을 JSON으로 전송
					success: function(response) {
						$('#banners').DataTable().ajax.reload();  // 테이블 새로고침
					},
					error: function(error) {
						getCheckModal('삭제 중 오류가 발생했습니다.');
					}
				});
			});
		} else {
			getCheckModal('삭제할 항목을 선택하세요.');
		}
	});


	// 삭제 확인 및 취소 버튼
	$('#confirm-delete').on('click', function() {
		var selectedIds = [];
		$('#banners').DataTable().$('.row-checkbox:checked').each(function() {
			var rowData = $('#banners').DataTable().row($(this).closest('tr')).data();
			selectedIds.push(rowData.banner_num);
		});

		$.ajax({
			url: '/admin/banners/delete',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(selectedIds),
			success: function(response) {
				modal.hide();
				$('#myModal .modal-content p').text('삭제가 완료되었습니다.');
				$('#banners').DataTable().ajax.reload();
			},
			error: function(error) {
				$('#confirm-delete').hide();
				$('#cancel-delete').hide();
				$('#myModal .modal-content p').text('삭제 중 오류가 발생했습니다.');
				setTimeout(function() {
					modal.hide();
					$('#confirm-delete').show();
					$('#cancel-delete').show();
				}, 3000);
			}
		});
	});

	$('#cancel-delete').on('click', function() {
		modal.hide();
	});

	// 검색 버튼 클릭 이벤트 핸들러
	$('#searchButton').on('click', function() {
		var searchValue = { '': '', '01': '배너', '02': '팝업' }[$('input[name="banner-position"]:checked').val()] || '';
		table.column(3).search(searchValue).draw(); // 3은 banner_position 컬럼의 인덱스입니다.
		table.columns(2).search($('#searchKeyword').val()).draw();
	});

	// searchKeyword에서 Enter 키를 누를 때 searchButton 클릭 이벤트 실행
	$('#searchKeyword').on('keypress', function(event) {
		if (event.key === 'Enter') {
			$('#searchButton').click();
		}
	});

	$.fn.dataTable.ext.search.push(
	    function(settings, data, dataIndex) {
	        var startDate = $('#startDate').val();
	        var endDate = $('#endDate').val();
	
	        var bannerDateRange = data[4]; 
	        var [bannerStartStr, bannerEndStr] = bannerDateRange.split(' ~ ');
	        var bannerStart = new Date(bannerStartStr);
	        var bannerEnd = new Date(bannerEndStr);
	
	        var start = startDate ? new Date(startDate + 'T00:00:00.0') : null;
	        var end = endDate ? new Date(endDate + 'T23:59:59.0') : null;
	
	        if (start && end) {
	            return (bannerStart <= end && bannerEnd >= start);
	        }
	
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
		action: '/admin/banners/detail'  // 서버의 상세 페이지 URL로 설정
	});


	// 데이터를 숨김 필드로 추가
	form.append($('<input>', { type: 'hidden', name: 'banner_num', value: data.banner_num }));

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

	// 날짜 필터 초기화
	$('#startDate').val('');
	$('#endDate').val('');
	$('.date-option').removeClass('active');
	flatpickr("#startDate").clear();
	flatpickr("#endDate").clear();

	// 라디오버튼 '전체' 상태로 초기화
	$('#position-all').prop('checked', true);

	// DataTables 검색 및 필터링 초기화
	table.search('').columns().search('').draw();

	// 체크박스 선택 해제
	$('#select-all').prop('checked', false);
	$('#banners').find('.row-checkbox').prop('checked', false);

	// 컬럼별 정렬 상태 초기화
	table.order([6, 'desc']).draw();

	// 페이지 번호 초기화
	table.page('first').draw('page');
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