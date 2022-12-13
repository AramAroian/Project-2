$(function () {
  //event listeners

  let coins = [];
  const coinDiv = $("#allCoinDisplay");

  // Getting info from API

  function getCoinData() {
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      success: (data) => localStorage.setItem("coins", JSON.stringify(data)),
      error: (err) => console.error(err.status, err.responseText),
    });
  }

  // Storing coins to localstorage

  function storeCoins() {
    coins = JSON.parse(localStorage.getItem("coins"));
  }

  // Render homepage

  function renderHomePage() {
    $.when(getCoinData()).done(() => {
      storeCoins();
      console.log(coins);
      coins.forEach(function (coin) {
        coinDiv.append(`
        <div id="allCoinDisplay" class="card-group">
        <div class="card" style="width: 18rem">
          <div class="card-body">
          <img src="${coin.image}" class="card-custom-img" alt="...">
            <h5 class="card-title">${coin.symbol}</h5>
            <p class="card-text">${coin.name}</p>
            <a href="#" class="btn btn-primary">More info</a>
          </div>
          <div class="container">
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      `);
      });
    });
  }

  // function renderData() {
  //   coins = storeCoins();

  // coinDiv.append(``);
  // }

  // templete for rendering

  function renderAnything() {
    $.when(getCoinData()).done(() => {
      storeCoins();
      console.log(coins);
    });
  }

  //testing ground
  // getCoinData();
  renderHomePage();
});
