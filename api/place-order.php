<?php
require_once 'config.php'; // Inclure la connexion à la base de données

header('Content-Type: application/json'); // Sortie au format JSON
error_reporting(E_ALL);
ini_set('display_errors', 0); // Ne pas afficher les erreurs directement
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.txt'); // Journaliser les erreurs

ob_start(); // Commencer la capture de sortie pour éviter les erreurs inattendues

// Vérifier si les données du panier ont été envoyées
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Récupérer les données envoyées en JSON
    $data = json_decode(file_get_contents('php://input'), true);
    error_log(print_r($data, true));

    // Vérifier que les données contiennent un panier
    // Vérifier si le JSON est valide
if (json_last_error() !== JSON_ERROR_NONE) {
    ob_end_clean();
        echo json_encode(['success' => false, 'message' => 'JSON invalide : ' . json_last_error_msg()]);
        exit;
    }
    // Vérifier que les données contiennent un panier
    if (isset($data['cart']) && is_array($data['cart']) && count($data['cart']) > 0) {
        // Démarrer une transaction pour garantir l'intégrité des données
        $conn->begin_transaction();

        try {
           
            // Définir les variables à insérer dans la base de données
            $user_id = 1; // Remplacez par l'ID réel de l'utilisateur authentifié
            $total_price = 0; // Initialiser le prix total à 0
             
             // Créer une nouvelle commande
             $query = "INSERT INTO `order` (user_id, total_price, status) VALUES (?, ?, 'pending')";
             error_log ($query);
             error_log ($user_id);
             error_log ($total_price);
             
             $stmt = $conn->prepare($query);
              // Lier les paramètres en précisant les types : "id" signifie un entier pour $user_id et un nombre flottant pour $total_price
         $stmt->bind_param("id", $user_id, $total_price);

            if (!$stmt->execute()) {
                throw new Exception("Erreur lors de l'ajout de la commande.");
            }
            $order_id = $conn->insert_id; // Récupérer l'ID de la commande insérée
            error_log ($order_id);

            // Calculer le total et insérer les articles dans la table order_item
            foreach ($data['cart'] as $item) {
                if (!isset($item['product_id'], $item['quantity'], $item['price'])) {
                    throw new Exception("Données de produit manquantes ou invalides.");
                }

                $product_id = $item['product_id'];
                $quantity = $item['quantity'];
                $unit_price = $item['price'];
                $total_price += $quantity * $unit_price;

                // Insérer l'article dans la table order_item
                $query = "INSERT INTO order_item (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("iiid", $order_id, $product_id, $quantity, $unit_price);

                if (!$stmt->execute()) {
                    throw new Exception("Erreur lors de l'ajout de l'article dans la commande.");
                }
            }

            // Mettre à jour le total de la commande
            $query = "UPDATE `order` SET total_price = ? WHERE order_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("di", $total_price, $order_id);
            $stmt->execute();

            // Commit de la transaction
            $conn->commit();

            ob_end_clean();
            // Retourner une réponse au client
            echo json_encode(['success' => true, 'message' => 'Commande réussie']);
        } catch (Exception $e) {
            // Rollback en cas d'erreur
            $conn->rollback();
            ob_end_clean();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    } else {
        ob_end_clean();
        echo json_encode(['success' => false, 'message' => 'Aucun produit dans le panier']);
        exit;
    }
} else {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Méthode HTTP invalide']);
    exit;
}
?>
