<?php
require 'configuracion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = json_decode(file_get_contents("php://input"));
    
    if (!isset($datos->usuario) || !isset($datos->clave)) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan datos"]);
        exit();
    }

    $sentencia = $conexion->prepare("SELECT id, usuario, clave, rol FROM usuarios WHERE usuario = ?");
    $sentencia->execute([$datos->usuario]);
    $usuario = $sentencia->fetch(PDO::FETCH_ASSOC);

    // Comparación MD5 (según tu requerimiento actual)
    if ($usuario && md5($datos->clave) === $usuario['clave']) {
        $carga_util = [
            'id' => $usuario['id'],
            'usuario' => $usuario['usuario'],
            'rol' => $usuario['rol'],
            'exp' => time() + 3600
        ];
        http_response_code(200);
        echo json_encode([
            "token" => generarJWT($carga_util, $clave_secreta), 
            "rol" => $usuario['rol']
        ]);
    } else {
        //http_response_code(401);
        echo json_encode(["error" => "Credenciales incorrectas"]);
    }
}
?>