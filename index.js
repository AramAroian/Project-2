$(function () {
  //event listeners and variables
  let coins = [];
  let selectedCoins = [];

  const home = $("#home");
  home.on("click", renderHomePage);

  const reports = $("#reports");
  reports.on("click");

  const about = $("#about");
  about.on("click");

  const mainDiv = $("#mainDiv");
  mainDiv.on("change", "input", handleSelection);

  const searchInput = $("#search");
  searchInput.keyup(function () {
    searchCoins($(this).val());
  });

  // const searchButton = $("#searchButton");
  // searchButton.on("click", searchCoin);

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
      coins.forEach(function (coin) {
        let newCoin = `
        <div>
        <div class="row row-cols-1 row-cols-md-4" >
          <div class="card" style="width: 18rem">
            <div class="card-body">
              <img src="${coin.image}" class="card-custom-img" alt="...">
              <h5 class="card-title">${coin.symbol}</h5>
              <p class="card-text">${coin.name}</p>
              <a href="#" class="btn btn-primary">More info</a>
            </div>
          <div class="container">
            <label class="switch">
              <input type="checkbox" id="${coin.symbol}" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      `;
        mainDiv.append(newCoin);
      });
    });
  }

  // navigation functions

  // selects a specific coin

  function handleSelection(event) {
    if (event.target.checked) {
      addCoin(event);
    } else {
      removeCoin(event);
    }
  }

  function addCoin(event) {
    id = event.target.id;
    let result = coins.find((coin) => coin.symbol == id);
    if (selectedCoins.length < 5) {
      selectedCoins.push(result);
      console.log(selectedCoins);
    } else {
      $(`#${id}`).prop("checked", false);
      console.log("selected to many you greedy bastard");
    }
  }

  function removeCoin(event) {
    id = event.target.id;
    let result = coins.find((coin) => coin.symbol == id);
    selectedCoins = $.grep(selectedCoins, (value) => {
      return value != result;
    });
    console.log(selectedCoins);
  }

  // function for searching for coins

  function searchCoins(searchText) {
    // let result = Array.from(coins, (coin) => coin.symbol);
    console.log(searchText);
  }

  // templete for rendering

  function renderAnything() {
    $.when(getCoinData()).done(() => {
      storeCoins();
      console.log(coins);
    });
  }

  //testing ground
  $(document).ready(renderHomePage());
});
