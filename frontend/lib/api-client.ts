/**
 * API Client - Backend ile iletişim
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8099/api/v1";

interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `API Error: ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    localStorage.setItem("token", data.token);
    return data;
  }

  async register(
    email: string,
    password: string,
    full_name: string,
    phone?: string
  ) {
    const data = await this.request<{ token: string; user: any }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, full_name, phone }),
      }
    );
    localStorage.setItem("token", data.token);
    return data;
  }

  logout() {
    localStorage.removeItem("token");
  }

  // User
  async getProfile() {
    return this.request<any>("/users/profile");
  }

  async updateProfile(data: { full_name?: string; phone?: string }) {
    return this.request<any>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(old_password: string, new_password: string) {
    return this.request<void>("/users/password", {
      method: "PUT",
      body: JSON.stringify({ old_password, new_password }),
    });
  }

  // Quotes
  async getQuotes() {
    return this.request<any[]>("/quotes");
  }

  async createQuote(data: {
    provider: string;
    product_type: string;
    vehicle_plate?: string;
    tckn?: string;
  }) {
    return this.request<any>("/quotes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Policies
  async getPolicies() {
    return this.request<any[]>("/policies");
  }

  async createPolicy(quote_id: string) {
    return this.request<any>("/policies", {
      method: "POST",
      body: JSON.stringify({ quote_id }),
    });
  }

  // Admin
  async getAdminStats() {
    return this.request<any>("/admin/stats");
  }

  async getAdminUsers() {
    return this.request<any[]>("/admin/users");
  }
}

export const apiClient = new ApiClient();
