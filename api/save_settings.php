<?php
session_start();
header("Content-Type: application/json");
require "db.php";

// 1. Check kung kilala ang user
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Session expired. Please login again."]);
    exit;
}

$user_id = $_SESSION['user_id']; // Eto yung ID galing sa login (Example: 1)
$data = json_decode(file_get_contents("php://input"), true);

// 2. CHECK: Meron na bang farm ang user na ito?
$check_stmt = $conn->prepare("SELECT id FROM farm_settings WHERE user_id = ?");
$check_stmt->bind_param("i", $user_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
$exists = $check_result->num_rows > 0;
$check_stmt->close();

if ($exists) {
    // --- SCENARIO A: MERON NA -> UPDATE (Edit lang) ---
    // Hindi natin babaguhin ang farm_id dito, yung ibang details lang
    $sql = "UPDATE farm_settings SET 
            farm_name=?, farm_type=?, number_of_chickens=?, farm_location=?, 
            owner_name=?, owner_email=?, owner_phone=? 
            WHERE user_id=?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssissssi", 
        $data['farm_name'], $data['farm_type'], $data['number_of_chickens'], 
        $data['farm_location'], $data['owner_name'], $data['owner_email'], 
        $data['owner_phone'], 
        $user_id // WHERE clause
    );
    $msg = "Farm details updated successfully!";

} else {
    // --- SCENARIO B: WALA PA -> INSERT (Gumawa ng bago) ---
    // Dito lang tayo mag ge-generate ng Farm ID kasi first time
    $new_farm_id = $data['farm_id']; // Kunin yung nasa form (generated ng JS)

    $sql = "INSERT INTO farm_settings 
            (user_id, farm_name, farm_id, farm_type, number_of_chickens, farm_location, owner_name, owner_email, owner_phone) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssissss", 
        $user_id, $data['farm_name'], $new_farm_id, $data['farm_type'], 
        $data['number_of_chickens'], $data['farm_location'], 
        $data['owner_name'], $data['owner_email'], $data['owner_phone']
    );
    $msg = "New farm registered successfully!";
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => $msg]);
} else {
    echo json_encode(["success" => false, "error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>