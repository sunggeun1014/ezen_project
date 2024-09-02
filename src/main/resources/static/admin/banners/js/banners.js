var table;
$(document).ready(function() {
	if (!$.fn.DataTable.isDataTable('#banners')) {
		table = $('#banners').DataTable({
			ajax: {
				url: '/admin/banners',
				dataSrc: 'data'
			},

			columns: [
				{
					data: null,
					render: function(data, type, row) {
						return '<input type="checkbox" id="data-check" class="row-checkbox"><label for="data-check"></label>';
					},
					orderable: false,
				},
				{ data: 'banner_num' },
				{
					data: 'banner_title',
					render: function(data, type, row) {
						return '<a href="#" class="banner-title-link" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
					}
				},
				{ data: 'banner_position' },
				{
					data: null,
					render: function(data, type, row) {
						if (type === 'display' || type === 'filter') {
							var startDate = new Date(row.banner_start);
							var endDate = new Date(row.banner_end);

							var startFormatted = startDate.toISOString().split('T')[0] + ' ' + startDate.toTimeString().split(' ')[0].substring(0, 5);
							var endFormatted = endDate.toISOString().split('T')[0] + ' ' + endDate.toTimeString().split(' ')[0].substring(0, 5);

							return startFormatted + ' - ' + endFormatted;
						}
						return '';
					},
					title: 'banner_visible_period'
				},

				{ data: 'banner_visible' },
				{
					data: 'banner_date',
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

			rowCallback: function(row, data) {
				$(row).attr('data-id', data.b_num); // 각 행에 고유 ID 설정

				// 제목 컬럼의 링크 클릭 이벤트 추가
				$(row).find('.banner-title-link').on('click', function(event) {
					event.preventDefault(); // 링크 기본 동작 방지
					postToDetailPage(data); // 폼 생성 및 제출 함수 호출
				});
			}
		});
	}


	$('#select-all').on('click', function() {
		var rows = $('#reviews').DataTable().rows({ 'search': 'applied' }).nodes();
		$('input[type="checkbox"]', rows).prop('checked', this.checked);
	});


	$('#banners tbody').on('change', '.row-checkbox', function() {
		if (!this.checked) {
			$('#select-all').prop('checked', false);
		} else {
			if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
				$('#select-all').prop('checked', true);
			}
		}
	});

	// 검색 버튼 클릭 이벤트 핸들러
	$('#searchButton').on('click', function() {
		var selectedColumn = $('#searchColumn').val();
		var keyword = $('#searchKeyword').val();
		// 선택된 컬럼과 입력된 키워드로 필터링
		table.column(selectedColumn).search(keyword).draw();
	});

	// searchKeyword에서 Enter 키를 누를 때 searchButton 클릭 이벤트 실행
	$('#searchKeyword').on('keypress', function(event) {
		if (event.key === 'Enter') {
			$('#searchButton').click();
		}
	});

	$('#startDate, #endDate').on('change', function() {
		table.draw(); // 날짜 변경 시 테이블 다시 그리기
	});

	// 날짜 필터링 로직 추가
	$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex) {
			var startDate = $('#startDate').val();
			var endDate = $('#endDate').val();
			var memberDate = data[4];

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
	
	// 모달 관련 변수
	var modal = document.getElementById("myModal");
	var confirmDeleteButton = document.getElementById("confirm-delete");
	var cancelDeleteButton = document.getElementById("cancel-delete");
	
	// 삭제 버튼 클릭 이벤트 핸들러
	   $('#delete-button').on('click', function() {
	       var selectedIds = [];
	       $('#banners').DataTable().$('.row-checkbox:checked').each(function() {
	           var rowData = $('#banners').DataTable().row($(this).closest('tr')).data();
	           selectedIds.push(rowData.banner_num); // 삭제할 배너 번호 수집
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
	       $('#banners').DataTable().$('.row-checkbox:checked').each(function() {
	           var rowData = $('#banners').DataTable().row($(this).closest('tr')).data();
	           selectedIds.push(rowData.banner_num);
	       });

	       $.ajax({
	           url: '/admin/banners/delete',  // 서버의 삭제 처리 URL
	           type: 'POST',
	           contentType: 'application/json',
	           data: JSON.stringify(selectedIds),  // 선택된 배너번호들을 JSON으로 전송
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

	// 등록 버튼
	$('#insert-button').on('click', function() {
		location.href = '/admin/banners/insert';
	});


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

});

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
	$('#position-all').prop('checked', true);

	// 날짜 필터 초기화
	$('#startDate').val('');
	$('#endDate').val('');

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

//값 전달하는 곳
function postToDetailPage(data) {
	// 폼 생성
	var form = $('<form>', {
		method: 'POST',
		action: '/admin/banners/details'  // 서버의 상세 페이지 URL로 설정
	});

	// 데이터를 숨김 필드로 추가
	form.append($('<input>', { type: 'hidden', name: 'member_id', value: data.member_id }));

	// 폼을 body에 추가하고 제출
	form.appendTo('body').submit();
}

datepicker("startDate", "endDate");
