<?php
require 'configuracion.php';

if (!validarJWT()) {
    http_response_code(401);
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sentencia = $conexion->query("SELECT * FROM productos");
    echo json_encode($sentencia->fetchAll(PDO::FETCH_ASSOC));
}
?>