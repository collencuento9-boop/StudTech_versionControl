<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'wmsu_ed';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "=== CHECKING ACCOUNT hz202305178 ===\n\n";

// Check by user_id
$result = $conn->query("SELECT * FROM users WHERE user_id = 'hz202305178'");
if ($result && $result->num_rows > 0) {
    echo "Found by user_id:\n";
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . "\n";
        echo "User ID: " . ($row['user_id'] ?? 'N/A') . "\n";
        echo "Username: " . ($row['username'] ?? 'N/A') . "\n";
        echo "Email: " . $row['email'] . "\n";
        echo "Name: " . ($row['firstName'] ?? '') . " " . ($row['lastName'] ?? '') . "\n";
        echo "Role: " . $row['role'] . "\n";
        echo "Status: " . ($row['status'] ?? 'N/A') . "\n";
        echo "\n";
    }
} else {
    echo "NOT found by user_id\n\n";
}

// Check by username
$result = $conn->query("SELECT * FROM users WHERE username = 'hz202305178'");
if ($result && $result->num_rows > 0) {
    echo "Found by username:\n";
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . "\n";
        echo "User ID: " . ($row['user_id'] ?? 'N/A') . "\n";
        echo "Username: " . ($row['username'] ?? 'N/A') . "\n";
        echo "Email: " . $row['email'] . "\n";
        echo "Name: " . ($row['firstName'] ?? '') . " " . ($row['lastName'] ?? '') . "\n";
        echo "Role: " . $row['role'] . "\n";
        echo "Status: " . ($row['status'] ?? 'N/A') . "\n";
        echo "\n";
    }
} else {
    echo "NOT found by username\n\n";
}

// Check by email containing hz202305178
$result = $conn->query("SELECT * FROM users WHERE email LIKE '%hz202305178%'");
if ($result && $result->num_rows > 0) {
    echo "Found by email pattern:\n";
    while ($row = $result->fetch_assoc()) {
        echo "ID: " . $row['id'] . "\n";
        echo "User ID: " . ($row['user_id'] ?? 'N/A') . "\n";
        echo "Username: " . ($row['username'] ?? 'N/A') . "\n";
        echo "Email: " . $row['email'] . "\n";
        echo "Name: " . ($row['firstName'] ?? '') . " " . ($row['lastName'] ?? '') . "\n";
        echo "Role: " . $row['role'] . "\n";
        echo "Status: " . ($row['status'] ?? 'N/A') . "\n";
        echo "\n";
    }
} else {
    echo "NOT found by email pattern\n";
}

// Show table structure
echo "\n=== USERS TABLE STRUCTURE ===\n";
$result = $conn->query("DESCRIBE users");
while ($row = $result->fetch_assoc()) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}

$conn->close();
?>
