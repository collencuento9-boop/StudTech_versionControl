<?php
// Database connection
$host = 'localhost';
$dbname = 'wmsu_ed';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage() . "\n");
}

echo "=== CHECKING DATE FIELD TYPE ===\n\n";

// Check column type
$stmt = $pdo->query("DESCRIBE attendance");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($columns as $col) {
    if ($col['Field'] === 'date') {
        echo "Date column type: {$col['Type']}\n";
        echo "Null: {$col['Null']}\n";
        echo "Default: {$col['Default']}\n\n";
    }
}

// Check actual date values
$stmt = $pdo->query("SELECT id, student_name, date, DATE_FORMAT(date, '%Y-%m-%d') as formatted_date FROM attendance ORDER BY id DESC LIMIT 5");
$records = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Recent records:\n";
foreach ($records as $record) {
    echo "ID: {$record['id']}\n";
    echo "  Student: {$record['student_name']}\n";
    echo "  Raw date: {$record['date']}\n";
    echo "  Formatted: {$record['formatted_date']}\n\n";
}
?>
