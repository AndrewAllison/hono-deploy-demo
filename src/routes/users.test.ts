import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import users from './users';
import { userService } from '@/services/user.service';

// Create a test app
const app = new Hono();
app.route('/api/users', users);

describe('Users API', () => {
  beforeEach(() => {
    // Clear users before each test
    (userService as any).users = [];
    (userService as any).nextId = 1;
  });

  describe('GET /api/users', () => {
    it('should return empty list when no users exist', async () => {
      const res = await app.request('/api/users');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.items).toEqual([]);
      expect(data.data.pagination.total).toBe(0);
    });

    it('should return users with pagination', async () => {
      // Create test users
      await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      await userService.createUser({
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
      });

      const res = await app.request('/api/users?page=1&limit=1');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.items).toHaveLength(1);
      expect(data.data.pagination.total).toBe(2);
      expect(data.data.pagination.page).toBe(1);
      expect(data.data.pagination.limit).toBe(1);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      const res = await app.request('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(userData.name);
      expect(data.data.email).toBe(userData.email);
      expect(data.data.age).toBe(userData.age);
      expect(data.data.id).toBeDefined();
      expect(data.data.createdAt).toBeDefined();
      expect(data.data.updatedAt).toBeDefined();
    });

    it('should return 400 for invalid user data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        age: -5,
      };

      const res = await app.request('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID', async () => {
      const user = await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const res = await app.request(`/api/users/${user.id}`);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(user.id);
      expect(data.data.name).toBe(user.name);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await app.request('/api/users/non-existent-id');
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user by ID', async () => {
      const user = await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const updateData = {
        name: 'John Updated',
        age: 31,
      };

      const res = await app.request(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(updateData.name);
      expect(data.data.age).toBe(updateData.age);
      expect(data.data.email).toBe(user.email); // Should remain unchanged
    });

    it('should return 404 for non-existent user', async () => {
      const res = await app.request('/api/users/non-existent-id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Updated' }),
      });

      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user by ID', async () => {
      const user = await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const res = await app.request(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('User deleted successfully');

      // Verify user is deleted
      const getUserRes = await app.request(`/api/users/${user.id}`);
      expect(getUserRes.status).toBe(404);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await app.request('/api/users/non-existent-id', {
        method: 'DELETE',
      });

      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('User not found');
    });
  });

  describe('GET /api/users/search', () => {
    it('should search users by name', async () => {
      await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      await userService.createUser({
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
      });

      const res = await app.request('/api/users/search?q=John');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.items).toHaveLength(1);
      expect(data.data.items[0].name).toBe('John Doe');
    });

    it('should search users by email', async () => {
      await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });

      const res = await app.request('/api/users/search?q=john@example.com');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.items).toHaveLength(1);
      expect(data.data.items[0].email).toBe('john@example.com');
    });
  });

  describe('GET /api/users/stats', () => {
    it('should return user statistics', async () => {
      await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      await userService.createUser({
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
      });

      const res = await app.request('/api/users/stats');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.totalUsers).toBe(2);
      expect(data.data.averageAge).toBe(27.5);
      expect(data.data.ageGroups).toBeDefined();
    });
  });
});
