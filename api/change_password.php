<?php
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) { echo json_encode(["error" => "No data"]); exit; }

$username = $data['username'];
$current_pass = $data['current_password'];
$new_pass = $data['new_password'];

// 1. Check User
$stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "User not found"]); exit;
}

$row = $result->fetch_assoc();
$hashed_password_db = $row['password'];

// 2. Verify Old Password
if (password_verify($current_pass, $hashed_password_db)) {
    
    // 3. Hash New Password & Update
    $new_hashed = password_hash($new_pass, PASSWORD_DEFAULT);
    $upd = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
    $upd->bind_param("ss", $new_hashed, $username);
    
    if ($upd->execute()) { echo json_encode(["success" => true]); }
    else { echo json_encode(["error" => "DB Error"]); }
    
    $upd->close();
} else {
    echo json_encode(["error" => "Incorrect current password"]);
}

$stmt->close(); $conn->close();
?>