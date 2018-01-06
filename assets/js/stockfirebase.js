$(document).ready(function() {

		// global variables
		var tickerList     = [];
		var currentPrice   = [];
		var companyNames   = [];
		var companyShares  = []
		var portfolioValue = 0;
		var symHead        = "";
		var symDetail      = "";
		var symPanel       = "";
		var symName        = "";
		var currPrice      = "";
		var currExt        = "";
		var latestPrice    = "";

		// the following will set up the classes needed for the accordion panel
		accordionWrapper = $("<div>");
			accordionWrapper.addClass("panel-group");
			accordionWrapper.attr("id","accordion");
			//accordionWrapper.attr("role","tablist");
			accordionWrapper.attr("aria-multiselectable","true");
		$('#stage').append(accordionWrapper);

		// get stock transactions from firebase
	    database.ref().on("child_added", function(childSnapshot) {

            // Store everything into a variable.
            var symbol  = childSnapshot.val().symbol;
            var name    = childSnapshot.val().name;
            var shares  = childSnapshot.val().shares;
            var price   = childSnapshot.val().price;
            var ext     = childSnapshot.val().ext;
            var date    = childSnapshot.val().date;
            var trans   = childSnapshot.val().trans;

            fmtPrice 	= formatNumber(price);
            fmtExt 	    = formatNumber(ext)
 
           	// get current stock prices and news
           	symLoc = $.inArray(symbol,tickerList);
			if(symLoc == '-1') {
           		getStocks(symbol);
           	}

           	symLoc 		= $.inArray(symbol,tickerList);
            currPrice 	= currentPrice[symLoc];
            currExt		= (currPrice * shares);
            fmtCurrExt  = formatNumber(currExt);

            profit = currExt - ext;

            // the following initialize a class to print negative numbers red
            minusSign = "";
            if(profit < 0) {
            	minusSign = 'sell'
            }

           	fmProfit =formatNumber(profit);

            if(trans == 'buy') {
            	// record total shares purchase for this symbol - symLoc represents the
            	// ticker symbol location within the tickerList array
            	companyShares[symLoc] += parseInt(shares);
            	lineclass = "";
               	totStockValue = (currentPrice[symLoc] * companyShares[symLoc])               	
                fmttotStockValue = formatNumber(totStockValue);
                $(".total"+symbol).text("Stock Value  $"+fmttotStockValue)
                portfolioCalc()
            } else {      // this is a sell transaction
            	lineclass = 'sell';
            	fmtCurrExt = "";
            	currPrice = "";
            	fmProfit = "";
            }

			stockInfo =	"<div class='row "+lineclass+"'> " +
							"<div class='col-xs-1'>"+trans+"</div> " +
			          			"<div class='col-xs-1'>"+date+"</div> " +
			               		"<div class='col-xs-2 text-right'>"+shares+"</div> " +
			               		"<div class='col-xs-2 text-right'>"+fmtPrice+"</div> " +
			               		"<div class='col-xs-2 text-right'>"+fmtExt+"</div> " +
			              		"<div class='col-xs-2 text-right'>"+fmtCurrExt+"</div> " +
			            		"<div class='col-xs-2 text-right "+minusSign+ "'>"+fmProfit+"</div> " +
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
		    	portfolioValue += subTotal
		    }
			fmtPortfolioValue = formatNumber(portfolioValue);
			$(".investmenttotal").text("Portfolio Value: $"+fmtPortfolioValue);
		}
		
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

				header.html(symName);
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

			function formatNumber(number) {
				newFormat = number.toLocaleString('en',{minimumFractionDigits:2})
				return newFormat;
			}

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
							latestPrice = response[q].quote.latestPrice;
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

			function updateTables(latestPrice, q, name) {
				// symLoc = $.inArray(q,tickerList);
				// if(symLoc == '-1') {
					pos = tickerList.length
					tickerList.push(q);
					currentPrice.push(formatNumber(latestPrice));
					companyNames.push(name);
					companyShares.push(0);
					symHead   = q+"head";
				    symDetail = q+"detail";
				    symPanel  = q+"panel";

			
					symName = "<table style:'width:960px;'>"	+
					          "<tr>" +
					          "<td style='width:100px'>"+q+"</td>" +
					          "<td style='width:300px'>"+name+"</td>" +
					          "<td style='width:200px'>Current Price  $"+currentPrice[pos]+"</td>" +
					          "<td class='total"+q+"' style='width:200px'></td>" +
					          "</tr>" +
					          "</table>"

				    buildStockDisplay(q,symName)
				//}
			}

})
