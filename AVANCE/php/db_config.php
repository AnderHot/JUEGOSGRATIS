<?php

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'game_drop_db');      
define('DB_PASSWORD', '[WM5sHoJPEsMaEN*');          
define('DB_NAME', 'game_drop_db');  


$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Verificar la conexión
if ($mysqli->connect_error) { 
    die("ERROR: No se pudo conectar. " . $mysqli->connect_error);
}

$mysqli->set_charset("utf8mb4");
?>