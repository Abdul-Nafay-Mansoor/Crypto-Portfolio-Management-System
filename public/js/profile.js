document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchJSON('/profile');
    document.getElementById('userInfo').innerText =
      `Username: ${data.username}\nBalance: $${parseFloat(data.balance).toFixed(2)}`;
  } catch(err) {
    alert(err.message);
  }
});

document.getElementById('addFundsForm').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const formData = Object.fromEntries(new FormData(e.target));
    await fetchJSON('/add-funds', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(formData)
    });
    location.reload();
  } catch(err) {
    alert(err.message);
  }
});