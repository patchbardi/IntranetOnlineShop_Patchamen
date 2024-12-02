
<?php
require_once 'config.php'; // Inclut la connexion à la base de données

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Vérifier les entrées utilisateur
        if (filter_var($email, FILTER_VALIDATE_EMAIL) && strlen($password) >= 8) {
            // Afficher les valeurs reçues pour le débogage
            error_log("Email: $email, Password: $password");
            
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            $query = "INSERT INTO user (email, password) VALUES (?, ?)";
            $stmt = $conn->prepare($query);

            if ($stmt === false) {
                die(json_encode(['error' => 'Erreur de préparation de la requête : ' . $conn->error]));
            }

            $stmt->bind_param("ss", $email, $hashed_password);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Inscription réussie']);
            } else {
                die(json_encode(['error' => 'Erreur d\'exécution de la requête : ' . $stmt->error]));
            }
        } else {
            echo json_encode(['error' => 'Données invalides : Email ou mot de passe incorrect']);
        }
    } else {
        echo json_encode(['error' => 'Email et mot de passe sont requis']);
    }
} else {
    echo json_encode(['error' => 'Méthode non autorisée']);
}
?>

