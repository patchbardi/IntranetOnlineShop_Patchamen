document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupération des valeurs des champs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Envoi des données au serveur
        const response = await fetch('/IntranetOnlineShop-Ngomi/api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, password })
        });

        // Traitement de la réponse
        const result = await response.json();
        const messageDiv = document.getElementById('response-message');

        if (response.ok) {
            messageDiv.innerHTML = `<p class="success">${result.message}</p>`;
        } else {
            messageDiv.innerHTML = `<p class="error">${result.error}</p>`;
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
        document.getElementById('response-message').innerHTML = `<p class="error">Une erreur s'est produite. Veuillez réessayer.</p>`;
    }
});
