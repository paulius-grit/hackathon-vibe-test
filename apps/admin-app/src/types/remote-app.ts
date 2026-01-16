/**
 * Remote App type definitions
 * Matches the admin-api response structure
 */

export interface RemoteApp {
  id: string;
  name: string;
  title: string;
  icon: string;
  url: string;
  scope: string;
  module: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRemoteAppInput {
  name: string;
  title: string;
  icon?: string;
  url: string;
  scope: string;
  module: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateRemoteAppInput {
  name?: string;
  title?: string;
  icon?: string;
  url?: string;
  scope?: string;
  module?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}
