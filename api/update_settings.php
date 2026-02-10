<?php
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

// Kung may ID na pinasa, UPDATE ang gagawin
if (!empty($data['id'])) {
    $sql = "UPDATE farm_settings SET 
            farm_name=?, farm_type=?, number_of_chickens=?, farm_location=?, 
            owner_name=?, owner_email=?, owner_phone=? 
            WHERE id=?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssissssi", 
        $data['farm_name'], $data['farm_type'], $data['number_of_chickens'], $data['farm_location'], 
        $data['owner_name'], $data['owner_email'], $data['owner_phone'], $data['id']
    );
} else {
    echo json_encode(["error" => "No ID provided for update"]);
    exit;
}

if ($stmt->execute()) { echo json_encode(["success" => true]); } 
else { echo json_encode(["error" => $stmt->error]); }

$stmt->close(); $conn->close();
?>