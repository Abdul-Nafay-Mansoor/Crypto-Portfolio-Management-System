function fetchJSON(url, options) {
  return fetch(url, options)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });
}

