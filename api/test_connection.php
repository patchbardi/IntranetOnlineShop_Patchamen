
<?php
require_once 'config.php'; // Vérifiez si le fichier de configuration est bien inclus

// Tester la connexion
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
} else {
    echo "Connexion réussie à la base de données !";
}
?>
