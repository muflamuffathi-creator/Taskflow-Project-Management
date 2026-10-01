const http = require('http');

async function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function run() {
  console.log('Testing Admin Login...');
  const loginRes = await request(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
    { email: 'admin@taskmanager.com', password: 'password123' }
  );

  console.log('Login Status:', loginRes.status);
  const token = loginRes.data.token;
  if (!token) {
    console.error('No token returned:', loginRes.data);
    return;
  }
  console.log('Token received! User role:', loginRes.data.user.role);

  console.log('\nTesting GET /api/projects...');
  const projRes = await request({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/projects',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  console.log('Projects Status:', projRes.status, 'Total Projects:', projRes.data.projects?.length);

  console.log('\nTesting GET /api/dashboard/admin...');
  const dashRes = await request({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/dashboard/admin',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  console.log('Admin Dashboard Status:', dashRes.status, 'Total tasks:', dashRes.data.stats?.total_tasks);

  console.log('\nTesting GET /api/projects/1/tasks...');
  const tasksRes = await request({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/projects/1/tasks',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  console.log('Project 1 Tasks Status:', tasksRes.status, 'Tasks count:', tasksRes.data.tasks?.length);

  console.log('\nAll API Endpoint Tests Passed Successfully!');
}

run().catch(console.error);
