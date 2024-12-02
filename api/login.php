<?php
// login.php : Authentification d'un utilisateur

require_once 'config.php'; // Connexion à la base de données

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Vérifier si les champs email et mot de passe sont bien envoyés
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email']; // Email de l'utilisateur
        $password = $_POST['password']; // Mot de passe de l'utilisateur

        // Recherche de l'utilisateur dans la base de données
        $query = "SELECT * FROM user WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Vérification du mot de passe
            if (password_verify($password, $user['password'])) {
                echo json_encode(['message' => 'Connexion réussie']);
            } else {
                echo json_encode(['error' => 'Mot de passe incorrect']);
            }
        } else {
            echo json_encode(['error' => 'Utilisateur introuvable']);
        }
    } else {
        echo json_encode(['error' => 'Email et mot de passe sont requis']);
    }
}
?>
