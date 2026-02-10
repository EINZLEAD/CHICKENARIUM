<?php
header("Content-Type: application/json");
require "db.php";

$res = $conn->query("SELECT * FROM farm_settings LIMIT 1");

echo $res->num_rows === 0
  ? json_encode(null)
  : json_encode($res->fetch_assoc());
