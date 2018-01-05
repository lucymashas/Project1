
$(document).ready(function(){

	$("#addStock").on("click",function(){
		event.preventDefault();
		//input information from form
		var sharesPurchased = $("#sharesPurchased").val().trim();
		var datePurchased = moment($("#date").val().trim(), "MM/DD/YYYY").format("MM/DD/YYYY");
		//Check date purchase is between the current date and not more then 90 days in the past
		var today=moment().format("MM/DD/YYYY");
		var todayminus = moment(today, "MM/DD/YYYY").subtract(90, "days").format("MM/DD/YYYY");
		if (datePurchased >= todayminus && datePurchased <= today){
		//date within range
		}
		//format price to two decimal places
		//validate price to make sure is positive number enter 
		var price = parseFloat($("#pricePaid").val().trim());
		$("#forminfo").trigger("reset");
	})

    
})