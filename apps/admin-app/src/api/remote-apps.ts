import type {
  RemoteApp,
  CreateRemoteAppInput,
  UpdateRemoteAppInput,
  ApiResponse,
} from "../types/remote-app";

const API_BASE_URL = "http://localhost:4000/api";

/**
 * Fetch all remote apps
 */
export async function getAllRemoteApps(
  activeOnly = false,
): Promise<RemoteApp[]> {
  const url = activeOnly
    ? `${API_BASE_URL}/remote-apps?active=true`
    : `${API_BASE_URL}/remote-apps`;

  const response = await fetch(url);
  const json: ApiResponse<RemoteApp[]> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? "Failed to fetch remote apps");
  }

  return json.data;
}

/**
 * Fetch a single remote app by ID
 */
export async function getRemoteAppById(id: string): Promise<RemoteApp> {
  const response = await fetch(`${API_BASE_URL}/remote-apps/${id}`);
  const json: ApiResponse<RemoteApp> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? "Remote app not found");
  }

  return json.data;
}

/**
 * Create a new remote app
 */
export async function createRemoteApp(
  input: CreateRemoteAppInput,
): Promise<RemoteApp> {
  const response = await fetch(`${API_BASE_URL}/remote-apps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json: ApiResponse<RemoteApp> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? "Failed to create remote app");
  }

  return json.data;
}

/**
 * Update an existing remote app
 */
export async function updateRemoteApp(
  id: string,
  input: UpdateRemoteAppInput,
): Promise<RemoteApp> {
  const response = await fetch(`${API_BASE_URL}/remote-apps/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json: ApiResponse<RemoteApp> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? "Failed to update remote app");
  }

  return json.data;
}

/**
 * Delete a remote app
 */
export async function deleteRemoteApp(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/remote-apps/${id}`, {
    method: "DELETE",
  });

  const json: ApiResponse<null> = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Failed to delete remote app");
  }
}

/**
 * Toggle the active status of a remote app
 */
export async function toggleRemoteAppActive(id: string): Promise<RemoteApp> {
  const response = await fetch(`${API_BASE_URL}/remote-apps/${id}/toggle`, {
    method: "PATCH",
  });

  const json: ApiResponse<RemoteApp> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? "Failed to toggle remote app");
  }

  return json.data;
}
