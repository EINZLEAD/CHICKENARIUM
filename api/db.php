<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "chickenarium";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "DB Connection Failed: " . $conn->connect_error]));
}
?>