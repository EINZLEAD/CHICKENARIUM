<?php
// api/get_monitoring.php
date_default_timezone_set('Asia/Manila');
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require "db.php";

// Kukunin natin ang PINAKABAGONG 10 records lang
$sql = "SELECT id, health_status, symptoms, remarks, zone, 
        DATE_FORMAT(log_date, '%h:%i:%s %p') as short_time, -- Short time lang (e.g. 10:30:05 PM)
        DATE_FORMAT(log_date, '%M %d, %Y - %h:%i %p') as full_date 
        FROM detection_history 
        ORDER BY id DESC 
        LIMIT 10";

$result = $conn->query($sql);

$data = array();
if ($result) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
?>