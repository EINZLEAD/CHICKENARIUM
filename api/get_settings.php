<?php
$conn = new mysqli("localhost", "root", "", "chickenarium_db"); // database name updated
if ($conn->connect_error) { die("DB Connection failed"); }

$result = $conn->query("SELECT * FROM farm_settings WHERE id=1");
echo json_encode($result->fetch_assoc());
?>
