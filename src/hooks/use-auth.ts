"use client";

import { useState, useCallback, useEffect } from "react";
import { AuthUser, LoginCredentials } from "@/types/auth";
import { authService } from "@/lib/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        const isValidToken =
          storedUser && authService.isTokenValid(storedUser.token);

        if (isValidToken) {
          setState({
            user: storedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Clear invalid session
          authService.logout();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (_) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to initialize authentication",
        });
      }
    };

    initAuth();
  }, []);

  // Listen for storage changes to sync auth state across tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "token") {
        // Recheck auth state when localStorage changes
        const storedUser = authService.getCurrentUser();
        if (storedUser && authService.isTokenValid(storedUser.token)) {
          setState((prev) => ({
            ...prev,
            user: storedUser,
            isAuthenticated: true,
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            error: null,
          }));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const authenticatedUser = await authService.login(credentials);

      // Store user data securely
      localStorage.setItem("user", JSON.stringify(authenticatedUser));
      localStorage.setItem("token", authenticatedUser.token);

      setState({
        user: authenticatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return authenticatedUser;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      // Force storage event for same-tab components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "user",
          newValue: null,
        })
      );
    } catch (_) {
      // Even if logout fails, clear local state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Logout failed, but session cleared locally",
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const refreshSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser && authService.isTokenValid(currentUser.token)) {
        setState((prev) => ({ ...prev, isLoading: false }));
      } else {
        await logout();
      }
    } catch (_) {
      await logout();
    }
  }, [logout]);

  return {
    ...state,
    login,
    logout,
    clearError,
    refreshSession,
  };
};
