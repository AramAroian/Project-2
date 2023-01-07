$(function () {
  //event listeners and variables

  let tempSelected;

  const home = $("#home");
  home.on("click", renderHomePage);

  const reports = $("#reports");
  reports.on("click", renderReports);

  const about = $("#about");
  about.on("click", renderAbout);

  const mainDiv = $("#mainDiv");
  mainDiv.on("change", "input", handleSelection);
  mainDiv.on("click", "a", getPriceData);

  const coinModal = $("#staticBackdrop");
  const coinModalBody = $(".table-body");
  coinModalBody.on("change", "input", handleSelection);

  const modalSaveBtn = $("#saveChanges");
  modalSaveBtn.on("click", handleSave);

  const modalCancelBtn = $("#cancel");
  modalCancelBtn.on("click", handleCancel);

  const searchInput = $("#search");

  $("form").submit(handleSearch);

  // Getting info from API

  function getCoinData() {
    $.ajax({
      url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      success: (data) => localStorage.setItem("coins", JSON.stringify(data)),
      error: (err) => console.error(err.status, err.responseText),
    });
  }

  function getStoredCoins() {
    return JSON.parse(localStorage.getItem("coins"));
  }

  function getStoredPrices(id) {
    return JSON.parse(localStorage.getItem(`${id}`));
  }

  // Render homepage

  function renderHomePage() {
    $.when(getCoinData()).done(() => {
      coins = getStoredCoins();
      renderMainDiv(coins, mainDiv);
    });
  }

  function renderMainDiv(arr, mainDiv) {
    mainDiv.html("");
    let newCoin;
    let isChecked;
    followedCoins = getFollowedCoins();

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
              
              <h5 class="card-title">${coin.symbol}</h5>
              <p class="card-text">${coin.name}</p>
              
            <p>
            <a class="btn btn-primary" data-bs-toggle="collapse" id="${coin.id}" href="#moreInfo_${coin.id}" role="button" aria-expanded="false" aria-controls="moreInfo_${coin.id}">
              More info
            </a>

          </p>
             
            </div>

          <div class="collapse btn btn-info" id="moreInfo_${coin.id}">
            <div class="card inner-collapse-card card-body ${coin.id}" >

              
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
      $(".loader").fadeOut(1000);
      $("#content").fadeIn(1000);
    });
  }

  // handling more info

  function getPriceData(event) {
    let id = event.target.id;
    let coinInfo;
    $(`.${id}`).html(`    
    <div id= "smallSpinner" class="spinner-border text-info" role="status">
    </div>

  `);

    if (localStorage.getItem(`${id}`) === null) {
      $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${id}`,
        success: (data) => localStorage.setItem(`${id}`, JSON.stringify(data)),
        error: (err) => console.error(err.status, err.responseText),
      }).done(() => {
        coinInfo = getStoredPrices(id);

        $(`.${id}`).html(``);
        $(`.${id}`).append(
          `<img src="${coinInfo.image.small}" class="card-custom-img" alt="${coinInfo.name}">
          <div id="infoContent"> Current coin price is: <br/> ${coinInfo.market_data.current_price.usd} $ <br/> ${coinInfo.market_data.current_price.eur} € <br/> ${coinInfo.market_data.current_price.ils} ₪
          </div>`
        );
        setTimeout(() => {
          localStorage.removeItem(`${id}`);
        }, 60 * 2 * 1000);
      });
    } else {
      coinInfo = getStoredPrices(id);
      $(`.${id}`).html(``);
      $(`.${id}`).append(
        `
        <img src="${coinInfo.image.small}" class="card-custom-img" alt="${coinInfo.name}">
        <div id="infoContent" > Current coin price is: <br/> ${coinInfo.market_data.current_price.usd} $ <br/> ${coinInfo.market_data.current_price.eur} € <br/> ${coinInfo.market_data.current_price.ils} ₪
        </div>`
      );
    }
  }

  //store selected coins
  function setFollowedCoins(arr) {
    localStorage.setItem("followedCoins", JSON.stringify(arr));
  }

  function getFollowedCoins() {
    return JSON.parse(localStorage.getItem("followedCoins"));
  }

  function setTempStateFolloewd(arr) {
    localStorage.setItem("tempStateFollowed", JSON.stringify(arr));
  }

  function getTempStateFolloewddCoins() {
    return JSON.parse(localStorage.getItem("tempStateFollowed"));
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
    followedCoins = getFollowedCoins();
    if (followedCoins == null) {
      let arr = [];
      arr.push(result);
      setFollowedCoins(arr);
    } else if (followedCoins.length < 5) {
      followedCoins.push(result);
      setFollowedCoins(followedCoins);
    } else {
      setTempStateFolloewd(followedCoins);
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
    if (followedCoins !== null) {
      let index = followedCoins.findIndex((coin) => coin.symbol == id);
      followedCoins.splice(index, 1);
      setFollowedCoins(followedCoins);
    }
  }

  function updateSavedCoins() {
    if (followedCoins.length < 5) {
      followedCoins.push(tempSelected);
      setFollowedCoins(followedCoins);
    }
  }

  function handleCancel() {
    followedCoins = getTempStateFolloewddCoins();
    setFollowedCoins(followedCoins);
    renderHomePage();
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

  // function for searching for coins

  function handleSearch(event) {
    event.preventDefault();
    coins = getStoredCoins();
    let searchString = searchInput.focus().val().toLowerCase();
    let result = coins.filter(
      (coin) =>
        coin.symbol.toString().includes(searchString) ||
        coin.name.toLowerCase().toString().includes(searchString)
    );
    if (result.length > 0) {
      renderMainDiv(result, mainDiv);
    } else {
      alert(`There are no results matching your query`);
    }
  }

  function renderReports() {
    followedCoins = getFollowedCoins();

    if (followedCoins == null) {
      mainDiv.html(`
      <div id="chartContainer">
        <h2>Please select coin(s) at the homepage to generate live reports</h2>
      </div>
      `);
    } else {
      mainDiv.html(`
      <div id="chartContainer"></div>
      `);

      while (followedCoins.length < 5) {
        followedCoins.push("");
      }

      let isShown = [];

      followedCoins.forEach((item, index) => {
        if (item !== "") {
          isShown[index] = true;
        } else {
          isShown[index] = false;
        }
      });

      var dataPoints1 = [];
      var dataPoints2 = [];
      var dataPoints3 = [];
      var dataPoints4 = [];
      var dataPoints5 = [];

      var options = {
        title: {
          text: "Live Reports",
        },
        axisX: {
          title: "chart updates every 2 secs",
        },
        axisY: {
          suffix: "USD",
        },
        toolTip: {
          shared: true,
        },
        legend: {
          cursor: "pointer",
          verticalAlign: "top",
          fontSize: 22,
          fontColor: "dimGrey",
          itemclick: toggleDataSeries,
        },
        data: [
          {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: isShown[0],
            name: `${followedCoins[0].name}`,
            dataPoints: dataPoints1,
          },
          {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00",
            showInLegend: isShown[1],
            name: `${followedCoins[1].name}`,
            dataPoints: dataPoints2,
          },
          {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00",
            showInLegend: isShown[2],
            name: `${followedCoins[2].name}`,
            dataPoints: dataPoints3,
          },
          {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00",
            showInLegend: isShown[3],
            name: `${followedCoins[3].name}`,
            dataPoints: dataPoints4,
          },
          {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00",
            showInLegend: isShown[4],
            name: `${followedCoins[4].name}`,
            dataPoints: dataPoints5,
          },
        ],
      };

      var chart = $("#chartContainer").CanvasJSChart(options);

      function toggleDataSeries(e) {
        if (
          typeof e.dataSeries.visible === "undefined" ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }

      // initial value

      let yValue = [];

      followedCoins.forEach((item, index) => {
        let id = item.symbol;
        if (id !== undefined) {
          let result = null;
          id = id.toUpperCase();

          $.ajax({
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${id}&tsyms=USD`,
            success: (data) => (result = data),
            error: (err) => console.error(err.status, err.responseText),
          }).done(() => {
            result = Object.values(result);

            yValue[index] = result[0].USD;
          });
        }
      });

      const updateInterval = 2000;

      let time = new Date();

      function updateChart(count) {
        count = count || 1;

        for (var i = 0; i < count; i++) {
          time.setTime(time.getTime() + updateInterval);
        }

        yValue.forEach((item, index) => {
          let id = followedCoins[index].symbol;
          if (id !== undefined) {
            let result = null;
            id = id.toUpperCase();

            $.ajax({
              url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${id}&tsyms=USD`,
              success: (data) => {
                result = data;
              },
              error: (err) => console.error(err.status, err.responseText),
            }).done(() => {
              result = Object.values(result);

              yValue[index] = result[0].USD;

              dataPoints1.push({
                x: time.getTime(),
                y: yValue[0],
              });
              dataPoints2.push({
                x: time.getTime(),
                y: yValue[1],
              });
              dataPoints3.push({
                x: time.getTime(),
                y: yValue[2],
              });
              dataPoints4.push({
                x: time.getTime(),
                y: yValue[3],
              });
              dataPoints5.push({
                x: time.getTime(),
                y: yValue[4],
              });
              options.data[0].legendText =
                `${followedCoins[0].name}: ` + yValue[0] + "$";
              options.data[1].legendText =
                `${followedCoins[1].name}: ` + yValue[1] + "$";
              options.data[2].legendText =
                `${followedCoins[2].name}: ` + yValue[2] + "$";
              options.data[3].legendText =
                `${followedCoins[3].name}: ` + yValue[3] + "$";
              options.data[4].legendText =
                `${followedCoins[4].name}: ` + yValue[4] + "$";
            });
          }
        });

        $("#chartContainer").CanvasJSChart().render();
      }

      updateChart(100);
      let chartInterval = setInterval(function () {
        updateChart();
      }, updateInterval);
      home.on("click", () => {
        clearInterval(chartInterval);
      });
      about.on("click", () => {
        clearInterval(chartInterval);
      });
    }
  }

  function renderAbout() {
    mainDiv.html(`
    <div class="about-container container">
        <div class="card about-card" style="width: 18rem;">
      <img src="./assets/AboutPic.JPG" class="card-img-top" alt="DevPic">
      <div class="card-body">
        <h5 class="card-title">About</h5>
        <p class="card-text">Crypto monitor was developed by Aram Aroian.</p>
        <p>For further information contact me at: aramaroian1@gmail.com</p>
      </div>
    </div>
    </div>
    `);
  }

  //executing render homepage

  renderHomePage();
});
