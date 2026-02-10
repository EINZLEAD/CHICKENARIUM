<?php
// api/save_detection.php
// Ito ang tatawagin ng Python script niyo sa Raspberry Pi
header("Content-Type: application/json");
require "db.php";

// Tumatanggap ng JSON data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if(isset($input['status'])) {
    $status = $input['status'];     // Example: "Critical"
    $symptoms = $input['symptoms']; // Example: "Coughing"
    $remarks = $input['remarks'];   // Example: "Loud noise detected"
    $zone = isset($input['zone']) ? $input['zone'] : ''; // Example: "A"

    $stmt = $conn->prepare("INSERT INTO detection_history (health_status, symptoms, remarks, zone) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $status, $symptoms, $remarks, $zone);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Record saved successfully"]);
    } else {
        echo json_encode(["error" => "Database error"]);
    }
} else {
    echo json_encode(["error" => "Invalid data"]);
}
?>