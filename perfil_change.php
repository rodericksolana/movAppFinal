
<?php
header('Access-Control-Allow-Origin: *');
//configuracion de la base de datos
$db_name  = 'pddm_1129839';
$hostname = 'localhost';
$username = '1129839_user';
$password = '1129839';
//capturamos el flujo de entrada JSON que viene en el request HTTP
//la funcion get_contents("..") nos permite obtener el contenido (body) del request HTTP.
$jsonData = file_get_contents("php://input");
//deserealizacion para convertir un string en formato JSON a un objeto Alumno
$data = json_decode($jsonData);
//$fecha = date('Y-m-d');

//conexion a la base de datos
$conexion = new PDO("mysql:host=$hostname;dbname=$db_name", $username, $password);
           //or die ("Error al conectarse a la base de datos");
//hacemos el query

$sql = "update Personas set imagen = :imagen where idPersonas = :idPersonas";
$q = $conexion->prepare($sql);
//echo "idPersona: " . $data->idPersona . "\n";
// echo "hashtag: " . $data->hashtag . "\n";
$result = $q->execute(array(":imagen"=>$data->imagen,
                        ":idPersonas"=>$data->idPersonas));

if ($result) {
    echo json_encode(array("result" => 1));
} else {
    echo json_encode(array("result" => 0));
}
//cerramos conexion
$conexion = NULL;
?>
