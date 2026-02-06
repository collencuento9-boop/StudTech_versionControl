const { query } = require('./config/database');
const QRCode = require('qrcode');

async function generateQRCodes() {
  console.log('=== GENERATING QR CODE IMAGES FOR ALL STUDENTS ===\n');
  
  try {
    // Get all students
    const students = await query('SELECT id, firstName, lastName, gradeLevel, section FROM users WHERE role = "student"');
    
    console.log(`Found ${students.length} students\n`);
    
    let updated = 0;
    
    for (const student of students) {
      const studentId = student.id;
      const name = `${student.firstName} ${student.lastName}`.trim();
      const section = student.section || 'Unknown';
      
      // Create QR data
      const qrData = JSON.stringify({
        name: name,
        studentId: studentId,
        section: section,
      });
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Update database
      await query('UPDATE users SET qr_code = ? WHERE id = ?', [qrCodeDataUrl, studentId]);
      
      updated++;
      if (updated <= 5) {
        console.log(`✓ Generated QR for: ${name} (ID: ${studentId.substring(0, 8)}...)`);
      }
    }
    
    console.log(`\n✓ Total QR code images generated: ${updated}`);
    console.log('✓ All QR codes have been updated in the database!');
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

generateQRCodes();
