<?php
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

echo "=== CHECKING USERS TABLE STRUCTURE ===\n\n";

// Check columns
$stmt = $pdo->query("DESCRIBE users");
$columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Users table columns:\n";
foreach ($columns as $col) {
    echo "  - {$col['Field']} ({$col['Type']}) - {$col['Null']}\n";
}

// Check if grades column exists
$hasGrades = false;
foreach ($columns as $col) {
    if ($col['Field'] === 'grades') {
        $hasGrades = true;
        break;
    }
}

echo "\nGrades column exists: " . ($hasGrades ? "YES" : "NO") . "\n";

// Check other columns
$hasAverage = false;
$hasLastGradeEditTime = false;
foreach ($columns as $col) {
    if ($col['Field'] === 'average') {
        $hasAverage = true;
    }
    if ($col['Field'] === 'lastGradeEditTime') {
        $hasLastGradeEditTime = true;
    }
}

// Add columns in order if they don't exist
if (!$hasAverage) {
    echo "Adding average column...\n";
    $pdo->exec("ALTER TABLE users ADD COLUMN average DECIMAL(5,2) DEFAULT 0");
    echo "✓ Average column added!\n";
}

if (!$hasLastGradeEditTime) {
    echo "Adding lastGradeEditTime column...\n";
    $pdo->exec("ALTER TABLE users ADD COLUMN lastGradeEditTime DATETIME DEFAULT NULL");
    echo "✓ LastGradeEditTime column added!\n";
}

if (!$hasGrades) {
    echo "Adding grades column...\n";
    $pdo->exec("ALTER TABLE users ADD COLUMN grades LONGTEXT DEFAULT NULL");
    echo "✓ Grades column added!\n";
}

echo "\n✅ All required columns are now present!\n";
?>
