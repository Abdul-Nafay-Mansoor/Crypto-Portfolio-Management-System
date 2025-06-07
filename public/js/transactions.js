async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log("Loading transactions...");
    const transactions = await fetchJSON('/transactions');
    console.log("Received data:", transactions);

    const table = document.getElementById('transactionTable');
    if (!table) throw new Error("HTML table not found!");

    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    if (transactions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No transactions yet. Buy or sell crypto to see history.</td></tr>`;
      return;
    }

    transactions.forEach(t => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${t.type?.toUpperCase() || 'N/A'}</td>
        <td>${t.symbol?.toUpperCase() || 'N/A'}</td>
        <td>${t.name || 'N/A'}</td>
        <td>${parseFloat(t.amount).toFixed(8)}</td>
        <td>$${parseFloat(t.price).toFixed(2)}</td>
        <td>$${parseFloat(t.total).toFixed(2)}</td>
        <td>${new Date(t.timestamp).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Transaction load failed:", err);
    alert(`Error: ${err.message}\nCheck console for details.`);
  }
});

document.getElementById('logoutLink')?.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await fetch('/logout');
    window.location.href = 'index.html';
  } catch (err) {
    console.error('Logout failed:', err);
    alert('Logout failed. Try again.');
  }
});
