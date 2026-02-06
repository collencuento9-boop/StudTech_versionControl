<?php
// Migrate old grade format to new format
$host = 'localhost';
$dbname = 'wmsu_ed';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== MIGRATING GRADES FORMAT ===\n\n";
    
    // Get all students with grades
    $stmt = $pdo->query("SELECT id, firstName, lastName, grades FROM users WHERE role='student' AND grades IS NOT NULL AND grades != ''");
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $updated = 0;
    
    foreach ($students as $student) {
        $oldGrades = json_decode($student['grades'], true);
        
        if (!$oldGrades) continue;
        
        // Check if already in new format (has q1, q2, etc keys)
        $needsConversion = false;
        foreach ($oldGrades as $subject => $value) {
            if ($subject === 'lastEditTime') continue;
            if (!is_array($value)) {
                $needsConversion = true;
                break;
            }
        }
        
        if ($needsConversion) {
            echo "Converting: {$student['firstName']} {$student['lastName']}\n";
            echo "Old format: " . json_encode($oldGrades) . "\n";
            
            $newGrades = [];
            foreach ($oldGrades as $subject => $value) {
                if ($subject === 'lastEditTime') continue;
                
                // Convert to new format with q1
                $newGrades[$subject] = [
                    'q1' => (int)$value
                ];
            }
            
            echo "New format: " . json_encode($newGrades) . "\n\n";
            
            // Update database
            $updateStmt = $pdo->prepare("UPDATE users SET grades = ? WHERE id = ?");
            $updateStmt->execute([json_encode($newGrades), $student['id']]);
            
            $updated++;
        }
    }
    
    echo "✅ Migration complete! Updated $updated students.\n";
    
} catch(PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
