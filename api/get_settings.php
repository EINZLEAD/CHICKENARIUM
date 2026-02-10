<?php
session_start();
header("Content-Type: application/json");
require "db.php";

// 1. Check kung Login
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["redirect" => "login.html"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$username = $_SESSION['username'];

// --- AUTO-FIX LOGIC START ---

// Check 1: Meron na bang record ang user na ito?
$check_me = $conn->query("SELECT id FROM farm_settings WHERE user_id = $user_id LIMIT 1");

if ($check_me->num_rows > 0) {
    // SCENARIO A: Meron ka nang sariling record.
    // ACTION: Burahin lahat ng user_id = 0 para walang duplicate na kalat.
    $conn->query("DELETE FROM farm_settings WHERE user_id = 0");
} else {
    // SCENARIO B: Wala ka pang record, pero baka merong naiwan na user_id = 0 (galing sa registration).
    // ACTION: Angkinin mo 'yun (Ilipat sa pangalan mo).
    $conn->query("UPDATE farm_settings SET user_id = $user_id WHERE user_id = 0");
}

// --- AUTO-FIX LOGIC END ---


// 2. Ngayon, kunin na natin ang malinis na data
$stmt = $conn->prepare("SELECT * FROM farm_settings WHERE user_id = ? ORDER BY id DESC LIMIT 1");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $row['found'] = true;
    $row['username'] = $username;
    echo json_encode($row);
} else {
    // Kung talagang wala (Fresh Account)
    echo json_encode([
        "found" => false,
        "username" => $username,
        "farm_id" => "FARM-" . date("Y") . "-" . strtoupper(bin2hex(random_bytes(2)))
    ]);
}

$stmt->close();
$conn->close();
?>