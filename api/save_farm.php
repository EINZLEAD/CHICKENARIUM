<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header("Content-Type: application/json");
require "db.php"; 

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) { echo json_encode(["error" => "No JSON received"]); exit; }

$sql = "INSERT INTO farm_settings (
  farm_name, farm_id, owner_name, owner_phone, owner_email, farm_location, 
  farm_type, number_of_chickens, units, notify_sms, notify_email, notify_push, enable_alerts
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

$stmt = $conn->prepare($sql);
if (!$stmt) { echo json_encode(["error" => "Prepare failed: " . $conn->error]); exit; }

$stmt->bind_param("sssssssisiiii",
  $data["farm_name"], $data["farm_id"], $data["owner_name"], $data["owner_phone"], 
  $data["owner_email"], $data["farm_location"], $data["farm_type"], 
  $data["number_of_chickens"], $data["units"], 
  $data["notify_sms"], $data["notify_email"], $data["notify_push"], $data["enable_alerts"]
);

if ($stmt->execute()) { echo json_encode(["success" => true]); } 
else { echo json_encode(["error" => $stmt->error]); }

$stmt->close(); $conn->close();
?>