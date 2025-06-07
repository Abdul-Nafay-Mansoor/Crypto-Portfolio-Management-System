document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const r = await fetch('/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  alert((await r.json()).message);
});

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const r = await fetch('/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  const j = await r.json();
  if (j.success) return window.location.href = '/dashboard.html';
  alert(j.message);
});
