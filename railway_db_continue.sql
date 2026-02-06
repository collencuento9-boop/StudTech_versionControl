-- Continue setup - Only missing tables
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ========================================
-- 3. CLASSES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS `classes` (
  `id` VARCHAR(255) PRIMARY KEY COMMENT 'Unique class identifier',
  `grade` VARCHAR(50) NOT NULL,
  `section` VARCHAR(100) NOT NULL,
  `adviser_id` VARCHAR(50),
  `adviser_name` VARCHAR(200),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `grade_section` (grade, section),
  INDEX idx_adviser (adviser_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample classes
INSERT IGNORE INTO `classes` (`id`, `grade`, `section`, `adviser_id`, `adviser_name`, `createdAt`) VALUES
('kindergarten-love', 'Kindergarten', 'Love', NULL, NULL, NOW()),
('grade-1-wisdom', 'Grade 1', 'Wisdom', NULL, NULL, NOW()),
('grade-1-humility', 'Grade 1', 'Humility', NULL, NULL, NOW()),
('grade-2-kindness', 'Grade 2', 'Kindness', '63bc1bd0-359f-4372-8581-5a626e5e16f7', 'Josie Banalo', NOW()),
('grade-3-diligence', 'Grade 3', 'Diligence', NULL, NULL, NOW()),
('grade-3-wisdom', 'Grade 3', 'Wisdom', NULL, NULL, NOW());

-- ========================================
-- 4. SUBJECT_TEACHERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS `subject_teachers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` VARCHAR(255) NOT NULL,
  `teacher_id` VARCHAR(50) NOT NULL,
  `teacher_name` VARCHAR(200) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `assignedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_class_teacher (class_id, teacher_id),
  INDEX idx_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================
-- 5. ATTENDANCE TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` VARCHAR(255) PRIMARY KEY COMMENT 'Timestamp-based ID',
  `studentId` VARCHAR(255) NOT NULL,
  `studentName` VARCHAR(200) NOT NULL,
  `gradeLevel` VARCHAR(50) NOT NULL,
  `section` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(20),
  `timestamp` DATETIME NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'present', 'absent', 'late') NOT NULL,
  `period` VARCHAR(50) COMMENT 'morning/afternoon',
  `location` VARCHAR(100) COMMENT 'QR Portal/Mobile App',
  `teacherId` VARCHAR(255),
  `teacherName` VARCHAR(200),
  `deviceInfo` JSON,
  `qrData` JSON,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_student_date (studentId, date),
  INDEX idx_date (date),
  INDEX idx_grade_section (gradeLevel, section),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================general
-- 6. GRADES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS `grades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `quarter` VARCHAR(20) NOT NULL,
  `grade` DECIMAL(5,2),
  `academic_year` VARCHAR(20),
  `teacher_id` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student (student_id),
  INDEX idx_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SELECT 'Database setup completed successfully!' AS Message;
