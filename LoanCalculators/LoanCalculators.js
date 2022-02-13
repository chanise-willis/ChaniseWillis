var interstRateGob = 0;
$(document).ready(function(){
    //$("#tableDiv").hide();
    //$("#advanceDiv").hide();
    // jQuery methods go here...
    $("#CalcLoanPaymentButton").click(function(){
        //let inserting = 2;
        //let interest = $("#interestRate1").val(inserting);
        calculateLoanPayments();
    });  
});

function roundDecimal(num, places){
    num = parseFloat(parseFloat(num).toFixed(places));
    return Math.abs(num);
}

function validateCurrencey(num){
    if(!Number.isNaN(Number.parseFloat(num)))
    {       
        return roundDecimal(num, 2);        
    }
    return -1;
}

function validatePercent(num){
    if(!Number.isNaN(Number.parseFloat(num)))
    {  
        return roundDecimal(num, 4);
    }
    return -1;
}

function validateMonth(num){
    if(!Number.isNaN(Number.isInteger(num)) && num != "")
    {
        return Math.abs(Number.parseInt(num));
    }
    return -1;
}

function calculateLoanPayments(){
    $("#validation1").text("");
    let loanAmountInput = $("#loanAmount1").val();
    loanAmountInput = validateCurrencey(loanAmountInput);
    let interestRateInput = $("#interestRate1").val();
    interestRateInput = validatePercent(interestRateInput);    
    let numMonthsInput = $("#numMonths1").val();
    numMonthsInput = validateMonth(numMonthsInput);

    if(loanAmountInput < 0 ){             
        $("#validation1").text("Invalid loan ammount. Please type a decimal.");
        return;
    }
    else if(interestRateInput < 0){        
        $("#validation1").text("Invalid interest rate. Please type a decimal.");
        return;
    }
    else if(numMonthsInput < 0){
        $("#validation1").text("Invalid number of months. Please type an integer.");
        return;
    }

    $("#loanAmount1").val(loanAmountInput);
    $("#interestRate1").val(interestRateInput);  
    $("#numMonths1").val(numMonthsInput);

    let interestRateDecimalPerMonth = (interestRateInput/100)/12;
    let calculatedPayments = (loanAmountInput*interestRateDecimalPerMonth)/(1-Math.pow((1+interestRateDecimalPerMonth),-numMonthsInput));
    let totalPayments = calculatedPayments*numMonthsInput;
    $("#calculatedPayments").text(parseFloat(calculatedPayments.toFixed(2)));
    //document.getElementById("totalAmountPayed1").innerHTML = parseFloat(totalPayments.toFixed(2));
}
function calculateNumberMonths(){    
    $("#validation2").text("");
    let loanAmountInput = $("#loanAmount2").val();
    loanAmountInput = validateCurrencey(loanAmountInput);
    let interestRateInput = $("#interestRate2").val();
    interestRateInput = validatePercent(interestRateInput);    
    let paymentsInput = $("#Payments2").val();
    paymentsInput = validateCurrencey(paymentsInput); 
    
    if(loanAmountInput < 0 ){             
        $("#validation2").text("Invalid loan amount. Please type a decimal.");
        return;
    }
    else if(interestRateInput < 0){        
        $("#validation2").text("Invalid interest rate. Please type a decimal.");
        return;
    }
    else if(paymentsInput < 0){
        $("#validation2").text("Invalid payment amount. Please type a decimal.");
        return;
    }
    
    let interestRateDecimalPerMonth = (interestRateInput/100)/12;
    //Math.log() has a base of e so I had to mess with the formula a little to get it into natural log
    let base = 1 + interestRateDecimalPerMonth;
    let numb = paymentsInput / (paymentsInput-(loanAmountInput * interestRateDecimalPerMonth));
    let numMonths = Math.log(numb)/Math.log(base);
    $("#calculatedNumMonths").text(Math.ceil(numMonths));
}
function calculateTotalInterest(){
    $("#validation3").text("");
    $("#validation4").text("");
    let loanAmountInput = $("#loanAmount3").val();
    loanAmountInput = validateCurrencey(loanAmountInput);
    let interestRateInput = $("#interestRate3").val();
    interestRateInput = validatePercent(interestRateInput);    
    let paymentsInput = $("#Payments3").val();
    paymentsInput = validateCurrencey(paymentsInput); 

    if(loanAmountInput < 0 ){             
        $("#validation3").text("Invalid loan amount. Please type a decimal.");
        return;
    }
    else if(interestRateInput < 0){        
        $("#validation3").text("Invalid interest rate. Please type a decimal.");
        return;
    }
    else if(paymentsInput < 0){
        $("#validation3").text("Invalid payment amount. Please type a decimal.");
        return;
    }

    interstRateGob = interestRateInput;
    let interestRateDecimalPerMonth = (interestRateInput/100)/12;
    let currentBalance = loanAmountInput;

    let months = 0;
    let totalInterest = 0;
    let totalPayment = 0;

    //$("#tableDiv").show();
    //$("#advancedDiv").show();
    $("#tableDiv").removeClass("invisible");
    $("#advancedDiv").removeClass("invisible");
    $("tbody").html("");
    //$(".advancedManip").hide();
    $(".advancedManip").addClass("invisible");
    

    do{
        let {paidTowardInterest, paidTowardPrincipal, endBalance, payment} = calcAllTableFields(currentBalance, paymentsInput, interestRateDecimalPerMonth);
        totalInterest += paidTowardInterest;
        totalPayment += payment;        
        months++; 
        $("tbody").append("<tr><td>"+ months + "</td><td>" + currentBalance.toFixed(2) + "</td><td>" + payment.toFixed(2) + "</td><td>" + paidTowardInterest.toFixed(2) + "</td><td>" + paidTowardPrincipal.toFixed(2) + "</td><td>" + endBalance.toFixed(2) + "</td></tr>"); 
        currentBalance = endBalance;
    } while(currentBalance > 0);
    $("#totalNumMonths3").text(months);
    $("#totalInterest3").text(roundDecimal(totalInterest, 2));
    $("#totalAmountPayed3").text(roundDecimal(totalPayment, 2));
}
function calcAllTableFields(beginingBalance, payment, interest){    
    let paidTowardInterest = roundDecimal((beginingBalance * interest), 2);
    if(beginingBalance < payment){
        payment = roundDecimal((beginingBalance + paidTowardInterest), 2);
    }
    let paidTowardPrincipal = roundDecimal((payment - paidTowardInterest), 2);
    let endBalance = roundDecimal((beginingBalance - paidTowardPrincipal), 2);
    return{paidTowardInterest, paidTowardPrincipal, endBalance, payment};
}
function showAdvanced(){
    //$(".advancedManip").show();
    $(".advancedManip").removeClass("invisible");
    let loanTable = document.getElementsByTagName("table");
    //let numRows = document.getElementsByTagName("table")[0].rows.length;
    let startPayD = $("#startPaymentsDate").val();
    let dateNew = new Date(convertMonthYearStringToDate($("#startPaymentsDate").val()));
    for(let row of loanTable[0].rows){
        if(row.cells[0].innerText != "Month"){ 
            //row.cells[0].innerText = dateNew.toLocaleDateString();
            row.cells[0].innerText = (dateNew.getMonth() + 1)+"/"+dateNew.getFullYear();
            dateNew.setMonth(dateNew.getMonth() + 1);
        }
    }

    addMonthlyPayChangeLine();
}
function addMonthlyPayChangeLine(){
    let divIntervals = document.getElementById("startAndEnd");
    let childCount = divIntervals.childElementCount;
    let lastChild = divIntervals.lastElementChild;
    num = 1;
    if(lastChild.id != ""){
        num = lastChild.id + 1;
    }
    $("#startAndEnd").append("<div class='flex-row'>"+
            "<div class='col-3'><input class='startDate form-control' type='month'/></div>"+
            "<div class='col-3'><input class='endDate form-control' type='month'/></div>"+
            "<div class='col-3'><input class='amountChange form-control' type='number'/></div>"+
            "<div class='col-3'><button class='btn btn-secondary btn-sm' onclick='removeMontlyPaymentChangeLine(this)'>Remove</button></div>"+
        "</div>");
    divIntervals = document.getElementById("startAndEnd");
    lastChild = divIntervals.lastElementChild;
}
function removeMontlyPaymentChangeLine(elem){
    /*
    let divIntervals = document.getElementById("startAndEnd");
    divIntervals.removeChild(divIntervals.getElementsByTagName("div"));
    */
    let par = elem.closest("div");
    let parentDiv = elem.parentElement;
    let parentOfParent = parentDiv.parentElement;
    document.getElementById("startAndEnd").removeChild(parentOfParent);
}
function updateTable(){
    $("#validationUpdate").text("");
    let divIntervals = document.getElementById("startAndEnd");
    //let children = divIntervals.children;
    let startDates = divIntervals.getElementsByClassName('startDate');
    let endDates = divIntervals.getElementsByClassName('endDate');
    let intervAmounts = divIntervals.getElementsByClassName('amountChange');
    let loanTable = document.getElementsByTagName("table");
       
    let currentBalance = parseFloat(parseFloat(loanTable[0].rows[1].cells[1].innerText).toFixed(2));
    let initialPayment =  parseFloat(parseFloat(loanTable[0].rows[1].cells[2].innerText).toFixed(2));
    let paymentInput =  parseFloat(parseFloat(loanTable[0].rows[1].cells[2].innerText).toFixed(2));
    let interestRateDecimalPerMonth = (interstRateGob/100)/12;

    let firstMonthYear = loanTable[0].rows[1].cells[0].innerText;
    let dateMonthYear = convertMonthYearStringToDate(firstMonthYear);
    let totalInterest = 0;
    let totalPayment = 0;
    let months = 0;

    const changeIntervals = new Array();
    
    if(startDates.length != endDates.length || startDates.length != intervAmounts.length){
        $("#validationUpdate").text("Error. Not all range amounts or dates have been filled.");
        return;
    }

    for(let i = 0; i < startDates.length; i++){
        if(startDates[i].value == "" || endDates[i].value == "" || intervAmounts[i].value == ""){
            $("#validationUpdate").text("Error. Not all range amounts or dates have been filled.");
            return;
        }
        const part = {start:convertMonthYearStringToDate(startDates[i].value), end:convertMonthYearStringToDate(endDates[i].value), amount:parseFloat(parseFloat(intervAmounts[i].value).toFixed(2))};
        changeIntervals.push(part);
    }

    for(let n = 0; n < changeIntervals.length; n++){
        if(changeIntervals[n].end < changeIntervals[n].start){
            $("#validationUpdate").text("The "+ (n+1) +" interval has a start date after it's end date.");
            return;
        }
        for(let b = 0; b < changeIntervals.length; b++){
            if(n != b){ 
                if(changeIntervals[b].start <= changeIntervals[n].start && changeIntervals[n].start < changeIntervals[b].end){
                    $("#validationUpdate").text("Some intervals are intersecting.");
                    return;
                }
                if(changeIntervals[b].start < changeIntervals[n].end && changeIntervals[n].end <= changeIntervals[b].end){
                    $("#validationUpdate").text("Some intervals are intersecting.");
                    return;
                }
            }
        }
    }

    //$("tbody").html("");
    let loanTbody = document.getElementsByTagName("tbody");
    loanTbody[0].innerHTML = "";
    
    do{
        for(let i = 0; i < changeIntervals.length; i++){
            if(changeIntervals[i].start <= dateMonthYear && dateMonthYear <=  changeIntervals[i].end){
                paymentInput = changeIntervals[i].amount; 
            }
        }
        let {paidTowardInterest, paidTowardPrincipal, endBalance, payment} = calcAllTableFields(currentBalance, paymentInput, interestRateDecimalPerMonth);
        totalInterest += paidTowardInterest;
        totalPayment += payment; 
        months++;               
        $("tbody").append("<tr><td>"+ (dateMonthYear.getMonth() + 1)+"/"+ dateMonthYear.getFullYear() + "</td><td>" + currentBalance.toFixed(2) + "</td><td>" + payment.toFixed(2) + "</td><td>" + paidTowardInterest.toFixed(2) + "</td><td>" + paidTowardPrincipal.toFixed(2) + "</td><td>" + endBalance.toFixed(2) + "</td></tr>"); 
        currentBalance = endBalance;
        dateMonthYear.setMonth(dateMonthYear.getMonth() + 1);
        paymentInput = initialPayment;
    } while(currentBalance > 0);
    $("#totalNumMonths3").text(months);
    $("#totalInterest3").text(roundDecimal(totalInterest, 2));
    $("#totalAmountPayed3").text(roundDecimal(totalPayment, 2));
    
}
function convertMonthYearStringToDate(dateString){
    let splitDate = "";
    if(dateString.search("-") > -1){
        splitDate = dateString.split("-");
        return new Date(splitDate[0], splitDate[1]-1);
    }else{
        splitDate = dateString.split("/");
        return new Date(splitDate[1], splitDate[0]-1);
    }
}