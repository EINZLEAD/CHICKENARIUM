<?php
session_start();
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

// Hanapin ang user
$stmt = $conn->prepare("SELECT id, fullname, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        // SUCCESS: I-save ang ID sa session
        $_SESSION['user_id'] = $row['id']; 
        $_SESSION['username'] = $username;
        $_SESSION['fullname'] = $row['fullname'];

        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Incorrect Password"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "User not found"]);
}
$stmt->close();
$conn->close();
?>