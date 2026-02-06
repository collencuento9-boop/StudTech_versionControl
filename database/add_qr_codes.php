<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'wmsu_ed';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "=== ADDING QR_CODE FIELD TO USERS TABLE ===\n\n";

// Check if qr_code field exists
$result = $conn->query("SHOW COLUMNS FROM users LIKE 'qr_code'");
if ($result->num_rows > 0) {
    echo "qr_code field already exists!\n";
} else {
    echo "Adding qr_code field...\n";
    $sql = "ALTER TABLE users ADD COLUMN qr_code LONGTEXT NULL AFTER password";
    if ($conn->query($sql) === TRUE) {
        echo "✓ qr_code field added successfully!\n";
    } else {
        echo "✗ Error: " . $conn->error . "\n";
    }
}

echo "\n=== GENERATING QR CODES FOR ALL STUDENTS ===\n\n";

// Get all students
$result = $conn->query("SELECT id, firstName, lastName, email, gradeLevel, section FROM users WHERE role = 'student'");
$updated = 0;

while ($row = $result->fetch_assoc()) {
    $studentId = $row['id'];
    $name = trim($row['firstName'] . ' ' . $row['lastName']);
    $section = $row['section'] ?? 'Unknown';
    
    // Create QR data similar to how mobile app generates it
    $qrData = json_encode([
        'name' => $name,
        'studentId' => $studentId,
        'section' => $section,
    ]);
    
    // In a real scenario, you would generate actual QR code image
    // For now, we'll store the data that will be used to generate QR
    $updateSql = "UPDATE users SET qr_code = ? WHERE id = ?";
    $stmt = $conn->prepare($updateSql);
    $stmt->bind_param("ss", $qrData, $studentId);
    
    if ($stmt->execute()) {
        $updated++;
        if ($updated <= 3) {
            echo "✓ Generated QR for: $name (ID: $studentId)\n";
        }
    }
}

echo "\n✓ Total QR codes generated: $updated\n";

$conn->close();
?>
