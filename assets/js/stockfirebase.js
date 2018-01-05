$(document).ready(function() {

		// global variables
		var tickerList = [];
		var currentPrice = [];
		var portfolioValue = 0;
		var symHead   = "";
		var symDetail = "";
		var symPanel  = "";
		var symName   = "";
		var currPrice = "";
		var currExt   = "";


		// the following will set up the classes needed for the accordion panel
		accordionWrapper = $("<div>");
			accordionWrapper.addClass("panel-group");
			accordionWrapper.attr("id","accordion");
			//accordionWrapper.attr("role","tablist");
			accordionWrapper.attr("aria-multiselectable","true");
		$('#stage').append(accordionWrapper);

	    database.ref().on("child_added", function(childSnapshot) {

            // Store everything into a variable.
            var symbol = childSnapshot.val().symbol;
            var name = childSnapshot.val().name;
            var shares = childSnapshot.val().shares;
            var price = childSnapshot.val().price;
            var ext = childSnapshot.val().ext;
            var date = childSnapshot.val().date;
            var trans = childSnapshot.val().trans;

            price 	= formatNumber(price);
            ext 	= formatNumber(ext)
            currPrice = childSnapshot.val().price;
            currPrice = formatNumber(currPrice);
            currExt   = (currPrice * shares);
            currExt = formatNumber(currExt);

            // checks if stock was set up previously            
            findIt = $.inArray(symbol,tickerList);
            if(findIt == '-1') {
            	tickerList.push(symbol);
            	currentPrice.push(price);
            	// this section builds the drop down for this stock
				symHead   = symbol+"head";
				symDetail = symbol+"detail";
				symPanel  = symbol+"panel";
				symName   = symbol+"    "+name
				buildStockDisplay(symbol,symName)
            } else {
            	currPrice 	= currentPrice[findIt];
            	currExt		= (currPrice * shares);
            	currExt = formatNumber(currExt);
            }

			portfolioValue += ext;
			// stockInfo =	"<div class='row'> " +
			// 				"<div class='col-xs-1'>"+trans+"</div> " +
			//           			"<div class='col-xs-1'>"+date+"</div> " +
			//                		"<div class='col-xs-1 text-right'>"+shares+"</div> " +
			//                		"<div class='col-xs-1 text-right'>"+price+"</div> " +
			//                		"<div class='col-xs-1 text-right'>"+ext+"</div> " +
			//               		"<div class='col-xs-1 text-right'>"+currPrice+"</div> " +
			//                		"<div class='col-xs-1 text-right'>"+currExt+"</div> " +
			//            	"</div>" 
			stockInfo =	
							// "<div class='col-xs-1'>"+trans+"</div> " +
			          			"<tr><td>"+trans+"</td> " +
			          			"<td>"+date+"</td> " +
			               		"<td>"+shares+"</td> " +
			               		"<td>"+price+"</td> " +
			               		"<td>"+ext+"</td> " +
			              		"<td>"+currPrice+"</td> " +
			               		"<td>"+currExt+"</td> " +
			           	"</tbody></table>" 


			$("."+symbol+"con").append(stockInfo)
				
			portfolioValue = portfolioValue
			$(".investmenttotal").text(portfolioValue);

     	}, function(errorObject) {
           console.log("Errors handled: " + errorObject.code);
     	});

		function buildStockDisplay(symbol, companyName) {

				header = $('<div>')
				header.addClass("panel panel-default")
				header.attr('id',symbol+"main");
				$('#accordion').append(header);

				header = $('<div>');
				header.addClass('panel-heading accordion-toggle.collapsed');
				//header.attr("role","tab");
				header.attr("id",symHead);
				$('#'+symbol+'main').append(header);

				header = $("<H4>");
				header.addClass('panel-title title');
				header.attr("id","H4"+symbol);
				$("#"+symHead).append(header);

				header = $("<a>");
				header.addClass('accordion-toggle')
				//header.attr("role","button")
				header.attr("data-toggle","collapse");
				header.attr("data-parent", '#'+symHead);
				header.attr("href", "#"+symDetail);
				//header.attr("aria-expanded","true");
				//header.attr("aria-controls","true");
				header.text(symName);
				$("#H4"+symbol).append(header);

				detail = $('<div>');
				detail.attr('id',symDetail);
				detail.addClass('collapse panel-collapse');
				//detail.attr('role','tabpanel');
				//detail.attr('aria-labelledby', symHead+'heading')
				$('#'+symbol+'main').append(detail);

				detail = $('<div>');
				detail.addClass('panel-body body-text');
				detail.attr('id','text'+symbol);
				//detail.text('this is where the detail goes');
				$("#"+symDetail).append(detail);

				// building header for detail section
				// detailHeader = "<div class='container "+symbol+"con'> " +
				// 					"<div class='row'> " +
				// 						"<div class='col-xs-1'><strong>Trans</strong></div> " +
				//                			"<div class='col-xs-1'><strong>Date</strong></div> " +
				//                			"<div class='col-xs-1 text-right'><strong>Shares</strong></div> " +
				//                			"<div class='col-xs-1 text-right'><strong>Price</strong></div> " +
				//                			"<div class='col-xs-1 text-right'><strong>Ext $</strong></div> " +
				//                			"<div class='col-xs-1 text-right'><strong>Curr $</strong></div> " +
				//                			"<div class='col-xs-1 text-right'><strong>Profit</strong></div> " +
				//                		"</div>" +
				// 				"</div>"
				detailHeader= "<table class='table table-striped table-condensed " +symbol+"con'>"+
					            "<thead>"+
					            "<tr><th>Type</th>"+
					            "<th>Date</th>"+
					            "<th>Shares</th>"+
					            "<th>Price</th>"+
					            "<th>Ext</th>"+
					            "<th>Curr</th>"+
					            "<th>Profit</th>"+
					            "</thead>" +
					            "<tbody>"
				               
				$("#text"+symbol).append(detailHeader)
			}

			function formatNumber(number) {
				newFormat = number.toLocaleString('en',{minimumFractionDigits:2})
				return newFormat;
			}

		

		
});