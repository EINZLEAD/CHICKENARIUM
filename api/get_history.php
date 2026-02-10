<?php
// api/get_history.php
date_default_timezone_set('Asia/Manila');
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require "db.php";

// Kukunin natin ang 'log_date' at ifo-format bilang 'display_date'
$sql = "SELECT id, health_status, symptoms, remarks, zone, 
        DATE_FORMAT(log_date, '%M %d, %Y - %h:%i %p') as display_date 
        FROM detection_history 
        ORDER BY id DESC";

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