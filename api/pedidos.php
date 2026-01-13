<?php
require 'configuracion.php';

$datosUsuario = validarJWT();
if (!$datosUsuario) {
    http_response_code(401);
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = json_decode(file_get_contents("php://input"));
    $itemsJson = json_encode($datos->items);
    
    $sentencia = $conexion->prepare("INSERT INTO pedidos (usuario_id, total, items_json) VALUES (?, ?, ?)");
    if ($sentencia->execute([$datosUsuario['id'], $datos->total, $itemsJson])) {
        http_response_code(201); //
        echo json_encode(["mensaje" => "Pedido guardado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error en la base de datos"]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($datosUsuario['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Requiere permisos de administrador"]);
        exit();
    }
    
    $sql = "SELECT pedidos.*, usuarios.usuario 
            FROM pedidos 
            JOIN usuarios ON pedidos.usuario_id = usuarios.id 
            ORDER BY fecha DESC";
    $sentencia = $conexion->query($sql);
    http_response_code(200);
    echo json_encode($sentencia->fetchAll(PDO::FETCH_ASSOC));
}
?>