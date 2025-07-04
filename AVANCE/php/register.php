<?php

require_once 'db_config.php';
session_start();

header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Error desconocido.'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre_usuario = trim($_POST['regUsuario']);
    $email = trim($_POST['regEmail']); // <-- Ya tenemos el email aquí
    $contrasena = trim($_POST['regPassword']);
    $confirmar_contrasena = trim($_POST['regConfirmPassword']);

    
    if (empty($nombre_usuario) || empty($email) || empty($contrasena) || empty($confirmar_contrasena)) {
        $response['message'] = "Por favor, completa todos los campos.";
    } elseif ($contrasena !== $confirmar_contrasena) {
        $response['message'] = "Las contraseñas no coinciden.";
    } elseif (strlen($contrasena) < 6) {
        $response['message'] = "La contraseña debe tener al menos 6 caracteres.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = "Formato de email inválido.";
    } else {
        $sql_check = "SELECT id FROM usuarios WHERE nombre_usuario = ? OR email = ?";
        if ($stmt_check = $mysqli->prepare($sql_check)) {
            $stmt_check->bind_param("ss", $nombre_usuario, $email);
            $stmt_check->execute();
            $stmt_check->store_result();

            if ($stmt_check->num_rows > 0) {
                $response['message'] = "El nombre de usuario o email ya están registrados.";
            } else {
                $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                $sql_insert = "INSERT INTO usuarios (nombre_usuario, email, contrasena_hash) VALUES (?, ?, ?)";
                if ($stmt_insert = $mysqli->prepare($sql_insert)) {
                    $stmt_insert->bind_param("sss", $nombre_usuario, $email, $contrasena_hash);
                    if ($stmt_insert->execute()) {
                        $response['success'] = true;
                        $response['message'] = "¡Registro exitoso!";
                        $_SESSION['loggedin'] = true;
                        $_SESSION['id'] = $mysqli->insert_id;
                        $_SESSION['nombre_usuario'] = $nombre_usuario;
                        $_SESSION['email_usuario'] = $email; // <-- AÑADIR EMAIL A LA SESIÓN
                    } else {
                        $response['message'] = "Algo salió mal al registrar. Inténtalo de nuevo.";
                    }
                    $stmt_insert->close();
                } else {
                    $response['message'] = "Error en la preparación de la consulta de inserción: " . $mysqli->error;
                }
            }
            $stmt_check->close();
        } else {
            $response['message'] = "Error en la preparación de la consulta de verificación: " . $mysqli->error;
        }
    }
} else {
    $response['message'] = "Método de solicitud no válido.";
}

$mysqli->close();
echo json_encode($response);
?>