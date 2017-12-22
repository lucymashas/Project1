function getStocks(q){
      var queryURL = "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + q + ,fb&types=quote,news,chart&range=1m&last5;
        $.ajax({
          url: queryURL,
          method: 'GET'
        }).done(function(response) {
           console.log(response);
       });
    }

getStocks(aapl);