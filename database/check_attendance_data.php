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

echo "=== CHECKING ATTENDANCE DATA ===\n\n";

try {
    // Get today's date
    $today = date('Y-m-d');
    echo "Today's date: $today\n\n";
    
    // Check all attendance records
    $stmt = $pdo->query("SELECT * FROM attendance ORDER BY timestamp DESC LIMIT 10");
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Total records found: " . count($records) . "\n\n";
    
    if (count($records) > 0) {
        echo "Latest 10 attendance records:\n";
        echo "ID | Student ID | Student Name | Date | Time | Status | Location\n";
        echo str_repeat("-", 100) . "\n";
        
        foreach ($records as $record) {
            printf(
                "%s | %s | %s | %s | %s | %s | %s\n",
                $record['id'],
                $record['student_id'],
                $record['student_name'],
                $record['date'],
                $record['time'],
                $record['status'],
                $record['location']
            );
        }
    } else {
        echo "⚠️ No attendance records found!\n";
    }
    
    echo "\n";
    
    // Check today's records
    $stmt = $pdo->prepare("SELECT * FROM attendance WHERE date = ? ORDER BY timestamp DESC");
    $stmt->execute([$today]);
    $todayRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Today's records ($today): " . count($todayRecords) . "\n\n";
    
    if (count($todayRecords) > 0) {
        echo "Today's attendance:\n";
        foreach ($todayRecords as $record) {
            echo "  - {$record['student_name']} ({$record['student_id']}) - {$record['status']} at {$record['time']} from {$record['location']}\n";
        }
    }
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
