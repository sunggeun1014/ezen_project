var table;
$(document).ready(function () {
    // 테이블이 이미 초기화되어 있는지 확인
    // 문의내역 테이블
    if (!$.fn.DataTable.isDataTable('#inquiries')) {
        table = $('#inquiries').DataTable({
            "pageLength": 5,
            "paging": true,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            columnDefs:
                [
                    {targets: 0, orderable: false}, // 첫 번째 컬럼(체크박스 컬럼)에서 정렬 비활성화
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
            order: [[3, 'asc']],
            ajax: {
                url: '/admin/home/inquiries/json',
                dataSrc: 'data',
            },
            columns: [
                {
                    data: null,  // 이 컬럼은 데이터베이스에서 가져오는 데이터를 사용하지 않음
                    render: function (data, type, row, meta) {
                        return meta.row + 1;  // meta.row는 0부터 시작하는 행 인덱스이므로 +1 해줌
                    },
                    orderable: false,  // 이 컬럼에 대해 정렬을 비활성화
                },
                {
                    data: 'inquiry_title',
                    width: '150px',
                    className: 'text-eclipse',
                    render: function (data, type, row) {
                        const inquiryNum = row.inquiry_num; // inquiry_num 가져오기
                        const url = '/admin/inquiries/detail?inquiry_num=' + encodeURIComponent(inquiryNum); // URL 생성

                        // 제목이 10자 이상일 경우 줄여서 표시
                        if (data.length > 10) {
                            return '<a href="' + url + '" class="book-title-link" data-menu-link="inquiry">' + data.substring(0, 10) + '...' + '</a>';
                        } else {
                            return '<a href="' + url + '" class="book-title-link" data-menu-link="inquiry">' + data + '</a>';
                        }
                    }
                },
                {
                    data: 'inquiry_type',
                    width: '80px'
                },
                {
                    data: 'inquiry_write_date',
					render: function(data, type, row) {
				        if (type === 'display' || type === 'filter') {
							if(!data) {
								return "-";
							} else {
								const date = new Date(data);
							    const year = date.getFullYear();
							    const month = String(date.getMonth() + 1).padStart(2, '0');
							    const day = String(date.getDate()).padStart(2, '0');
								
							    return `${year}. ${month}. ${day}.`;
							}
				        }
						
				        return data;
				    }
                },
                {
                    data: 'inquiry_answer_status',
                    render: function (data, type, row) {
                        var color = data === '미완료' ? '#F69E47' : (data === '처리완료' ? '#10A142' : 'black');
                        return '<span style="color: ' + color + ';">' + data + '</span>';
                    }
                },
            ],
            "info": false,
            dom: 't',
            columnDefs: [
                {
                    targets: "_all",
                    orderable: false
                }
            ],
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
            rowCallback: function (row, data, index) {
                // 화면에 표시되는 열을 1부터 시작하도록 변경
                var pageInfo = table.page.info();
                var rowIndex = pageInfo.start + index + 1;
                $('td:eq(0)', row).html(rowIndex);

                $(row).attr('data-id', data.inquiry_num); // 각 행에 고유 ID 설정
            },
        });
    }

    // 입출고내역 테이블
    if (!$.fn.DataTable.isDataTable('#stock')) {
        table = $('#stock').DataTable({
            "pageLength": 5,
            "paging": true,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            columnDefs:
                [
                    {targets: "_all", orderable: false}, // 첫 번째 컬럼(체크박스 컬럼)에서 정렬 비활성화
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
            order: [[3, 'desc']],
            ajax: {
                url: '/admin/home/stocks/json',
                // dataSrc: 'data',
                dataSrc: function (response) {
                    return response.data || [];
                }
            },
            columns: [
                {
                    data: null,  // 이 컬럼은 데이터베이스에서 가져오는 데이터를 사용하지 않음
                    render: function (data, type, row, meta) {
                        return meta.row + 1;  // meta.row는 0부터 시작하는 행 인덱스이므로 +1 해줌
                    },
                    orderable: false,  // 이 컬럼에 대해 정렬을 비활성화
                },
                {
                    data: 'log_transaction_num',
                    render: function (data, type, row) {
                        return `<a href="/admin/inventoryLog/detail?log_transaction_num=${data}" data-menu-link="invenLog" class="order-detail-link">${data}</a>`;
                    }
                },
                {
                    data: 'log_transaction_status',
                    createdCell: function (td, cellData) {
                        if (cellData === "반품입고" || cellData === "입고") {
                            $(td).addClass('text-color-blue');
                        } else {
                            $(td).addClass('text-color-green');
                        }
                    }
                },
                {
                    data: 'log_operation_date',
					render: function(data, type, row) {
				        if (type === 'display' || type === 'filter') {
							if(!data) {
								return "-";
							} else {
								const date = new Date(data);
							    const year = date.getFullYear();
							    const month = String(date.getMonth() + 1).padStart(2, '0');
							    const day = String(date.getDate()).padStart(2, '0');
								
							    return `${year}. ${month}. ${day}.`;
							}
				        }
						
				        return data;
				    }
                },

            ],
            info: false,
            dom: 't',
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

            rowCallback: function (row, data, index) {
                // 화면에 표시되는 열을 1부터 시작하도록 변경
                var pageInfo = table.page.info();
                var rowIndex = pageInfo.start + index + 1;
                $('td:eq(0)', row).html(rowIndex);

                // $(row).attr('data-id', data.inquiry_num); // 각 행에 고유 ID 설정
            },
        });
    }
});