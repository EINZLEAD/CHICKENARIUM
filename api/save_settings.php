<?php
$conn = new mysqli("localhost", "root", "", "chickenarium_db"); // database name updated
if ($conn->connect_error) { die("DB Connection failed"); }

$data = json_decode(file_get_contents("php://input"), true);

$farm = $conn->real_escape_string($data['farm_name']);
$owner = $conn->real_escape_string($data['owner_name']);
$phone = $conn->real_escape_string($data['owner_phone']);
$email = $conn->real_escape_string($data['owner_email']);
$threshold = (int)$data['suspected_threshold'];

$sql = "UPDATE farm_settings SET
  farm_name='$farm',
  owner_name='$owner',
  owner_phone='$phone',
  owner_email='$email',
  suspected_threshold='$threshold'
WHERE id=1";

if($conn->query($sql)){
    echo "Settings saved successfully";
}else{
    echo "Failed to save settings: " . $conn->error;
}
?>
