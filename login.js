console.log("hallo")

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
console.log(email)
    try {
        const response = await fetch('/IntranetOnlineShop-Ngomi/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, password })
        });
console.log(response)
        const result = await response.json();
console.log(result)
        const messageDiv = document.getElementById('response-message');
        messageDiv.innerHTML = response.ok
            ? `<p class="success">${result.message}</p>`
            : `<p class="error">${result.error}</p>`;
    } catch (error) {
        console.error('Erreur :', error);
        document.getElementById('response-message').innerHTML = `<p class="error">Une erreur s'est produite.</p>`;
    }
});
