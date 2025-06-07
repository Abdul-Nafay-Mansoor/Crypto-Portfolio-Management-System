async function register(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  alert(await res.text());
}

async function login(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  if (res.ok) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    loadDashboard();
    loadPortfolio();
    loadWatchlist();
    loadProfile();
    showSection('dashboard');
  } else alert(await res.text());
}

function logout() {
  fetch('/logout').then(() => location.reload());
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

async function loadDashboard() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30');
  const data = await res.json();
  const tbody = document.querySelector('#dashboardTable tbody');
  tbody.innerHTML = '';
  data.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.symbol.toUpperCase()}</td>
      <td>${c.name}</td>
      <td>$${c.current_price}</td>
      <td>$${c.market_cap.toLocaleString()}</td>
      <td>
        <button onclick="buy('${c.symbol}','${c.name}',${c.current_price})">Buy</button>
        <button onclick="sell('${c.symbol}',${c.current_price})">Sell</button>
        <button onclick="watch('${c.symbol}','${c.name}')">Watchlist</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function buy(symbol, name, price) {
  const amount = parseFloat(prompt(`How much ${symbol.toUpperCase()} to buy?`));
  if (!isNaN(amount)) {
    const res = await fetch('/buy', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
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
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ symbol, amount, price })
    });
    if (!res.ok) alert(await res.text());
    loadPortfolio();
    loadProfile();
  }
}

async function watch(symbol, name) {
  await fetch('/watchlist', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ symbol, name })
  });
  loadWatchlist();
}

async function loadPortfolio() {
  const res = await fetch('/portfolio');
  const data = await res.json();
  const tbody = document.querySelector('#portfolioTable tbody');
  tbody.innerHTML = '';
  data.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.symbol}</td><td>${c.amount}</td>`;
    tbody.appendChild(tr);
  });
}

async function loadWatchlist() {
  const res = await fetch('/watchlist');
  const data = await res.json();
  const list = document.getElementById('watchlistItems');
  list.innerHTML = '';
  data.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.name} (${c.symbol.toUpperCase()})`;
    list.appendChild(li);
  });
}

async function loadProfile() {
  const res = await fetch('/profile');
  const data = await res.json();
  document.getElementById('userInfo').innerText = `Username: ${data.username}\nBalance: $${parseFloat(data.balance).toFixed(2)}`;
}

async function addFunds(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  await fetch('/add-funds', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  loadProfile();
}
