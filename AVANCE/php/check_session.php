<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo json_encode([
        'isLoggedIn' => true,
        'username' => $_SESSION['nombre_usuario'],
        'email' => $_SESSION['email_usuario'] ?? '' 
    ]);
} else {
    echo json_encode(['isLoggedIn' => false]);
}
?>