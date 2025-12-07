async function shorten() {
  const longUrl = document.getElementById("longUrl").value;

  const res = await fetch("https://YOUR_BACKEND_URL/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl })
  });

  const data = await res.json();

  document.getElementById("result").innerHTML =
    `<strong>Short URL:</strong> <br> ${data.shortUrl}`;
}
