<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'wmsu_ed';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "=== CREATING ATTENDANCE TABLE ===\n\n";

// Check if attendance table exists
$result = $conn->query("SHOW TABLES LIKE 'attendance'");
if ($result->num_rows > 0) {
    echo "Attendance table already exists. Dropping it...\n";
    $conn->query("DROP TABLE attendance");
}

// Create attendance table
$sql = "CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(200),
    grade_level VARCHAR(50),
    section VARCHAR(50),
    date DATE NOT NULL,
    timestamp DATETIME NOT NULL,
    time VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Present',
    period VARCHAR(20) DEFAULT 'morning',
    location VARCHAR(100),
    teacher_id VARCHAR(50),
    teacher_name VARCHAR(100),
    device_info TEXT,
    qr_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_id (student_id),
    INDEX idx_date (date),
    INDEX idx_status (status),
    INDEX idx_student_date (student_id, date)
)";

if ($conn->query($sql) === TRUE) {
    echo "✓ Attendance table created successfully!\n\n";
    
    // Show table structure
    echo "Table Structure:\n";
    $result = $conn->query("DESCRIBE attendance");
    while ($row = $result->fetch_assoc()) {
        echo "  " . $row['Field'] . " - " . $row['Type'] . "\n";
    }
} else {
    echo "✗ Error creating table: " . $conn->error . "\n";
}

$conn->close();
?>
