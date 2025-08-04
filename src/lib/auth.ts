import { AuthUser, LoginCredentials, UserRole } from "@/types/auth";
import { mockUsers } from "@/lib/mock-data/users";

export const simulateApiDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface AuthError {
  code: string;
  message: string;
}

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    // Simulate realistic network delay
    await simulateApiDelay(Math.random() * 1000 + 500);

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    // Enhanced error handling with specific error codes
    if (!user) {
      const error: AuthError = {
        code: "USER_NOT_FOUND",
        message: "No account found with this email address",
      };
      throw new Error(error.message);
    }

    // For mock data, always allow 'password123'
    if (password !== "password123") {
      // Simulate rate limiting delay for failed attempts
      await simulateApiDelay(1500);
      const error: AuthError = {
        code: "INVALID_PASSWORD",
        message: "Incorrect password. Please try again.",
      };
      throw new Error(error.message);
    }

    // Check if user account is active
    if (user.status !== "ACTIVE") {
      const error: AuthError = {
        code: "ACCOUNT_INACTIVE",
        message: "Your account is not active. Please contact support.",
      };
      throw new Error(error.message);
    }

    // Convert User to AuthUser format (User doesn't have password field in our mock data)
    const token = generateMockToken(user.role);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      storeId: user.storeId, // Include storeId for store vendors
      token,
      lastLogin: new Date().toISOString(),
    };
  },

  async logout(): Promise<void> {
    // Simulate server-side logout
    await simulateApiDelay(200);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("lastActivity");
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
    }
  },

  getCurrentUser(): AuthUser | null {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;

      const user = JSON.parse(storedUser);

      // Validate required fields
      if (!user.id || !user.email || !user.token) {
        this.logout();
        return null;
      }

      return user;
    } catch (error) {
      console.warn("Error parsing stored user:", error);
      this.logout();
      return null;
    }
  },

  isTokenValid(token: string): boolean {
    if (!token || !token.startsWith("mock_")) {
      return false;
    }

    console.log("isTokenValid", token);

    try {
      // Extract timestamp from mock token
      // Format: mock_role_token_timestamp_randomSuffix
      const tokenParts = token.split("_");
      const timestamp = parseInt(tokenParts[3] || "0"); // Fourth part is timestamp
      const tokenAge = Date.now() - timestamp;

      // Mock tokens expire after 24 hours
      const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000;

      return tokenAge < MAX_TOKEN_AGE;
    } catch (error) {
      return false;
    }
  },

  refreshToken(currentToken: string): string | null {
    if (!this.isTokenValid(currentToken)) {
      return null;
    }

    // For mock implementation, generate new token
    const roleMatch = currentToken.match(/mock_(\w+)_token/);
    if (!roleMatch) return null;

    const role = roleMatch[1].toUpperCase() as UserRole;
    return generateMockToken(role);
  },

  updateLastActivity(): void {
    try {
      localStorage.setItem("lastActivity", Date.now().toString());
    } catch (error) {
      console.warn("Error updating last activity:", error);
    }
  },

  getSessionTimeRemaining(): number {
    try {
      const user = this.getCurrentUser();
      if (!user?.token) return 0;

      // Format: mock_role_token_timestamp_randomSuffix
      const timestamp = parseInt(user.token.split("_")[3] || "0");
      const tokenAge = Date.now() - timestamp;
      const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000;

      return Math.max(0, MAX_TOKEN_AGE - tokenAge);
    } catch (error) {
      return 0;
    }
  },
};

const generateMockToken = (role: UserRole): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `mock_${role.toLowerCase().split("_").join("")}_token_${timestamp}_${randomSuffix}`;
};
