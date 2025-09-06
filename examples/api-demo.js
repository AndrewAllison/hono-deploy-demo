#!/usr/bin/env node

/**
 * API Demo Script
 * 
 * This script demonstrates the Hono API endpoints
 * Run with: node examples/api-demo.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function makeRequest(method, endpoint, data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`\n${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runDemo() {
  console.log('🚀 Hono API Demo');
  console.log('================');
  console.log(`Base URL: ${BASE_URL}\n`);

  // 1. Health Check
  console.log('1. Health Check');
  await makeRequest('GET', '/health');

  // 2. API Documentation
  console.log('\n2. API Documentation');
  await makeRequest('GET', '/api/docs');

  // 3. Get initial users (should be empty)
  console.log('\n3. Get Initial Users');
  await makeRequest('GET', '/api/users');

  // 4. Create some users
  console.log('\n4. Create Users');
  const user1 = await makeRequest('POST', '/api/users', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  });

  const user2 = await makeRequest('POST', '/api/users', {
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
  });

  const user3 = await makeRequest('POST', '/api/users', {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
  });

  // 5. Get all users
  console.log('\n5. Get All Users');
  await makeRequest('GET', '/api/users?page=1&limit=10');

  // 6. Search users
  console.log('\n6. Search Users');
  await makeRequest('GET', '/api/users/search?q=John');

  // 7. Get user by ID
  if (user1 && user1.data) {
    console.log('\n7. Get User by ID');
    await makeRequest('GET', `/api/users/${user1.data.id}`);
  }

  // 8. Update user
  if (user1 && user1.data) {
    console.log('\n8. Update User');
    await makeRequest('PUT', `/api/users/${user1.data.id}`, {
      name: 'John Updated',
      age: 31,
    });
  }

  // 9. Get user statistics
  console.log('\n9. User Statistics');
  await makeRequest('GET', '/api/users/stats');

  // 10. Delete a user
  if (user3 && user3.data) {
    console.log('\n10. Delete User');
    await makeRequest('DELETE', `/api/users/${user3.data.id}`);
  }

  // 11. Final user list
  console.log('\n11. Final User List');
  await makeRequest('GET', '/api/users');

  console.log('\n✅ Demo completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or a fetch polyfill');
  console.log('💡 Try: npm install node-fetch');
  process.exit(1);
}

// Run the demo
runDemo().catch(console.error);
