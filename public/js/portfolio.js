(async function loadPortfolio() {
  try {
    const data = await fetchJSON('/portfolio');
    const tbody = document.querySelector('#portfolioTable tbody');
    tbody.innerHTML = '';
    data.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.symbol}</td><td>${c.amount}</td>`;
      tbody.appendChild(tr);
    });
  } catch(err) {
    alert(err.message);
  }
})();