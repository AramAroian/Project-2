$(function () {
  // Getting info from API

  function getCoinData() {
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      success: (data) => console.log(data),
      error: (err) => console.error(err.status, err.responseText),
    });
  }

  function storeData(data) {}

  getCoinData();
});

//100 first coins by market cap:
// curl -X 'GET' \'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false' \  -H 'accept: application/json'

// req url: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false
