document.addEventListener("DOMContentLoaded", function() {
    
	// 결제일로부터 7일이 지나면 반품 버튼 숨김
	const returnButton = document.getElementById("returnButton");
    
    const paymentDateStr = returnButton.dataset.paymentDate;
    const paymentDate = new Date(paymentDateStr); 
    const currentDate = new Date();
    
    const sevenDaysLater = new Date(paymentDate);
    sevenDaysLater.setDate(paymentDate.getDate() + 7);
    
    if (currentDate > sevenDaysLater) {
        returnButton.style.display = "none"; 
    }
});
