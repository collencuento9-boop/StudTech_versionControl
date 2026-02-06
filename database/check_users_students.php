<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'wmsu_ed';

$conn = new mysqli($host, $user, $password, $database);

echo "=== CHECKING USERS TABLE FOR STUDENTS ===\n\n";

// Count students in users table
$result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
$count = $result->fetch_assoc()['count'];
echo "Total students in users table: $count\n\n";

if ($count > 0) {
    echo "Sample students from users table:\n";
    $result = $conn->query("SELECT id, firstName, lastName, email, username, gradeLevel, section, role FROM users WHERE role = 'student' LIMIT 3");
    while ($row = $result->fetch_assoc()) {
        echo "\n";
        echo "ID: " . $row['id'] . "\n";
        echo "Name: " . ($row['firstName'] ?? '') . " " . ($row['lastName'] ?? '') . "\n";
        echo "Email: " . ($row['email'] ?? 'N/A') . "\n";
        echo "Username: " . ($row['username'] ?? 'N/A') . "\n";
        echo "Grade: " . ($row['gradeLevel'] ?? 'N/A') . "\n";
        echo "Section: " . ($row['section'] ?? 'N/A') . "\n";
    }
    
    echo "\n\n=== USERS TABLE STRUCTURE ===\n";
    $result = $conn->query("DESCRIBE users");
    $hasQRCode = false;
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
        if ($row['Field'] === 'qr_code' || $row['Field'] === 'qrCode') {
            $hasQRCode = true;
        }
    }
    
    echo "\nQR Code field exists in users table: " . ($hasQRCode ? "YES" : "NO") . "\n";
}

$conn->close();
?>
