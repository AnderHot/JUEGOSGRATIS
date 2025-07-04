<?php

require_once 'db_config.php';
session_start();

header('Content-Type: application/json');
$response = ['success' => false, 'message' => 'Error desconocido.'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['loginEmail']); // <-- Ya tenemos el email aquí
    $contrasena = trim($_POST['loginPassword']);

    if (empty($email) || empty($contrasena)) {
        $response['message'] = "Por favor, ingresa email y contraseña.";
    } else {
        $sql = "SELECT id, nombre_usuario, contrasena_hash FROM usuarios WHERE email = ?";
        if ($stmt = $mysqli->prepare($sql)) {
            $stmt->bind_param("s", $email);
            if ($stmt->execute()) {
                $stmt->store_result();
                if ($stmt->num_rows == 1) {
                    $stmt->bind_result($id, $nombre_usuario, $hashed_password);
                    if ($stmt->fetch()) {
                        if (password_verify($contrasena, $hashed_password)) {
                            $_SESSION['loggedin'] = true;
                            $_SESSION['id'] = $id;
                            $_SESSION['nombre_usuario'] = $nombre_usuario;
                            $_SESSION['email_usuario'] = $email; // <-- AÑADIR EMAIL A LA SESIÓN

                            $response['success'] = true;
                            $response['message'] = "Inicio de sesión exitoso.";
                            
                        } else {
                            $response['message'] = "La contraseña ingresada no es válida.";
                        }
                    }
                } else {
                    $response['message'] = "No se encontró una cuenta con ese email.";
                }
            } else {
                $response['message'] = "Algo salió mal. Inténtalo de nuevo.";
            }
            $stmt->close();
        } else {
            $response['message'] = "Error en la preparación de la consulta: " . $mysqli->error;
        }
    }
} else {
    $response['message'] = "Método de solicitud no válido.";
}

$mysqli->close();
echo json_encode($response);
?>