<?php
include 'db.php';

$sql = "SELECT detected_at, health_status, symptoms, remarks 
        FROM chicken_monitoring 
        ORDER BY detected_at DESC";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>
