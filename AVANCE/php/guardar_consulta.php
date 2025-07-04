<?php
require_once 'db_config.php';

header('Content-Type: application/json');
$response = ['success' => false, 'message' => 'Error: No se pudo procesar la solicitud.', 'email_sent' => false]; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre_completo = trim($_POST['nombre'] ?? '');
    $email_usuario = trim($_POST['email'] ?? '');
    $asunto_consulta = trim($_POST['asunto'] ?? '');
    $mensaje_consulta = trim($_POST['mensaje'] ?? '');

    if (empty($nombre_completo) || empty($email_usuario) || empty($asunto_consulta) || empty($mensaje_consulta)) {
        $response['message'] = "Por favor, completa todos los campos del formulario.";
    } elseif (!filter_var($email_usuario, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = "El formato del correo electrónico del remitente no es válido.";
    } else {
        
        $sql = "INSERT INTO consultas_contacto (nombre_completo, email, asunto, mensaje, leido) VALUES (?, ?, ?, ?, ?)"; 
        $leido_valor = 1; 

        if ($stmt = $mysqli->prepare($sql)) {
           
            $stmt->bind_param("ssssi", $nombre_completo, $email_usuario, $asunto_consulta, $mensaje_consulta, $leido_valor);

            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = "¡Gracias por tu mensaje, " . htmlspecialchars($nombre_completo) . "! Tu consulta ha sido recibida.";

            } else {
                $response['message'] = "Error al guardar tu consulta. Por favor, inténtalo de nuevo más tarde.";
            }
            $stmt->close();
        } else {
            $response['message'] = "Error al preparar la consulta. Por favor, inténtalo de nuevo más tarde.";
        }
    }
} else {
    $response['message'] = "Método de solicitud no válido.";
}

$mysqli->close();
echo json_encode($response);
?>