(async function loadDashboard() {
  try {
    const data = await fetchJSON(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15'
    );
    const tbody = document.querySelector('#dashboardTable tbody');
    tbody.innerHTML = '';
    data.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <img src="${c.image}" alt="${c.name} logo" style="width:24px; height:24px; vertical-align:middle; margin-right:8px;">
          ${c.symbol.toUpperCase()}
        </td>
        <td>${c.name}</td>
        <td>$${c.current_price}</td>
        <td>$${c.market_cap.toLocaleString()}</td>
        <td>
          <button onclick="buy('${c.symbol}', '${c.name}', ${c.current_price})">Buy</button>
          <button onclick="sell('${c.symbol}', ${c.current_price})">Sell</button>
          <button onclick="watch('${c.symbol}', '${c.name}')">Watchlist</button>
          <button onclick="showChart('${c.id}', '${c.name}')">Chart</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch(err) {
    alert(err.message);
  }
})();

async function buy(symbol, name, price) {
  const amount = parseFloat(prompt(`How much ${symbol.toUpperCase()} to buy?`));
  if (!isNaN(amount)) {
    const res = await fetch('/buy', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ symbol, name, amount, price })
    });
    if (!res.ok) alert(await res.text());
    loadPortfolio();
    loadProfile();
  }
}

async function sell(symbol, price) {
  const amount = parseFloat(prompt(`How much ${symbol.toUpperCase()} to sell?`));
  if (!isNaN(amount)) {
    const res = await fetch('/sell', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ symbol, amount, price })
    });
    if (!res.ok) alert(await res.text());
    loadPortfolio();
    loadProfile();
  }
}

async function watch(symbol, name) {
  const res = await fetch('/watchlist', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ symbol, name })
  });
  if (!res.ok) alert(await res.text());
  loadWatchlist();
}

let chartInstance;

async function showChart(coinId, coinName) {
  document.getElementById('chartTitle').innerText = `${coinName} Price Chart`;
  document.getElementById('chartModal').style.display = 'block';

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`);
    const data = await res.json();

    const labels = data.prices.map(p => {
      const date = new Date(p[0]);
      return `${date.getMonth()+1}/${date.getDate()}`;
    });

    const prices = data.prices.map(p => p[1]);

    const ctx = document.getElementById('priceChart').getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${coinName} (USD)`,
          data: prices,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Price (USD)' } }
        }
      }
    });

  } catch (err) {
    alert('Error loading chart data: ' + err.message);
  }
}

// Example fetchJSON function if you need it:
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}