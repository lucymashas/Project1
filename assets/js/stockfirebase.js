$(document).ready(function() {

		// global variables
		var tickerList     = [];
		var currentPrice   = [];
		var companyNames   = [];
		var companyShares  = [];
		var companyCash	   = [];
		var portfolioValue = 0;
		var symHead        = "";
		var symDetail      = "";
		var symPanel       = "";
		var symName        = "";
		var currPrice      = "";
		var currExt        = "";
		var latestPrice    = "";
		var purExt         = "";
		var cashExt 		= 0;
		var totCashExt		= 0;

		// the following will set up the classes needed for the accordion panel
		accordionWrapper = $("<div>");
			accordionWrapper.addClass("panel-group");
			accordionWrapper.attr("id","accordion");
			accordionWrapper.attr("aria-multiselectable","true");
		$('#stage').append(accordionWrapper);

		// get stock transactions from firebase
	    database.ref().on("child_added", function(childSnapshot) {

            // Store everything into a variable.
            var symbol  	= childSnapshot.val().symbol;
            var name    	= childSnapshot.val().name;
            var purShares  	= parseInt(childSnapshot.val().shares);
            var purPrice   	= formatNumber(childSnapshot.val().price);
            var purExt     	= formatNumber(childSnapshot.val().ext);
            var rawPurExt   = childSnapshot.val().ext
            var date    	= childSnapshot.val().date;
            var trans   	= childSnapshot.val().trans;
            if(trans == 'sell') {
            	rawPurExt = (rawPurExt * -1);
            }

           	// get current stock prices and news
           	symLoc = $.inArray(symbol,tickerList);
			if(symLoc == '-1') {
           		getStocks(symbol);
           	}

           	symLoc 			= $.inArray(symbol,tickerList);
            rawCurrPrice 	= parseInt(currentPrice[symLoc]);
            currExt			= formatNumber((rawCurrPrice * purShares));
            rawCurrExt  	= parseInt(currExt);
   

            profit = ((rawCurrPrice*purShares) - rawPurExt);
            profit = formatNumber(profit)

            // the following initialize a class to print negative numbers red
            minusSign = "";
            if(profit < 0) {
            	minusSign = 'sell'
            }

            totStockValue = 0;
            if(trans == 'buy') {
            	// record total shares purchase for this symbol - symLoc represents the
            	// ticker symbol location within the tickerList array
            	companyShares[symLoc] += parseInt(purShares);
            	lineclass = "";
               	totStockValue += (currentPrice[symLoc] * companyShares[symLoc]);
               	totStockValue += companyCash[symLoc]              	
            } else {      // this is a sell transaction - do show current price or profit
            	 lineclass = 'sell';
            	 currExt = "";
         	     currPrice = "";
            	 profit = "";
            	 companyCash[symLoc] += rawPurExt;
            	 totStockValue += companyCash[symLoc]
            	 // console.log(totStockValue)          	 
            }
                
            $(".total"+symbol).text("Stock Value  $"+formatNumber(totStockValue));
			portfolioCalc();  // update portfolio numbers

			stockInfo =	"<div class='row "+lineclass+"'> " +
							"<div class='col-xs-1'>"+trans+"</div> " +
			          			"<div class='col-xs-1'>"+date+"</div> " +
			               		"<div class='col-xs-2 text-right'>"+purShares+"</div> " +
			               		"<div class='col-xs-2 text-right'>"+purPrice+"</div> " +
			               		"<div class='col-xs-2 text-right'>"+purExt+"</div> " +
			              		"<div class='col-xs-2 text-right'>"+currExt+"</div> " +
			            		"<div class='col-xs-2 text-right "+minusSign+ "'>"+profit+"</div> " +
			           	"</div>" 

			$("."+symbol+"con").append(stockInfo)

     	}, function(errorObject) {
           console.log("Errors handled: " + errorObject.code);
     	});

	    // this section calculate total portfolio value
	    function portfolioCalc() {
	    	portfolioValue = 0;
		    for(i=0; i < tickerList.length; i++) {
		    	subTotal = 0
		    	subTotal = (currentPrice[i] * companyShares[i]);
		    	portfolioValue += subTotal;
		    	portfolioValue += companyCash[i]
		    }
			portfolioValue = formatNumber(portfolioValue);
			$(".investmenttotal").text("Portfolio Value: $"+portfolioValue);
		}
		
		// this functiom builds the html code to an accordian panel based on
		// the stock symbol - when going through the firebase list and we
		// encounter a stock symbol for the first time, we create div classes
		// for the create unique panels for the stock to deliver those transactions
		// for that stock - we create the four unique four id's by combining the
		// stock symbol as a prefix and the suffix (main, head, detail and panel)
		function buildStockDisplay(symbol, companyName) {

				// this code builds the main accordian container
				header = $('<div>')
				header.addClass("panel panel-default")
				header.attr('id',symbol+"main");
				$('#accordion').append(header);

				// this code builds the tab portion of the accordiam for each stock
				header = $('<div>');
				header.addClass('panel-heading accordion-toggle.collapsed');
				header.attr("id",symHead);
				$('#'+symbol+'main').append(header);

				// we are adding a bootstrap element to the header
				header = $("<H4>");
				header.addClass('panel-title title');
				header.attr("id","H4"+symbol);
				$("#"+symHead).append(header);

				// we are adding an anchor to connect the header to the detail
				header = $("<a>");
				header.addClass('accordion-toggle')
				header.attr("data-toggle","collapse");
				header.attr("data-parent", '#'+symHead);
				header.attr("href", "#"+symDetail);
				header.html(symName);
				$("#H4"+symbol).append(header);

				// now we are setting up the detail section of the panel
				detail = $('<div>');
				detail.attr('id',symDetail);
				detail.addClass('collapse panel-collapse');
				$('#'+symbol+'main').append(detail);

				// we are now adding addition divs to satisfy bootstrap
				detail = $('<div>');
				detail.addClass('panel-body body-text');
				detail.attr('id','text'+symbol);
				$("#"+symDetail).append(detail);

				// building header for detail section
				detailHeader = "<div class='container-fluid "+symbol+"con'> " +
									"<div class='row'> " +
										"<div class='col-xs-1'><strong>Trans</strong></div> " +
				               			"<div class='col-xs-1'><strong>Date</strong></div> " +
				               			"<div class='col-xs-2 text-right'><strong>Shares</strong></div> " +
				               			"<div class='col-xs-2 text-right'><strong>Price</strong></div> " +
				               			"<div class='col-xs-2 text-right'><strong>Ext$</strong></div> " +
				               			"<div class='col-xs-2 text-right'><strong>Curr$</strong></div> " +
				               			"<div class='col-xs-2 text-right'><strong>Profit</strong></div> " +
				               		"</div>" +
								"</div>"

				$("#text"+symbol).append(detailHeader);
			}

			// this function a formatted numbers for displays (result ex: 12,122,23)
			function formatNumber(number) {
				newFormat = number.toLocaleString('en',{minimumFractionDigits:2})
				return newFormat;
			}

			// this function is only called when we encounter a stock we did not
			// process before - there is no need to function a second time for a
			// since all of the information is the same - current price is recorder
			// for this stock and the news section will be updated in this section
			function getStocks(q) {
			    var queryURL = "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + q + "&types=quote,news,chart&range=1m&last=2";

			        $.ajax({
			          url: queryURL,
			          method: 'GET',
			          async: false
			        }).done(function(response) {

			           for (i=0; i<2; i++) {

							headline    = response[q].news[i].headline;
							source      = response[q].news[i].source;
							summary     = response[q].news[i].summary;
							dateTime    = response[q].news[i].datetime.substring(0,10)
							url         = response[q].news[i].url;
							latestPrice = parseInt(response[q].quote.latestPrice)
							latestPrice = formatNumber(latestPrice);
							name        = response[q].quote.companyName;

							newsline = '<div class="news_grid1>"' +
							           '<a href="#"><h4>('+q+')   |  '+name+'       -- '+headline+'</h4></a>' +
									   '<p>'+summary+
								       '<a href="'+url+'"> more&nbsp;»</a><p>' +
										'<p class="sourceDate">'+source+ '  |  '+dateTime+'</p>' +
										'<hr></div>'
							$('.news_chart').append(newsline);
				       } 
					})
 					updateTables(latestPrice, q, name)
			}

			// this function captures data to be used to stock information
			function updateTables(latestPrice, q, name) {
				
			 	pos = tickerList.length
				tickerList.push(q);
				currentPrice.push(latestPrice);
				companyNames.push(name);
				companyShares.push(0);
				companyCash.push(0)
				symHead   = q+"head";     // used as id for bootstrap classes
			    symDetail = q+"detail";   // used as id for bootstrap classes
			    symPanel  = q+"panel";    // used as id for bootstrap classes
			
				symName = "<table style:'width:960px;'>"	+
				          "<tr>" +
				          "<td style='width:100px'>"+q+"</td>" +
				          "<td style='width:300px'>"+name+"</td>" +
				          "<td style='width:200px'>Current Price  $"+currentPrice[pos]+"</td>" +
				          "<td class='total"+q+"' style='width:200px'></td>" +
				          "</tr>" +
				          "</table>"
					
			    buildStockDisplay(q,symName)
				
			}

})
