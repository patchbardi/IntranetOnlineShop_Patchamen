<?php
// config.php : Fichier de connexion à la base de données

// Informations de connexion
$host = 'localhost';
$username = 'diane';
$password = 'Louise';
$database = 'fi36_Ngomi_fpadw';

error_reporting(E_ALL); // Affiche toutes les erreurs
ini_set('display_errors', 1); // Assure l'affichage des erreurs

// Connexion à la base de données
$conn = new mysqli($host,
                 $username,
                  $password, 
                  $database);

