// Rediriger vers la page Warenkorb

// Ajout d'un produit au panier
const addToCart = (product) => {
    // Récupération du panier actuel depuis localStorage ou création d'un panier vide
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Vérification si le produit existe déjà dans le panier
    const existingProduct = currentCart.find(item => item.product_id === product.product_id);

    if (existingProduct) {
        // Si le produit existe, augmenter la quantité
        existingProduct.quantity += 1;
    } else {
        // Sinon, ajouter un nouveau produit avec une quantité initiale de 1
        currentCart.push({ ...product, quantity: 1 });
    }

    // Mise à jour du panier dans le localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));

      // Met à jour le compteur d'articles dans le bouton sans recharger la page
      updateCartCount();  // Appel direct à la fonction pour mettre à jour le compteur

    // Met à jour l'affichage du panier
    displayCart();
    
     // Confirmation visuelle pour l'utilisateur
     // Affiche une alerte confirmant l'ajout
     alert(`${product.title} wurde zum Warenkorb hinzugefügt.`); 
};

// Mettre à jour le compteur d'articles du panier
// Cette fonction met à jour immédiatement le nombre d'articles dans le bouton panier 
const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Récupère le panier du localStorage
    
    // Calcule le nombre total d'articles (en tenant compte de la quantité de chaque produit)
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Trouve l'élément HTML où le compteur doit être affiché
    const cartCountElement = document.getElementById('cart-count');

    // Si l'élément existe, met à jour le texte avec le nombre total d'articles
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }
    console.log('Nombre d\'articles dans le panier:', totalCount); // Vérification dans la console
};


// Afficher les articles du panier Ajout d'une fonction pour récupérer et afficher le panier depuis localStorage.
// Afficher les articles du panier
const displayCart = () => {
    // Sélection de l'élément HTML où afficher les articles du panier
    const cartItemsDiv = document.getElementById('cart-items');

    // Récupération du panier depuis localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Réinitialisation de l'affichage du panier
    cartItemsDiv.innerHTML = '';

    if (currentCart.length === 0) {
        // Affiche un message si le panier est vide
        cartItemsDiv.innerHTML = '<p>Ihr Warenkorb ist leer.</p>';
        return;
    }

     // Générer le contenu du panier
      let total = 0; // Initialisation du total du panier

    // Parcours de chaque produit dans le panier
    currentCart.forEach(item => {
        // Création d'un élément HTML pour afficher le produit
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        // Contenu HTML pour chaque produit (nom, quantité, prix, bouton pour supprimer)
        itemElement.innerHTML = `
            <p><strong>${item.title}</strong> - ${item.quantity} Stück</p>
            <p>Preis: ${item.price} €</p>
            <button data-id="${item.product_id}" class="remove-btn">Entfernen</button>
        `
        ;

        // Ajout de l'élément au conteneur du panier
        cartItemsDiv.appendChild(itemElement);

        // Calcul du total
        total += item.quantity * item.price;  //calcule le total des produits 
    });

    // Création d'un élément HTML pour afficher le total
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `<h2>Total: ${total.toFixed(2)} €</h2>`;

    // Ajout du total au conteneur du panier
    cartItemsDiv.appendChild(totalDiv);
};
// Gérer la suppression d'un produit
document.addEventListener('click', (e) => {
    // Vérifie si l'utilisateur a cliqué sur un bouton "Supprimer"
    if (e.target.classList.contains('remove-btn')) {
        // Récupère l'ID du produit à partir de l'attribut "data-id"
        const productId = e.target.getAttribute('data-id');

        // Appelle la fonction de suppression du produit
        removeFromCart(productId);
    }
});

// Supprimer ou diminuer la quantité d'un article dans le panier
// Cette fonction permet de réduire la quantité d'un produit, ou de le supprimer si la quantité atteint zéro

const removeFromCart = (productId) => {

    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];// Récupère les articles du panier Aactuel

    // Filtre les articles pour exclure celui à supprimer
    currentCart = currentCart.filter(item => item.product_id != productId);

    // Mise à jour du panier dans localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));

    
    displayCart();// Met à jour l'affichage et le compteur
    updateCartCount();// Met à jour le compteur

    // Affiche une confirmation
    alert('Artikel wurde entfernt.'); // Alerte que l'article a été retiré
};

// Valider la commande et envoyer les données au serveur
// Valider la commande
const placeOrder = async () => {
    // Récupération du panier
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    if (currentCart.length === 0) {
        // Avertit si le panier est vide
        alert('Ihr Warenkorb ist leer.');
        return;
    }

    try {
        // Envoie les données du panier au serveur via une requête POST
        const response = await fetch('/IntranetOnlineShop-Ngomi/api/place-order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: currentCart })
        });

        // Analyse la réponse du serveur
        const data = await response.json();

        if (data.success) {
            // Cache le panier et affiche un message de confirmation
            document.getElementById('cart-section').style.display = 'none';// Masque le panier
            const confirmationDiv = document.getElementById('order-confirmation');
            document.getElementById('order-confirmation').style.display = 'block';

            // Vide le panier
            localStorage.removeItem('cart'); //vide le panier 
        } else {
            alert(`Fehler: ${data.message}`); // Alerte en cas d'erreur
        }
    } catch (error) {
        // Gère les erreurs lors de l'envoi
        console.error('Fehler bei der Bestellung:', error);
        alert('Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.');// Alerte d'erreur générale
    }
};

// Rediriger vers la page Warenkorb
const goToCart = () => {
    window.location.href = 'warenkorb.html';
};

// Gérer la suppression d'un produit
// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    
    updateCartCount();// Met à jour le compteur
    displayCart(); // Affiche les articles
});



