var table;
$(document).ready(function() {

    table = $('#member').DataTable({
        ajax: {
            url: '/admin/members/json'
        },
        
        columnDefs: [
            { targets: '_all', className: 'dt-center' }
        ],
        
        order: [[5, 'desc']], 
        
        columns: [
            {
                data: null,
                render: function() {
                    return '';
                },
                orderable: true,
                searchable: false
            },
            { data: 'member_name' },
            { 
                data: 'member_id',
                render: function(data, type, row) {
                    const url = '/admin/members/detail/' + encodeURIComponent(data);
                    return '<a href=' + url + ' class="member-id-link" data-menu-link="memebers" style="color: inherit; text-decoration: underline; cursor: pointer;">' + data + '</a>';
                }
            },
            { data: 'member_email' },
            { data: 'member_phoneNo' },
            {
                data: 'member_date',
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
            }

        ],
		drawCallback: function(settings) {
            let api = this.api();
		    let filteredRecords = api.rows({ search: 'applied' }).count();

		    $('#total-row').text(`총 ${filteredRecords}건`);
							
            api.column(0, { page: 'current' }).nodes().each(function(cell, i) {
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
    
    $('#searchButton').on('click', function() {
		table.search('').columns().search('').draw();
		
        var selectedColumn = $('#searchColumn').val();
        var keyword = $('#searchKeyword').val();

        table.column(selectedColumn).search(keyword);

        table.draw();
    });

    $('#searchKeyword').on('keypress', function(event) {
        if (event.key === 'Enter') {
            $('#searchButton').click();
        }
    });
    
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var startDate = $('#startDate').val();
            var endDate = $('#endDate').val();
            var membersDate = data[5]; 
			
            var start = startDate ? new Date(startDate + "T00:00:00+09:00") : null;
            var end = endDate ? new Date(endDate + "T23:59:59+09:00") : null;
            var memberDate = new Date(membersDate);

            if (isNaN(memberDate)) {
                return false;
            }
			
            memberDate.setHours(0,0,0,0);
            memberDate.setMinutes(0,0,0,0);
            

            if ((start === null && end === null) ||
                (start === null && memberDate <= end) ||
                (start <= memberDate && end === null) ||
                (start <= memberDate && memberDate <= end)) {
                return true;
            }
            return false;
        }
    );
    
    document.querySelectorAll('.input-box input').forEach(function(input) {
        input.addEventListener('focus', function() {
            this.value = '';
        });
    });

    document.querySelector('[onclick="resetFilters()"]').addEventListener('click', resetFilters);
    
    document.querySelectorAll('.date-option').forEach(function(button) {
        button.addEventListener('click', function() {
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
    $('#searchColumn').val('2');

    $('#startDate').val('');
    $('#endDate').val('');
	$(".date-option").removeClass("active");

    table.search('').columns().search('').draw();

    table.draw();
}

function setActive(element) {
    var options = document.querySelectorAll('.date-option');
    options.forEach(function(option) {
        option.classList.remove('active');
    });

    element.classList.add('active');
}
