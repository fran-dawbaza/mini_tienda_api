<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$host = 'localhost';
$nombre_bd = 'shop_db';
$usuario_bd = 'root'; 
$clave_bd = '';     
$clave_secreta = 'MI_CLAVE_SECRETA_SUPER_SEGURA';

try {
    $conexion = new PDO("mysql:host=$host;dbname=$nombre_bd", $usuario_bd, $clave_bd);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit();
}

function generarJWT($datos, $secreto) {
    $cabecera = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $base64Cabecera = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($cabecera));
    $base64Datos = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($datos)));
    $firma = hash_hmac('sha256', $base64Cabecera . "." . $base64Datos, $secreto, true);
    $base64Firma = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($firma));
    return $base64Cabecera . "." . $base64Datos . "." . $base64Firma;
}

function validarJWT() {
    global $clave_secreta; // Acceder a variable global
    $cabeceras = apache_request_headers();
    if (!isset($cabeceras['Authorization'])) return false;
    
    $token = str_replace('Bearer ', '', $cabeceras['Authorization']);
    $partes = explode('.', $token);
    if(count($partes) !== 3) return false;
    
    $firma = hash_hmac('sha256', $partes[0] . "." . $partes[1], $clave_secreta, true);
    $base64Firma = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($firma));
    
    if ($base64Firma === $partes[2]) {
        return json_decode(base64_decode($partes[1]), true);
    }
    return false;
}
?>