import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { userService } from '@/services/user.service';
import { CreateUserSchema, UpdateUserSchema, PaginationQuerySchema } from '@/types';
import type { ApiResponse, PaginatedResponse, User } from '@/types';

const users = new Hono();

/**
 * GET /users - Get all users with pagination
 */
users.get(
  '/',
  zValidator('query', PaginationQuerySchema),
  async (c) => {
    try {
      const { page, limit } = c.req.valid('query');
      const { users: userList, total } = await userService.getUsers({ page, limit });
      
      const totalPages = Math.ceil(total / limit);
      
      const response: PaginatedResponse<User> = {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          items: userList,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      };

      return c.json(response);
    } catch (error) {
      console.error('Error getting users:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve users',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      return c.json(response, 500);
    }
  }
);

/**
 * GET /users/search - Search users by name or email
 */
users.get(
  '/search',
  zValidator('query', PaginationQuerySchema.extend({
    q: z.string().min(1, 'Search query is required'),
  })),
  async (c) => {
    try {
      const { page, limit, q } = c.req.valid('query');
      const { users: userList, total } = await userService.searchUsers(q as string, { page, limit });
      
      const totalPages = Math.ceil(total / limit);
      
      const response: PaginatedResponse<User> = {
        success: true,
        message: 'Search completed successfully',
        data: {
          items: userList,
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      };

      return c.json(response);
    } catch (error) {
      console.error('Error searching users:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to search users',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      return c.json(response, 500);
    }
  }
);

/**
 * GET /users/stats - Get user statistics
 */
users.get('/stats', async (c) => {
  try {
    const stats = await userService.getUserStats();
    
    const response: ApiResponse<typeof stats> = {
      success: true,
      message: 'User statistics retrieved successfully',
      data: stats,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error getting user stats:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve user statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return c.json(response, 500);
  }
});

/**
 * GET /users/:id - Get user by ID
 */
users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await userService.getUserById(id);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found',
        error: `User with ID ${id} does not exist`,
      };
      return c.json(response, 404);
    }

    const response: ApiResponse<User> = {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error getting user:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve user',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return c.json(response, 500);
  }
});

/**
 * POST /users - Create a new user
 */
users.post(
  '/',
  zValidator('json', CreateUserSchema),
  async (c) => {
    try {
      const userData = c.req.valid('json');
      const user = await userService.createUser(userData);
      
      const response: ApiResponse<User> = {
        success: true,
        message: 'User created successfully',
        data: user,
      };

      return c.json(response, 201);
    } catch (error) {
      console.error('Error creating user:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      return c.json(response, 500);
    }
  }
);

/**
 * PUT /users/:id - Update user by ID
 */
users.put(
  '/:id',
  zValidator('json', UpdateUserSchema),
  async (c) => {
    try {
      const id = c.req.param('id');
      const userData = c.req.valid('json');
      const user = await userService.updateUser(id, userData);
      
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
          error: `User with ID ${id} does not exist`,
        };
        return c.json(response, 404);
      }

      const response: ApiResponse<User> = {
        success: true,
        message: 'User updated successfully',
        data: user,
      };

      return c.json(response);
    } catch (error) {
      console.error('Error updating user:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      return c.json(response, 500);
    }
  }
);

/**
 * DELETE /users/:id - Delete user by ID
 */
users.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const deleted = await userService.deleteUser(id);
    
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found',
        error: `User with ID ${id} does not exist`,
      };
      return c.json(response, 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error deleting user:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return c.json(response, 500);
  }
});

export default users;
