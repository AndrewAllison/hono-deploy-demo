import { User, CreateUser, UpdateUser, Pagination } from '@/types';

/**
 * In-memory user storage for demo purposes
 * In production, this would be replaced with a database
 */
class UserService {
  private users: User[] = [];
  private nextId = 1;

  /**
   * Create a new user
   */
  async createUser(userData: CreateUser): Promise<User> {
    const now = new Date();
    const user: User = {
      id: this.generateId(),
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);
    return user;
  }

  /**
   * Get all users with pagination
   */
  async getUsers(pagination: Omit<Pagination, 'total' | 'totalPages'>): Promise<{ users: User[]; total: number }> {
    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const users = this.users.slice(startIndex, endIndex);
    const total = this.users.length;

    return { users, total };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, userData: UpdateUser): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string, pagination: Omit<Pagination, 'total' | 'totalPages'>): Promise<{ users: User[]; total: number }> {
    const { page, limit } = pagination;
    const searchQuery = query.toLowerCase();

    const filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const users = filteredUsers.slice(startIndex, endIndex);
    const total = filteredUsers.length;

    return { users, total };
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    averageAge: number | null;
    ageGroups: Record<string, number>;
  }> {
    const totalUsers = this.users.length;
    
    if (totalUsers === 0) {
      return {
        totalUsers: 0,
        averageAge: null,
        ageGroups: {},
      };
    }

    const usersWithAge = this.users.filter(user => user.age !== undefined);
    const averageAge = usersWithAge.length > 0
      ? usersWithAge.reduce((sum, user) => sum + (user.age || 0), 0) / usersWithAge.length
      : null;

    const ageGroups = this.users.reduce((groups, user) => {
      if (user.age === undefined) return groups;
      
      const ageGroup = this.getAgeGroup(user.age);
      groups[ageGroup] = (groups[ageGroup] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);

    return {
      totalUsers,
      averageAge: averageAge ? Math.round(averageAge * 100) / 100 : null,
      ageGroups,
    };
  }

  /**
   * Generate a simple ID for demo purposes
   */
  private generateId(): string {
    return `user_${this.nextId++}`;
  }

  /**
   * Get age group for statistics
   */
  private getAgeGroup(age: number): string {
    if (age < 18) return '0-17';
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    if (age < 65) return '55-64';
    return '65+';
  }
}

// Export singleton instance
export const userService = new UserService();
