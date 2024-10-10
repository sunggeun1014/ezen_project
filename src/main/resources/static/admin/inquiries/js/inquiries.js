var table;

$(document).ready(function() {
	// 테이블이 이미 초기화되어 있는지 확인
	if (!$.fn.DataTable.isDataTable('#inquiries')) {
		table = $('#inquiries').DataTable({
			order: [[4, 'desc']], // 기본적으로 문의 작성 날짜 컬럼을 최신 날짜순으로 정렬 (내림차순)
			ajax: {
				url: '/admin/inquiries/json'
			},
			columns: [
				{
					data: null,
					orderable: false
				},
				{
					data: 'inquiry_title',
					render: function(data, type, row) {
						const inquiryNum = row.inquiry_num; // inquiry_num 가져오기
						const url = '/admin/inquiries/detail?inquiry_num=' + encodeURIComponent(inquiryNum);
						return '<a href=' + url + ' class="book-title-link" data-menu-link="managers">' + data + '</a>';
						// return '<a href="#" class="book-title-link" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
					}
				},
				{ data: 'inquiry_type' },
				{ data: 'member_id' },
				{
					data: 'inquiry_write_date',
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
					data: 'answer_write_date',
					render: function(data, type, row) {
						if (type === 'display' && !data) {
							return '-';
						} else if (type === 'display' || type === 'filter') {
							var date = new Date(data);
							var year = date.getFullYear();
							var month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
							var day = String(date.getDate()).padStart(2, '0');
							var formattedDate = `${year}-${month}-${day}`;
							return formattedDate;
						}
						return data; // 정렬 및 필터를 위해 원본 데이터 반환
					}
				},
				{
					data: 'inquiry_answer_status',
					render: function(data, type, row) {
						var color = data === '미완료' ? '#F69E47' : (data === '처리완료' ? '#10A142' : 'black');
						return '<span style="color: ' + color + ';">' + data + '</span>';
					}
				}
			],
			info: false,
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

			    api.column(0, { page: 'current' }).nodes().each(function(cell, i) {
			        let pageStart = api.settings()[0]._iDisplayStart;
			        $(cell).html(pageStart + i + 1);
			    });
			},
			rowCallback: function(row, data, index) {
				// 화면에 표시되는 열을 1부터 시작하도록 변경
				var pageInfo = table.page.info();
				var rowIndex = pageInfo.start + index + 1;
				$('td:eq(0)', row).html(rowIndex);

				$(row).attr('data-id', data.inquiry_num); // 각 행에 고유 ID 설정

				// 제목 컬럼의 링크 클릭 이벤트 추가
				// $(row).find('.book-title-link').on('click', function(event) {
				// 	event.preventDefault();
				// 	postToDetailPage(data.inquiry_num);
				// });
			},
		});
	}


	const collator = new Intl.Collator('ko');

	// 날짜 필터링 로직 추가
	$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex) {
			var startDate = $('#startDate').val();
			var endDate = $('#endDate').val();
			var inquiryDate = data[4]; // 'inquiry_write_date' 컬럼의 인덱스


			var selectedStatusLabel = $('input[name="order_status"]:checked').next('label').text().trim(); // 선택된 상태의 라벨 텍스트
			var inquiryStatus = data[6].trim();


			var selectedInquiryType = $('#searchColumn2').val();
			var inquiryType = data[2];

			// 날짜 필터링
			if (startDate && new Date(inquiryDate) < new Date(startDate)) return false;
			if (endDate && new Date(inquiryDate) > new Date(endDate)) return false;
			
			if (collator.compare(selectedStatusLabel, '전체') !== 0) {
				if (selectedStatusLabel === '미답변' && collator.compare(inquiryStatus, '미완료') !== 0) {
					return false; // "미답변" 상태가 아닌 경우 제외
				} else if (selectedStatusLabel === '처리완료' && collator.compare(inquiryStatus, '처리완료') !== 0) {
					return false; // "처리완료" 상태가 아닌 경우 제외
				}
			}
			if (collator.compare(selectedInquiryType, '전체문의') !== 0) {
				if (collator.compare(selectedInquiryType, inquiryType) !== 0) {
					return false;
				}
			}

			// 모든 조건이 맞는 경우 true 반환
			return true;
		}
	);



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

	function applySearchFilter() {
		var selectedColumn = parseInt($('#searchColumn').val());
		var selectedColumn2 = $('#searchColumn2').val();
		var keyword = $('#searchKeyword').val();
		
		if (collator.compare(selectedColumn2, '전체문의') === 0) {
			table
				.column(selectedColumn).search(keyword)
				.column(2).search('')			
				.draw(); // 검색 필터 적용
		} else {
			table
				.column(selectedColumn).search(keyword)
				.column(2).search(selectedColumn2)			
				.draw(); // 검색 필터 적용
		}
	}

	document.querySelector('[onclick="resetFilters()"]').addEventListener('click', resetFilters);

	// 모든 date-option 버튼에 클릭 이벤트 리스너 추가
	document.querySelectorAll('.date-option').forEach(function(button) {
		button.addEventListener('click', function() {
			setActive(this);  // 클릭된 버튼에 'active' 클래스 설정
		});
	});

	datepicker("startDate", "endDate");

});



function postToDetailPage(inquiry_num) {
	let params = {
		inquiry_num: inquiry_num
	}

	fnPostMovePage('/admin/inquiries/details', params);
}

function fnMovePage(method, url, params) {
	// 폼 생성
	var form = $('<form>', {
		method: method
		, action: url  // 서버의 상세 페이지 URL로 설정
	});

	// 데이터를 숨김 필드로 추가
	for (key in params) {
		form.append($('<input>', { type: 'hidden', name: key, value: params[key] }));
	}

	// 폼을 body에 추가하고 제출
	form.appendTo('body').submit();
	form.remove();
}

function fnPostMovePage(url, params) {
	fnMovePage('POST', url, params);
}

function fnGetMovePage(url, params) {
	fnMovePage('GET', url, params);
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
	$('#searchColumn').val('3');
	$('#searchColumn2').val('전체문의'); // 문의 분류 필터 초기화

	// 날짜 필터 초기화
	$('#startDate').val('');
	$('#endDate').val('');
	$('#searchKeyword').val('');

	$('input[name="order_status"]').prop('checked', false); // 모든 라디오 버튼 체크 해제
	$('#order-status-all').prop('checked', true); // '전체' 상태로 체크
	$('.date-btn').removeClass("active");
	
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


