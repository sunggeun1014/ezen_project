$(document).ready(function() {
	datepicker("startDate", "endDate");
	const maxByteLength = 1000;

	updateCharCount();

	function getByteLength(str) {
		let byteLength = 0;
		for (let i = 0; i < str.length; i++) {
			let charCode = str.charCodeAt(i);
			if (charCode <= 0x007F) {
				byteLength += 1;
			} else if (charCode <= 0x07FF) {
				byteLength += 2;
			} else {
				byteLength += 3;
			}
		}
		return byteLength;
	}

	$("#editor").on("input", function() {
		updateCharCount();
	});

	$("#editor").on("keydown", function(e) {
		if (e.key === "Enter") {
			e.preventDefault(); 

			const selection = window.getSelection();
			if (selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const br = document.createElement("br");

				range.deleteContents();
				range.insertNode(br);

				range.setStartAfter(br);
				range.setEndAfter(br);
				selection.removeAllRanges(); 
				selection.addRange(range); 
			}
		}
	});

	function updateCharCount() {
	    let editor = $("#editor");

	    let contentClone = editor.clone();
	    contentClone.find("img").remove(); 
	    let textContent = contentClone.text();

	    let byteLength = getByteLength(textContent);

	   
	    if (byteLength > maxByteLength) {
	        while (getByteLength(textContent) > maxByteLength) {
	            textContent = textContent.slice(0, -1); 
	        }

	        
	        editor.contents().filter(function() {
	            return this.nodeType === Node.TEXT_NODE;
	        }).each(function() {
	            let currentText = $(this).text();  
	            let newText = textContent.slice(0, currentText.length);  
	            $(this).text(newText);  
	            textContent = textContent.slice(currentText.length);
	        });
	    }

	   
	    $("#charCount").text(byteLength);

	}

	const editor = document.getElementById('editor');
	let tempImages = [];
	let imageFiles = [];

	editor.addEventListener('dragover', (event) => {
		event.preventDefault();
		editor.classList.add('dragover');
	});

	editor.addEventListener('dragleave', () => {
		editor.classList.remove('dragover');
	});

	editor.addEventListener('drop', (event) => {
		event.preventDefault();
		editor.classList.remove('dragover');
		const files = event.dataTransfer.files;
		if (files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file.type.startsWith('image/')) {

					const reader = new FileReader();
					reader.onload = function(e) {
						const img = document.createElement('img');
						img.src = e.target.result;
						img.style.maxWidth = '100%';
						img.style.height = 'auto';
						editor.appendChild(img);

						tempImages.push(img);
						imageFiles.push(file);

						placeCaretAtEnd(editor);
					};
					reader.readAsDataURL(file);
				} else {
					getCheckModal('이미지 파일만 지원됩니다.');
					return;
				}
			}
		}
	});

	function placeCaretAtEnd(el) {
		el.focus();
		if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			const range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false); 
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

	document.getElementById('save-button').addEventListener('click', () => {
		const formData = new FormData();
		const noticeNum = $('#notice_num').val();
		const noticeTitle = $('#notice-title').val();
		const noticeStartDate = $('#startDate').val() || new Date().toLocaleDateString('en-cA');
		const noticeEndDate = $('#endDate').val() || '2099-12-31';
		const startDateTimestamp = convertToTimestamp(noticeStartDate);
		const endDateTimestamp = convertToTimestamp(noticeEndDate);
		const noticeVisible = document.querySelector('input[name="order_status"]:checked').value;
		const noticeStatus = noticeVisible === 'exposed' ? '01' : '02';
		let noticeContent = editor.innerHTML;

		const collator = new Intl.Collator('ko');

		if (collator.compare(noticeContent.trim(), '여기에 텍스트를 입력하거나 이미지를 드래그 앤 드롭하세요...') === 0 || !noticeContent.trim()) {
			getCheckModal('내용을 입력해주세요.');
			return;
		} else if (!noticeTitle.trim()) {
			getCheckModal('공지글 제목을 입력해주세요.');
			return;
		}

		if (imageFiles.length > 0) {
			const formDataForImages = new FormData();
			imageFiles.forEach((file) => {
				formDataForImages.append('images', file);
			});

			fetch('/admin/notice/imageUrl', {
				method: 'POST',
				body: formDataForImages
			})
				.then(response => response.json())
				.then(data => {
					if (data.success && data.imageUrls) {
						data.imageUrls.forEach((imageUrl, index) => {
							const oldSrc = tempImages[index].src;
							if (!oldSrc.startsWith('/images/notice/')) {
								tempImages[index].src = imageUrl;
								noticeContent = noticeContent.replace(oldSrc, imageUrl);
							}
						});

						handleNoticeSaveOrUpdate(noticeNum, formData, noticeTitle, noticeContent, startDateTimestamp, endDateTimestamp, noticeStatus);
					} else {
						getCheckModal('이미지 저장 실패');
						return;
					}
				})
				.catch(error => {

				});
		} else {
			handleNoticeSaveOrUpdate(noticeNum, formData, noticeTitle, noticeContent, startDateTimestamp, endDateTimestamp, noticeStatus);
		}
	});

	function handleNoticeSaveOrUpdate(noticeNum, formData, noticeTitle, noticeContent, startDate, endDate, noticeStatus) {
		if (noticeNum) {
			updateNotice(formData, noticeNum, noticeTitle, noticeContent, startDate, endDate, noticeStatus);
		} else {
			saveNotice(formData, noticeTitle, noticeContent, startDate, endDate, noticeStatus);
		}
	}

	function saveNotice(formData, noticeTitle, noticeContent, startDate, endDate, noticeStatus) {
		formData.append('notice_title', noticeTitle);
		formData.append('notice_content', noticeContent);
		formData.append('notice_end_date', endDate);
		formData.append('notice_start_date', startDate);
		formData.append('notice_visible', noticeStatus);

		if (imageFiles.length > 0) {
			imageFiles.forEach((image) => {
				formData.append('images', image);
			});
		}

		fetch('/admin/notice/save', {
			method: 'POST',
			body: formData
		})
			.then(response => {
				if (response.ok) {
					showSuccessModal('공지사항 저장되었습니다.');
					return;
				} else {
					getCheckModal('공지사항 저장 중 오류가 발생했습니다.');
					return;
				}
			});
	}

	function updateNotice(formData, noticeNum, noticeTitle, noticeContent, startDate, endDate, noticeStatus) {
		formData.append('notice_num', noticeNum);
		formData.append('notice_title', noticeTitle);
		formData.append('notice_content', noticeContent);
		formData.append('notice_end_date', endDate);
		formData.append('notice_start_date', startDate);
		formData.append('notice_visible', noticeStatus);

		if (imageFiles.length > 0) {
			imageFiles.forEach((image) => {
				formData.append('images', image);
			});
		}

		fetch('/admin/notice/update', {
			method: 'POST',
			body: formData
		})
			.then(response => {
				if (response.ok) {
					showSuccessModal('공지사항이 수정되었습니다.');
				} else {
					getCheckModal('공지사항 수정 중 오류가 발생했습니다.');
				}
			});
	}


	editor.addEventListener('click', () => {
		if (editor.innerText === '여기에 텍스트를 입력하거나 이미지를 드래그 앤 드롭하세요...') {
			editor.innerText = '';
			updateCharCount();
		}
	});

	function convertToTimestamp(dateString) {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = '00';
		const minutes = '00';
		const seconds = '00';

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	function showSuccessModal(msg) {
		getCheckModal(msg);

		$(document).on('click', '#confirm-delete', function() {
			window.location.href = '/admin/notice/list';
		});
	}
});
