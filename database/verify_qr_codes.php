<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'wmsu_ed';

$conn = new mysqli($host, $user, $password, $database);

echo "=== VERIFYING QR CODES ===\n\n";

$result = $conn->query("SELECT id, firstName, lastName, LENGTH(qr_code) as qr_length, SUBSTRING(qr_code, 1, 50) as qr_preview FROM users WHERE role = 'student' LIMIT 5");

while ($row = $result->fetch_assoc()) {
    echo "Student: " . $row['firstName'] . " " . $row['lastName'] . "\n";
    echo "ID: " . $row['id'] . "\n";
    echo "QR Code Length: " . $row['qr_length'] . " characters\n";
    echo "QR Preview: " . $row['qr_preview'] . "...\n";
    echo "Format: " . (strpos($row['qr_preview'], 'data:image/png;base64,') === 0 ? 'Valid Data URL' : 'Invalid') . "\n\n";
}

// Count students with QR codes
$result = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND qr_code IS NOT NULL AND qr_code != ''");
$count = $result->fetch_assoc()['count'];
echo "Total students with QR codes: $count / 155\n";

$conn->close();
?>
