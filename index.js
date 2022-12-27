$(function () {
  //event listeners and variables
  let coins = [];
  let coinPrice = [];
  let followedCoins = [];
  let tempSelected;

  let sessionData = [];

  let searchArr = [];

  const home = $("#home");
  home.on("click", renderHomePage);

  const reports = $("#reports");
  reports.on("click");

  const about = $("#about");
  about.on("click");

  const mainDiv = $("#mainDiv");
  mainDiv.on("change", "input", handleSelection);
  mainDiv.on("click", "a", renderInfo);

  const coinModal = $("#staticBackdrop");
  const coinModalBody = $(".table-body");
  coinModalBody.on("change", "input", handleSelection);

  const modalSaveBtn = $("#saveChanges");
  modalSaveBtn.on("click", handleSave);

  // const searchInput = $("#search");
  // searchInput.keyup(function () {
  //   searchCoins($(this).val().toLowerCase());
  // });

  // const searchButton = $("#searchButton");
  // searchButton.on("click", searchCoins(searchInput.val()));

  // Getting info from API

  function getCoinData() {
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      success: (data) => localStorage.setItem("coins", JSON.stringify(data)),
      error: (err) => console.error(err.status, err.responseText),
    });
  }

  function getPriceData(id) {
    $.ajax({
      url: `https://api.coingecko.com/api/v3/coins/${id}`,
      success: (data) => localStorage.setItem(`${id}`, JSON.stringify(data)),
      error: (err) => console.error(err.status, err.responseText),
    });
  }

  // $('#loadingDiv')
  // .hide()
  // .ajaxStart(function() {
  //     $(this).show();
  // })
  // .ajaxStop(function() {
  //     $(this).hide();
  // });

  // getting data from localstorage

  function getStoredCoins() {
    coins = JSON.parse(localStorage.getItem("coins"));
  }

  function getStoredPrices(id) {
    return JSON.parse(localStorage.getItem(`${id}`));
  }

  // Render homepage

  function renderHomePage() {
    $.when(getCoinData()).done(() => {
      getStoredCoins();
      renderMainDiv(coins, mainDiv);
    });
  }

  function renderMainDiv(arr, mainDiv) {
    mainDiv.html("");
    let newCoin;
    let isChecked;
    getFollowedCoins();

    arr.forEach(function (coin) {
      if (
        followedCoins !== null &&
        followedCoins.some((item) => item.symbol === coin.symbol)
      ) {
        isChecked = 'checked="true"';
      } else {
        isChecked = "";
      }

      newCoin = `
  
        <div class="row row-cols-1 row-cols-md-4" >
          <div  class="card coin-card">
            <div class="card-body">
              <img src="${coin.image}" class="card-custom-img" alt="...">
              <h5 class="card-title">${coin.symbol}</h5>
              <p class="card-text">${coin.name}</p>
              
            <p>
            <a class="btn btn-primary" data-bs-toggle="collapse" id="${coin.id}" href="#moreInfo_${coin.id}" role="button" aria-expanded="false" aria-controls="moreInfo_${coin.id}">
              More info
            </a>
          </p>
             
            </div>

          <div class="collapse" id="moreInfo_${coin.id}">
            <div class="card card-body ${coin.id}" id="">

              
            </div>
          </div>

          <div class="container">
            <label class="switch">
              <input type="checkbox" class="checkbox" id="${coin.symbol}" ${isChecked}  />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        </div>
  
  
      `;
      mainDiv.append(newCoin);
    });
  }

  // navigation functions

  // handling more info

  function renderInfo(event) {
    let id = event.target.id;
    let coinInfo;
    if (localStorage.getItem(`${id}`) === null) {
      $.when(getPriceData(id)).then(() => {
        coinInfo = getStoredPrices(id);
        console.log("new data fetched");
      });
    } else {
      coinInfo = getStoredPrices(id);
      console.log("data already exists");
    }

    $(`.${id}`).html("");
    $(`.${id}`).append(
      `Current coin price is: <br/> ${coinInfo.market_data.current_price.usd}$ <br/> ${coinInfo.market_data.current_price.eur}€ <br/> ${coinInfo.market_data.current_price.ils}₪`
    );
  }

  //store selected coins
  function setFollowedCoins(arr) {
    localStorage.setItem("followedCoins", JSON.stringify(arr));
  }

  function getFollowedCoins() {
    followedCoins = JSON.parse(localStorage.getItem("followedCoins"));
  }

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
    getFollowedCoins();
    if (followedCoins == null) {
      let arr = [];
      arr.push(result);
      followdCoins = setFollowedCoins(arr);
    } else if (followedCoins.length < 5) {
      followedCoins.push(result);
      setFollowedCoins(followedCoins);
    } else {
      tempSelected = result;
      setTimeout(() => {
        $(`#${id}`).prop("checked", false);
      }, 300);
      renderModal(followedCoins);
      coinModal.modal("show");
    }
  }

  function removeCoin(event) {
    id = event.target.id;
    let index = followedCoins.findIndex((coin) => coin.symbol == id);
    followedCoins.splice(index, 1);
    setFollowedCoins(followedCoins);
  }

  function updateSavedCoins() {
    if (followedCoins.length < 5) {
      followedCoins.push(tempSelected);
      setFollowedCoins(followedCoins);
    }
  }

  function handleSave() {
    updateSavedCoins();
    renderHomePage();
  }

  function renderModal(arr) {
    coinModalBody.html("");
    arr.forEach(function (coin) {
      let newCoin = `

    <tr>
      <th scope="row"><img src="${coin.image}" class="card-custom-img" alt="${this.name}"></th>
      <td class="title">${coin.symbol}</td>
      <td>
      <label class="switch">
      <input type="checkbox" id="${coin.symbol}" checked="true"  />
      <span class="slider round"></span>
      </label>
      </td>
    </tr>

    `;

      coinModalBody.append(newCoin);
    });
  }

  // function for searching for coins on type

  // function searchCoins(searchText) {
  //   searchArr = [];

  //   $(`.coin-card:contains(${searchText})`).each(function () {
  //     searchArr.push($(this));
  //   });

  //   if (searchArr.length != 0) {
  //     renderMainDiv(searchArr, mainDiv);
  //   } else {
  //     renderHomePage();
  //   }
  //   console.log(searchArr);
  // }

  //testing ground
  $(document).ready(renderHomePage());
});
