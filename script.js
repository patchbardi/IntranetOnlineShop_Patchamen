async function getProducts() {
    try {
        // Effectuer une requête vers l'API
        const response = await fetch('http://172.28.161.111/IntranetOnlineShop-Ngomi/api/get-products.php');

        // Vérifier si la réponse est valide
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
        }

        // Convertir la réponse en JSON
        const products = await response.json();

        // Vérifier si la réponse contient une erreur
        if (products.error) {
            throw new Error(products.error);
        }

        // Sélectionner la zone où afficher les produits
        const productsList = document.getElementById('products-list');

        // Vider le contenu précédent de la liste
        productsList.innerHTML = '';// Réinitialiser la liste

        if (products.length === 0) {
            productsList.innerHTML = '<p>Keine Produkte verfügbar.</p>';
            return;
        }

        // Parcourir les produits récupérés
        products.forEach(product => {
            // Créer une carte pour chaque produit
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // Ajouter les informations du produit dans la carte
            productCard.innerHTML = `
            <img src="images/${product.image_url}" alt="${product.title}" class="product-image">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p><strong>Preis:</strong> ${product.price} €</p>
             <button onclick='addToCart(${JSON.stringify(product)})'>In den Warenkorb</button>
        `;

            // Ajouter la carte à la liste des produits
            productsList.appendChild(productCard);
        });
    } catch (error) {
        // Gérer les erreurs en les affichant dans la console
        console.error('Fehler beim Laden der Produkte:', error);

        // Afficher un message d'erreur à l'utilisateur
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = `<p class="error">Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.</p>`;
    }
}

// Lancer la fonction une fois que la page est chargée
document.addEventListener('DOMContentLoaded', getProducts);

