<?php
include 'db.php';

$sql = "SELECT detected_at, health_status, symptoms, remarks 
        FROM chicken_monitoring 
        ORDER BY detected_at DESC 
        LIMIT 20";

$result = $conn->query($sql);

$data = [];
$suspected = 0;

while($row = $result->fetch_assoc()){
    if($row['health_status'] === 'SUSPECTED'){
        $suspected++;
    }
    $data[] = $row;
}

echo json_encode([
    "suspected" => $suspected,
    "records" => $data
]);
?>
