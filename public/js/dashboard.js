(async function init() {
  // 1. Check login
  const p = await fetch('/profile');
  if (p.status !== 200) return window.location.href = '/';

  // 2. Load crypto list
  try {
    const res = await fetch('/api/cryptos');
    const data = await res.json();
    const tbody = document.querySelector('#dashboardTable tbody');
    tbody.innerHTML = '';
    data.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${c.image}" width="24" /> ${c.symbol.toUpperCase()}</td>
        <td>${c.name}</td>
        <td>$${c.current_price}</td>
        <td>$${c.market_cap.toLocaleString()}</td>
        <td>
          <button onclick="buy('${c.symbol}','${c.name}',${c.current_price})">Buy</button>
          <button onclick="sell('${c.symbol}','${c.name}',${c.current_price})">Sell</button>
          <button onclick="watch('${c.symbol}','${c.name}')">Watchlist</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (e) {
    alert('Crypto load failed');
  }

  loadPortfolio(); loadWatchlist(); loadProfile();
})();

async function buy(symbol, name, price) { /*... same as before ...*/ }
async function sell(symbol, name, price) { /*... same*/ }
async function watch(symbol, name) { /*...*/ }

async function loadPortfolio() { /*...*/ }
async function loadWatchlist() { /*...*/ }
async function loadProfile() { /*...*/ }
async function loadTransactions() { /*...*/ }

function logout() {
  fetch('/logout').then(() => location.href = '/');
}
