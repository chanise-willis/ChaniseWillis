function calculateLoanPayments(){
    let loanAmountInput = parseFloat(parseFloat(document.getElementById("loanAmount1").value).toFixed(2));
    let interestRateInput = parseFloat(parseFloat(document.getElementById("interestRate1").value).toFixed(4));    
    let numMonthsInput = parseFloat(parseInt(document.getElementById("numMonths1").value));

    let interestRateDecimalPerMonth = (interestRateInput/100)/12;
    let calculatedPayments = (loanAmountInput*interestRateDecimalPerMonth)/(1-Math.pow((1+interestRateDecimalPerMonth),-numMonthsInput));
    let totalPayments = calculatedPayments*numMonthsInput;
    document.getElementById("calculatedPayments").innerHTML = parseFloat(calculatedPayments.toFixed(2));
    //document.getElementById("totalAmountPayed1").innerHTML = parseFloat(totalPayments.toFixed(2));
}
function calculateNumberMonths(){
    let loanInput = parseFloat(parseFloat(document.getElementById("loanAmount2").value).toFixed(2));
    let interestRateInput = parseFloat(parseFloat(document.getElementById("interestRate2").value).toFixed(4));    
    let paymentsInput = parseFloat(parseFloat(document.getElementById("Payments2").value).toFixed(2));  
    
    let interestRateDecimalPerMonth = (interestRateInput/100)/12;
    //Math.log() has a base of e so I had to mess with the formula a little to get it into natural log
    let base = 1 + interestRateDecimalPerMonth;
    let numb = paymentsInput / (paymentsInput-(loanInput * interestRateDecimalPerMonth));
    let numMonths = Math.log(numb)/Math.log(base);
    document.getElementById("calculatedNumMonths").innerHTML = numMonths;
}
function calculateTotalInterest(){
    let loanInput = parseFloat(parseFloat(document.getElementById("loanAmount3").value).toFixed(2));
    let interestRateInput = parseFloat(parseFloat(document.getElementById("interestRate3").value).toFixed(4));    
    let paymentsInput = parseFloat(parseFloat(document.getElementById("Payments3").value).toFixed(2)); 

    let interestRateDecimalPerMonth = (interestRateInput/100)/12;
    let currentBalance = loanInput;

    let months = 0;
    let totalInterest = 0;
    let totalPayment = 0;

    do{
        let {paidTowardInterest, paidTowardPrincipal, endBalance, payment} = calcAllfields(currentBalance, paymentsInput, interestRateDecimalPerMonth);
        currentBalance = endBalance;
        totalInterest += paidTowardInterest;
        totalPayment += payment;        
        months++;  
    } while(currentBalance > 0);
    document.getElementById("totalNumMonths3").innerHTML = months;
    document.getElementById("totalInterest3").innerHTML = parseFloat(totalInterest.toFixed(2));
    document.getElementById("totalAmountPayed3").innerHTML = parseFloat(totalPayment.toFixed(2));
}
function calcAllfields(beginingBalance, payment, interest){    
    let paidTowardInterest = parseFloat((beginingBalance * interest).toFixed(2));
    if(beginingBalance < payment){
        payment = beginingBalance + paidTowardInterest;
    }
    let paidTowardPrincipal = payment - paidTowardInterest;
    let endBalance = beginingBalance - paidTowardPrincipal;
    return{paidTowardInterest, paidTowardPrincipal, endBalance, payment};
}