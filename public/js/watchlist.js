(async function loadWatchlist() {
  try {
    const data = await fetchJSON('/watchlist');
    const list = document.getElementById('watchlistItems');
    list.innerHTML = ''; // Clear any existing items
    data.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.name} (${c.symbol.toUpperCase()}) `;

      const btn = document.createElement('button');
      btn.textContent = 'Remove';
      btn.onclick = async () => {
        try {
          await fetch(`/watchlist/${c.symbol}`, { method: 'DELETE' });;
          li.remove(); // Remove item from DOM
        } catch (err) {
          alert('Failed to remove: ' + err.message);
        }
      };

      li.appendChild(btn);
      list.appendChild(li);
    });
  } catch(err) {
    alert(err.message);
  }
})();
