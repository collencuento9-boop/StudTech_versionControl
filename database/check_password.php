<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'wmsu_ed';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "=== CHECKING PASSWORD FOR hz202305178 ===\n\n";

$result = $conn->query("SELECT username, email, password, firstName, lastName FROM users WHERE username = 'hz202305178'");

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "Username: " . $row['username'] . "\n";
    echo "Email: " . $row['email'] . "\n";
    echo "Name: " . $row['firstName'] . " " . $row['lastName'] . "\n";
    echo "Password Hash: " . (strlen($row['password']) > 0 ? "EXISTS (length: " . strlen($row['password']) . ")" : "EMPTY") . "\n";
    echo "Hash Format: " . (strpos($row['password'], '$2') === 0 ? "bcrypt" : "unknown") . "\n";
} else {
    echo "Account not found!\n";
}

$conn->close();
?>
