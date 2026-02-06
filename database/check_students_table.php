<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'wmsu_ed';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "=== CHECKING STUDENTS TABLE ===\n\n";

// Check if students table exists
$result = $conn->query("SHOW TABLES LIKE 'students'");
if ($result->num_rows > 0) {
    echo "Students table EXISTS\n\n";
    
    // Show structure
    echo "Table Structure:\n";
    $result = $conn->query("DESCRIBE students");
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
    
    // Count students
    $result = $conn->query("SELECT COUNT(*) as count FROM students");
    $count = $result->fetch_assoc()['count'];
    echo "\nTotal students: $count\n\n";
    
    // Show sample student
    if ($count > 0) {
        echo "Sample student:\n";
        $result = $conn->query("SELECT * FROM students LIMIT 1");
        $student = $result->fetch_assoc();
        foreach ($student as $key => $value) {
            if ($key !== 'password' && $key !== 'qr_code') {
                echo "$key: " . ($value ?? 'NULL') . "\n";
            } elseif ($key === 'qr_code') {
                echo "$key: " . (empty($value) ? 'NULL/EMPTY' : 'EXISTS (length: ' . strlen($value) . ')') . "\n";
            }
        }
    }
} else {
    echo "Students table DOES NOT EXIST\n";
    echo "Available tables:\n";
    $result = $conn->query("SHOW TABLES");
    while ($row = $result->fetch_array()) {
        echo "- " . $row[0] . "\n";
    }
}

$conn->close();
?>
