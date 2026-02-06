// Test login API for hz202305178
const testLogin = async () => {
  console.log('Testing login for hz202305178...\n');
  
  const loginAttempts = [
    { username: 'hz202305178', description: 'Username (lowercase)' },
    { username: 'Hz202305178', description: 'Username (mixed case)' },
    { email: 'hz202305178@wmsu.edu.ph', description: 'Email (lowercase)' },
    { email: 'Hz202305178@wmsu.edu.ph', description: 'Email (original case)' }
  ];
  
  for (const attempt of loginAttempts) {
    console.log(`\n--- Testing: ${attempt.description} ---`);
    
    try {
      const response = await fetch('http://192.168.1.169:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...attempt,
          password: 'test123' // Replace with actual password
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ SUCCESS');
        console.log('Status:', result.status);
        console.log('User:', result.data?.user?.name);
        console.log('Role:', result.data?.user?.role);
        console.log('Token:', result.token?.substring(0, 20) + '...');
      } else {
        console.log('❌ FAILED');
        console.log('Status:', result.status);
        console.log('Message:', result.message);
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
  }
};

testLogin();
