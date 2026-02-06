<?php
// Check grades data in database
$host = 'localhost';
$dbname = 'wmsu_ed';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== CHECKING STUDENTS WITH GRADES ===\n\n";
    
    // Get students with average > 0
    $stmt = $pdo->query("SELECT id, firstName, lastName, gradeLevel, average, grades FROM users WHERE role='student' AND average > 0 LIMIT 5");
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($students as $student) {
        echo "Student: {$student['firstName']} {$student['lastName']}\n";
        echo "Grade Level: {$student['gradeLevel']}\n";
        echo "Average: {$student['average']}\n";
        echo "Grades field type: " . gettype($student['grades']) . "\n";
        echo "Grades field value: " . ($student['grades'] ? substr($student['grades'], 0, 200) : 'NULL') . "\n";
        
        if ($student['grades']) {
            $decoded = json_decode($student['grades'], true);
            if ($decoded) {
                echo "Decoded grades:\n";
                print_r($decoded);
            } else {
                echo "Failed to decode JSON\n";
            }
        }
        echo "\n" . str_repeat("-", 50) . "\n\n";
    }
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
