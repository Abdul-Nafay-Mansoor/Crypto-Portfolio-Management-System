(async function loadPortfolio() {
  try {
    const portfolio = await fetchJSON('/portfolio');
    const tbody = document.querySelector('#portfolioTable tbody');
    const totalEl = document.getElementById('totalValue');
    tbody.innerHTML = '';
    totalEl.innerText = '$0.00';

    if (portfolio.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No holdings yet.</td></tr>';
      return;
    }

    // STEP 1: Get full coin list from CoinGecko
    const coinList = await fetchJSON('https://api.coingecko.com/api/v3/coins/list');

    // STEP 2: Build a reliable symbol+name → id map
    const symbolNameToId = {};
    coinList.forEach(c => {
      const key = `${c.symbol.toLowerCase()}|${c.name.toLowerCase()}`;
      symbolNameToId[key] = c.id;
    });

    // STEP 3: Map each portfolio entry to the correct CoinGecko ID
    const coinIdMap = {}; // e.g., { btc: "bitcoin" }
    const coinIds = [];

    portfolio.forEach(c => {
      const key = `${c.symbol.toLowerCase()}|${c.name.toLowerCase()}`;
      const id = symbolNameToId[key];
      if (id) {
        coinIdMap[c.symbol.toLowerCase()] = id;
        coinIds.push(id);
      }
    });

    if (coinIds.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No valid CoinGecko IDs found.</td></tr>';
      return;
    }

    // STEP 4: Fetch price data
    const prices = await fetchJSON(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
    );

    // STEP 5: Populate the table
    let totalValue = 0;

    portfolio.forEach(c => {
      const id = coinIdMap[c.symbol.toLowerCase()];
      const price = prices[id]?.usd ?? 0;
      const value = c.amount * price;
      totalValue += value;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.symbol.toUpperCase()}</td>
        <td>${c.amount}</td>
        <td>$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</td>
        <td>$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      `;
      tbody.appendChild(tr);
    });

    totalEl.innerHTML = `<strong>$${totalValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</strong>`;

  } catch (err) {
    alert('Error loading portfolio: ' + err.message);
  }
})();
