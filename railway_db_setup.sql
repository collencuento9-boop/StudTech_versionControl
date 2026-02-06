-- WMSU ILS-Elementary Department Portal Database Setup
-- For Railway MySQL Database
-- Execute this in Railway MySQL Database tab

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ========================================
-- 1. USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(50) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert admin user (password: Admin123!)
INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `role`, `email`, `password`, `createdAt`) VALUES
('63bc1bd0-359f-4372-8581-5a626e5e16f7', 'Josie', 'Banalo', 'adminjossie', 'admin', 'adminjossie@wmsu.edu.ph', '$2a$12$9pAWXTHqMrCDY0JGUfHdV.5IvZ7E7kJPGr5vpOLgU.k7yF/lVuPlu', NOW());

-- ========================================
-- 2. STUDENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS `students` (
  `id` varchar(50) NOT NULL,
  `lrn` varchar(12) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `full_name` varchar(300) NOT NULL,
  `age` int(11) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `parentEmail` varchar(100) DEFAULT NULL,
  `grade_level` varchar(50) NOT NULL,
  `section` varchar(50) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `wmsu_email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_pic` longtext DEFAULT NULL,
  `qr_code` longtext DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Active',
  `grades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `attendance` varchar(10) DEFAULT '0%',
  `average` int(11) DEFAULT 0,
  `adviser_id` varchar(50) DEFAULT NULL,
  `adviser_name` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `lrn` (`lrn`),
  UNIQUE KEY `wmsu_email` (`wmsu_email`),
  KEY `grade_level` (`grade_level`,`section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  INDEX idx_adviser (adviser_id),
  FOREIGN KEY (adviser_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample classes
INSERT INTO `classes` (`id`, `grade`, `section`, `adviser_id`, `adviser_name`, `createdAt`) VALUES
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
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_class_teacher (class_id, teacher_id),
  INDEX idx_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- ========================================
-- 6. GRADES TABLE (if needed)
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
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Success message
SELECT 'Database setup completed successfully!' AS Message;
