var table;
$(document).ready(function () {

    table = $('#manager').DataTable({
        ajax: {
            url: '/admin/managers/json',
            dataSrc: function (json) {
                $('#total-row').text('총 ' + json.size + '건');
                return json.data;
            }
        },

        columnDefs: [
            {targets: '_all', className: 'dt-center'}
        ],

        order: [[8, 'desc']], 


        columns: [
            {
                data: null,
                render: function () {
                    return '<input type="checkbox" class="data-check row-checkbox"><label class="data-check-label"></label>';
                },
                orderable: false,
            },
            {
                data: null,
                render: function () {
                    return '';
                },
                orderable: false,
                searchable: false
            },
            {data: 'manager_name'},
            {
                data: 'manager_id',
                render: function (data) {

                    const url = '/admin/managers/detail/' + encodeURIComponent(data);

                    return '<a href=' + url + ' class="manager-id-link" data-menu-link="inventoryLog" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
                }
            },
            {data: 'manager_email'},
            {
                data: 'manager_dept',
                render: function (data) {
                    if (data === '01') {
                        return '물류팀';
                    } else if (data === '02') {
                        return '운영팀';
                    } else {
						return '인사팀';
					}
                }
            },
            {data: 'manager_phoneNo'},
            {
                data: 'manager_addr',

                render: function (data) {

                    if (data.length > 10) {
                        return data.substring(0, 10) + '...';
                    } else {

                        return data;
                    }

                }
            },
            {
                data: 'manager_join_date',
                render: function (data, type) {
                    if (type === 'display' || type === 'filter') {
                        var date = new Date(data);
                        var year = date.getFullYear();
                        var month = String(date.getMonth() + 1).padStart(2, '0');
                        var day = String(date.getDate()).padStart(2, '0');
                        var formattedDate = `${year}-${month}-${day}`;
                        return formattedDate;
                    }
                    return data;
                }
            }
        ],

        drawCallback: function (settings) {
			let api = this.api();
		    let filteredRecords = api.rows({ search: 'applied' }).count();

		    $('#total-row').text(`총 ${filteredRecords}건`);
			
            api.column(1, {page: 'current'}).nodes().each(function (cell, i) {
                var pageStart = api.settings()[0]._iDisplayStart;
                $(cell).html(pageStart + i + 1);
            });
        },

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
        }


    });

    $('#select-all').on('click', function () {
        const rows = $('#manager').DataTable().rows({'search': 'applied'}).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    $('#manager tbody').on('change', '.row-checkbox', function () {
        const $row = $(this).closest('tr'); 

        if (this.checked) {
            $row.addClass('selected-row');
        } else {
            $row.removeClass('selected-row');
        }

        if ($('.row-checkbox:checked').length === $('.row-checkbox').length) {
            $('#select-all').prop('checked', true);
        } else {
            $('#select-all').prop('checked', false);
        }
    });

    $('#select-all').on('change', function () {
        const isChecked = $(this).prop('checked'); 

        $('.row-checkbox').prop('checked', isChecked);

        if (isChecked) {
            $('#manager tbody tr').addClass('selected-row'); 
        } else {
            $('#manager tbody tr').removeClass('selected-row');
        }
    });


    $('#change-button').on('click', function () {
        var selectedIds = [];
        var selectedDept = $('#searchDept').val();  

        $('#manager').DataTable().$('.row-checkbox:checked').each(function () {
            var rowData = $('#manager').DataTable().row($(this).closest('tr')).data();
            selectedIds.push(rowData.manager_id); 

        });

        if (selectedIds.length > 0) {
            getConfirmModal(`${selectedIds.length}개의 항목을 변경하시겠습니까?`, deleteBtn);


        } else {
            getCheckModal(`변경할 항목을 선택해 주세요.`);


            modal.style.display = "block";
        }
    });

    const deleteBtn = function () {
        var selectedIds = [];
        var selectedDept = $('#searchDept').val();  

        $('#manager').DataTable().$('.row-checkbox:checked').each(function () {
            var rowData = $('#manager').DataTable().row($(this).closest('tr')).data();
            selectedIds.push(rowData.manager_id);

        });

        $.ajax({
            url: '/admin/managers/update/dept', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                managerId: selectedIds,
                managerDept: selectedDept
            }),  
            success: function (response) {
                getCheckModal(`변경이 완료 되었습니다.`);
                $('#manager').DataTable().ajax.reload();  
            },
            error: function (error) {
                getCheckModal(`변경중 오류가 발생 했습니다.`);

            }
        });
    };


  
	$('#searchButton').on('click', function () {
	    table.search('').columns().search('').draw();

	    let selectedColumn = $('#searchColumn').val();
	    let keyword = $('#searchKeyword').val();
	    
	    table.column(selectedColumn).search(keyword).draw();
	});

    $('#searchKeyword').on('keypress', function (event) {
        if (event.key === 'Enter') {
            $('#searchButton').click();
        }
    });

    $.fn.dataTable.ext.search.push(
	    function (settings, data, dataIndex) {
	        var startDate = $('#startDate').val();
	        var endDate = $('#endDate').val();
	        var managerDate = new Date(data[8]);  
	
	        if (startDate || endDate) {
	            var start = startDate ? new Date(startDate + 'T00:00:00') : null;
	            var end = endDate ? new Date(endDate + 'T23:59:59') : null;
	
	            if ((!start || start <= managerDate) && (!end || managerDate <= end)) {
	                return true;
	            }
	            return false;
	        }
	
	        return true;  
	    }
	);


    document.querySelectorAll('.input-box input').forEach(function (input) {
        input.addEventListener('focus', function () {
            this.value = '';
        });
    });

    document.querySelector('[onclick="resetFilters()"]').addEventListener('click', resetFilters);

    document.querySelectorAll('.date-option').forEach(function (button) {
        button.addEventListener('click', function () {
            setActive(this); 
        });
    });

    datepicker("startDate", "endDate");
});

function setToday() {
    var today = new Date();
    var startDate = new Date(today.setHours(0, 0, 0, 0)); // 오늘 0시 0분 0초
    var endDate = new Date(today.setHours(23, 59, 59, 999)); // 오늘 23시 59분 59초

    $('#startDate').val(startDate.toISOString().split('T')[0]);
    $('#endDate').val(endDate.toISOString().split('T')[0]).trigger('change');
}

function setDateRange(days) {
    var endDate = new Date(); 
    var startDate = new Date(); 
    startDate.setDate(startDate.getDate() - days); 

    endDate.setHours(23, 59, 59, 999); 

    startDate.setHours(0, 0, 0, 0); 

    $('#startDate').val(startDate.toISOString().split('T')[0]);
    $('#endDate').val(endDate.toISOString().split('T')[0]).trigger('change');
}


function resetFilters() {
    $('#searchKeyword').val('');
    $('#searchColumn').val('3');

    $('#startDate').val('');
    $('#endDate').val('');
    $(".date-option").removeClass("active");

    table.search('').columns().search('').draw(); 
}

function setActive(element) {
    var options = document.querySelectorAll('.date-option');
    options.forEach(function (option) {
        option.classList.remove('active');
    });

    element.classList.add('active');
}

function previewImage(event) {
    var input = event.target;

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var preview = document.getElementById('preview');
            preview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

