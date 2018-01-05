
var symbol = "aapl";
//var symbolNews = {dateTime};
	

function getStocks(q){
    // var queryURL = "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + q + ",fb&types=quote,news,chart&range=1m&last=5";
       var queryURL = "https://api.iextrading.com/1.0/stock/" + q + "/news/last/5"; 
        $.ajax({
          url: queryURL,
          method: 'GET'
        }).done(function(response) {
           console.log(response);
           for (i=0; i<5; i++){
           	 var newstemplate = `<div class="news_grid1">
           	                     <h4 class="spacing">${response[i].headline}</h4>
           	 					 <p class="spacing">${response[i].summary} <a href="${response[i].url}"> more</a>
           	 					 <span>Source:  ${response[i].source}&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;${response[i].datetime}</span></p>
           	 					 </div>`
           	 $(".news_feed").append(newstemplate);
           }
           // symbolNews.dateTime = response.AAPL.news[0].datetime;
           // console.log(symbolNews.datetime);
           // console.log(response[0].related);
           // console.log(response.AAPL.news[0].source);
           // console.log(response.AAPL.news[0].summary);
           // console.log(response.AAPL.news[0].url);
       });
    }


getStocks(symbol);
