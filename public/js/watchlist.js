(async function loadWatchlist() {
  try {
    const data = await fetchJSON('/watchlist');
    const list = document.getElementById('watchlistItems');
    data.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.name} (${c.symbol.toUpperCase()})`;
      list.appendChild(li);
    });
  } catch(err) {
    alert(err.message);
  }
})();