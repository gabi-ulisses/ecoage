<?php 
require("../database/usuario.php");

$id_usuario = $_POST["id_usuario"];
$nome_completo = $_POST["nome_completo"];
$data_nasc = $_POST["data_nasc"];
$tel = $_POST["tel"];
$apelido = $_POST["apelido"];
$email = $_POST["email_cadastro"];
$senha = $_POST["senha_cadastro"];
$id_avatar = $_POST["id_avatar"];

editarUsuario($nome_completo, $data_nasc, $tel, $apelido, $email, $senha, $id_usuario, $id_avatar);
header("Location: edicao_usuario.php");

?>
