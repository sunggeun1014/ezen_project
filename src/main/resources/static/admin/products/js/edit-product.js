// 날짜선택
$(document).ready(function() {
	datepicker("singleDate");
	
	checkEditForm();
	
	previewImg();
	
	categoryCheck();
	
	textLengthCheck($("#book_intro"), 4000);
});

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
	if(bookCountryType == '01') {
		result = $("#national").val(); 
	} else {
		result = $("#foreign").val();
	}
	
    return result;
}

function checkEditForm() {
    const editForm = document.querySelector("#edit-form");
    const bookISBN = document.querySelector("#book_isbn");
    const inputName = document.querySelector("#book_name");
    const inputPublisher = document.querySelector("#book_publisher");
    const inputAuthor = document.querySelector("#book_author");
    const inputPublishDate = document.querySelector("#singleDate");
    const inputPrice = document.querySelector("#book-price");
    const inputQty = document.querySelector("#book-qty");
    const inputFile = document.querySelector("#input-file");
    const thumbnailChanged = document.querySelector("#preview").src;
    const inputIntro = document.querySelector("#book_intro");

    editForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (inputName.value === "") {
            getCheckModal("책제목을 입력해주세요");
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
            getCheckModal("발행날짜를 입력해주세요");
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
            return;
        }

        if (inputQty.value === "") {
            getCheckModal("수량을 입력해주세요");
            return;
        }

        const stateValue = getStateValue();
        if (!stateValue) {
            getCheckModal("상품 상태를 선택해주세요");
            return;
        }

        if (!thumbnailChanged && !inputFile.value) {
            getCheckModal("파일을 첨부해주세요");
            return;
        }

        if (inputIntro.value === "") {
            getCheckModal("책 소개를 입력해주세요");
            return;
        }

        // 모든 유효성 검사를 통과한 경우
        if (bookISBN && bookISBN.value.length > 0) {
            getConfirmModal("수정하시겠습니까?", function() {
                editForm.submit(); // 폼 제출
            });
        } else {
            getErrorModal("ERROR");
        }
    });
}

function datepicker(elementId) {
    flatpickr(`#${elementId}`, {
        dateFormat: "Y-m-d",
        enableTime: false,
        defaultDate: null,
        allowInput: true
    });
}

function previewImg() {
    const inputFile = document.getElementById('input-file');
    const preview = document.getElementById('preview');

    inputFile.addEventListener('change', function (event) {
        var input = event.target;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                preview.src = e.target.result;
            }

            reader.readAsDataURL(input.files[0]);
        }
    });
}

function categoryCheck() {
	$("input[name='book_country_type']").on("change", function() {
		if(this.value === '01') {
			$("#national").css({ "display": "block" }); 
			$("#foreign").css({ "display": "none" });
			$(".default").prop("selected", true); 
		} else {
			$("#national").css({ "display": "none" }); 
			$("#foreign").css({ "display": "block" });
			$(".default").prop("selected", true);
		} 
	});
}
