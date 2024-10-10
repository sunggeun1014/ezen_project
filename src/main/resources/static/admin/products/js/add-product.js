var table;
$(document).ready(function () {
    // 테이블이 이미 초기화되어 있는지 확인
    if (!$.fn.DataTable.isDataTable('#inventory')) {
        table = $('#inventory').removeAttr('width').DataTable({
            autoWidth: false,
            "pageLength": 5,
            "paging": true,
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
            order: [[0, 'asc']], // 리뷰 작성 날짜 컬럼을 최신 날짜순으로 정렬 (내림차순)
            ajax: {
                url: '/admin/products/inventory/json',
                dataSrc: 'data',
            },
            columns: [
                {
                    data: null,  // 이 컬럼은 데이터베이스에서 가져오는 데이터를 사용하지 않음
                    orderable: false,  // 이 컬럼에 대해 정렬을 비활성화
                },
                {
                    data: 'inv_isbn',
                    width: '200px',
                    className: 'select-td'
                },
                {
                    data: 'inv_title',
                    className: 'text-ellipsis',
                },
                {
                    data: 'inv_qty',
                },
                {
                    data: 'zone_num',
                },

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
            drawCallback: function (settings) {
                let api = this.api();
                api.column(0, {page: 'current'}).nodes().each(function (cell, i) {
                    let pageStart = api.settings()[0]._iDisplayStart;
                    $(cell).html(pageStart + i + 1);
                });
            }
        });
    }

    // 테이블 행 클릭 시 book_isbn, book_name 입력 필드에 값 설정
    getBookInfo();


    // 책 검색 입력 필드에 입력 시 실시간으로 테이블 검색 필터링 적용
    // searchWord();

    // 날짜선택
    datepicker("singleDate");

    // 재고리스트 출력
    showInvenList();

    // 폼전송
    checkForm();

    // 이미지 보이도록
    previewImg();

    // 카테고리 노출 세분화
    categoryCheck();
});

let selectedISBN = null;
let invQty = null;

function getBookInfo() {
    $('#inventory tbody').on('click', 'tr', function () {
        var data = table.row(this).data(); // 클릭한 행의 데이터 가져오기

        // inv_isbn과 inv_title을 각각 input에 채워 넣음
        $('input[name="book_isbn"]').val(data.inv_isbn);
        $('input[name="book_name"]').val(data.inv_title);
        $('input[name="book_qty"]').val(data.inv_qty);

        selectedISBN = data.inv_isbn;
        invQty = data.inv_qty;

        $('#search-book-modal').removeClass('on');
        enableScroll();
    });
}

function getCountryValue() {
    const countryRadio = document.querySelector('input[name="book_country_type"]:checked');
    return countryRadio ? countryRadio.value : null;
}

function getStateValue() {
    const stateRadio = document.querySelector('input[name="book_state"]:checked');
    return stateRadio ? stateRadio.value : null;
}

function getCategoryValue() {
    const bookCountryType = $("input[name='book_country_type']:checked").val();

    let result;
    if (bookCountryType == '01') {
        result = $("#national").val();
    } else {
        result = $("#foreign").val();
    }

    return result;
}


function checkForm() {
    const addForm = document.getElementById("add-form");
    const inputISBN = document.querySelector("#book_isbn");
    const inputName = document.querySelector("#book_name");
    const inputPublisher = document.querySelector("#book_publisher");
    const inputAuthor = document.querySelector("#book_author");
    const inputPublishDate = document.querySelector("#singleDate");
    const inputPrice = document.querySelector("#book-price");
    const inputQty = document.querySelector("#book-qty");
    const inputFile = document.querySelector("#input-file");
    const inputIntro = document.querySelector("#book_intro");

    addForm.addEventListener("submit", function (event) {
        event.preventDefault(); // 폼 제출 중단

        if (inputISBN.value === "") {
            getCheckModal("ISBN을 입력해주세요");
            inputISBN.focus();
            return;
        }
        // ISBN 중복 체크를 위한 AJAX 요청
        $.ajax({
            url: '/admin/products/checkISBN',  // 서버의 ISBN 중복 체크 엔드포인트
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({book_isbn: inputISBN.value}),
            success: function (response) {
                if (response.exists) {
                    if (response.deleteState === '02') {
                        getConfirmModal("이미 등록된 ISBN입니다. 수정하시기 바랍니다.", function () {
                            // 페이지 이동
                            location.href = `/admin/products/detail?book_isbn=${inputISBN.value}`;
                        });
                    } else {
                        // 중복된 ISBN인 경우
                        getCheckModal("이미 존재하는 ISBN입니다.");
                        location.href = `/admin/products/detail?book_isbn=${inputISBN.value}`;
                    }
                } else {
                    if (!response.isInvIsbn) {
                        getCheckModal("해당 ISBN은 재고에 존재하지 않는 상품 입니다.", inputISBN);
                        return;
                    }

                    // 중복되지 않은 경우 나머지 검사를 진행
                    if (inputName.value === "") {
                        getCheckModal("책 제목을 입력해주세요");
                        inputName.focus();
                        return;
                    }

                    if (inputPublisher.value === "") {
                        getCheckModal("출판사를 입력해주세요");
                        inputPublisher.focus();
                        return;
                    }

                    if (inputAuthor.value === "") {
                        getCheckModal("저자를 입력해주세요");
                        inputAuthor.focus();
                        return;
                    }

                    if (inputPublishDate.value === "") {
                        getCheckModal("발행 날짜를 입력해주세요");
                        inputPublishDate.focus();
                        return;
                    }

                    const countryValue = getCountryValue();
                    if (!countryValue) {
                        getCheckModal("국내/국외를 선택해 주세요.");
                        return;
                    }

                    const categoryValue = getCategoryValue();
                    if (!categoryValue) {
                        getCheckModal("카테고리를 선택해 주세요");
                        return;
                    }

                    if (inputPrice.value === "") {
                        getCheckModal("가격을 입력해주세요");
                        inputPrice.focus();
                        return;
                    }

                    if (inputQty.value === "") {
                        getCheckModal("수량을 입력해주세요");
                        inputQty.focus();
                        return;
                    }

                    if (inputQty.value > invQty) {
                        getCheckModal("재고의 수량보다 많습니다")
                        inputQty.focus();
                        return;
                    }

                    const stateValue = getStateValue();
                    if (!stateValue) {
                        getCheckModal("상품 상태를 선택해주세요");
                        return;
                    }

                    if (!inputFile.value) {
                        getCheckModal("파일을 첨부해주세요");
                        return;
                    }

                    if (inputIntro.value === "") {
                        getCheckModal("책 소개를 입력해주세요");
                        inputIntro.focus();
                        return;
                    }

                    getConfirmModal("등록하시겠습니까?", function () {
                        addForm.submit();
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getErrorModal("ERROR");
            }
        });
    });
}


let scrollPosition = 0;

function disableScroll() {
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
}

function enableScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollPosition);
}

function searchWord() {
    $('#search-keyword').on('keypress', function () {
        searchHandler(this.value)
    });

    $('#searchButton').on('click', function () {
        searchHandler($('#search-keyword').val())
    })

    function searchHandler(value) {
        // 검색어 없으면 전체 검색
        if (value.trim() === "") {
            table.search('').draw();
        }

        if ($.isNumeric(value)) {
            table.column(1).search(value).draw();  // ISBN 검색
        } else {
            // 숫자가 아니면 제목 열에서 검색
            table.column(2).search(value).draw();  // 제목 검색
        }
    }
}


function showInvenList() {
    const searchBox = document.querySelector(".search-container")
    const searchInput = document.getElementById("search-keyword")
    const bookModal = document.querySelector("#search-book-modal")
    const closeBtn = document.querySelector("#close-btn")
    const inputValue = searchInput.value.trim();

    searchBox.addEventListener("click", function () {
        bookModal.classList.add("on");
        disableScroll();

        searchWord();
        // DataTables 검색 기능 호출 (검색어에 해당하는 항목을 필터링)
        table.search(inputValue).draw();
    });

    closeBtn.addEventListener("click", function () {
        bookModal.classList.remove("on")
        enableScroll();
    })
}

function datepicker(elementId) {
    const dateInput = document.querySelector(`#${elementId}`);

    flatpickr(dateInput, {
        dateFormat: "Y-m-d",
        enableTime: false,
        defaultDate: null,
        allowInput: true,
        onValueUpdate: function (selectedDates, dateStr, instance) {
            // When a date is selected, we validate the format
            validateDateInput(dateInput, dateStr);
        }
    });

    // 사용자가 input에 데이트값을 입혁할 때 정규표현식 체크
    dateInput.addEventListener('input', function () {
        validateDateInput(dateInput, dateInput.value);
    });
    dateInput.addEventListener('blur', function () {
        validateDateInput(dateInput, dateInput.value);
    });
}

function validateDateInput(inputElement, value) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(value)) {
        inputElement.setCustomValidity('날짜 형식은 yyyy-mm-dd 입니다.');
    } else {
        inputElement.setCustomValidity('');
    }
}


function previewImg() {
    const inputFile = document.getElementById('input-file');
    const preview = document.getElementById('preview');
    const icon = document.querySelector('.fa-plus');

    inputFile.addEventListener('change', function (event) {
        var input = event.target;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // 미리보기 이미지 설정
                preview.src = e.target.result;
                preview.style.display = 'block'; // 이미지 미리보기를 표시
                icon.style.display = 'none'; // 아이콘 숨기기
            };

            reader.readAsDataURL(input.files[0]);
        }
    });
}

function categoryCheck() {
    $("input[name='book_country_type']").on("change", function () {
        if (this.value === '01') {
            $("#national").css({"display": "block"});
            $("#foreign").css({"display": "none"});
        } else {
            $("#national").css({"display": "none"});
            $("#foreign").css({"display": "block"});
        }
    });
}