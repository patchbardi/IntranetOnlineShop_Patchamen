<?php
// get-products.php : Récupération des produits depuis la base de données avec pagination

// Inclusion du fichier de configuration de la base de données
require_once 'config.php';

// Définir le type de contenu pour la réponse JSON
header('Content-Type: application/json');

try {
    // Récupérer les paramètres `limit` et `offset` depuis l'URL
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10; // Limite par défaut : 10
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0; // Départ par défaut : 0

    // Requête SQL avec LIMIT et OFFSET pour la pagination
    $query = "SELECT product_id, title, description, price, image_url, created_at 
              FROM product 
              LIMIT ? OFFSET ?";

    // Préparer la requête
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Erreur de préparation de la requête : " . $conn->error);
    }

    // Lier les paramètres
    $stmt->bind_param("ii", $limit, $offset);

    // Exécuter la requête
    $stmt->execute();

    // Récupérer les résultats
    $result = $stmt->get_result();

    // Vérifier si la requête retourne des résultats
    if ($result === false) {
        throw new Exception("Erreur lors de l'exécution de la requête SQL.");
    }

    // Création d'un tableau pour stocker les produits
    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Vérification si l'image existe dans le dossier images/
        if (!file_exists(__DIR__ . '/../images/' . $row['image_url'])) {
            $row['image_url'] = 'image3.jpg'; // Image par défaut si le fichier est manquant
        }
        $products[] = $row;
    }

    // Retourner les produits sous forme de JSON
    echo json_encode($products);
} catch (Exception $e) {
    // En cas d'erreur, renvoyer un message JSON avec un code d'erreur
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    // Fermer la connexion à la base de données
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
