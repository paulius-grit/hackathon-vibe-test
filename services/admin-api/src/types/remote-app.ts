import { z } from "zod";

/**
 * Bundler type for the remote application
 */
export type BundlerType = "vite" | "webpack";

/**
 * Database model for remote apps
 */
export interface RemoteAppModel {
  id: string;
  name: string;
  title: string;
  icon: string;
  url: string;
  scope: string;
  module: string;
  bundler: BundlerType;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * API response DTO
 */
export interface RemoteAppDto {
  id: string;
  name: string;
  title: string;
  icon: string;
  url: string;
  scope: string;
  module: string;
  bundler: BundlerType;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Zod schema for creating a remote app
 */
export const createRemoteAppSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Name must be lowercase alphanumeric with hyphens"),
  title: z.string().min(1, "Title is required").max(255),
  icon: z.string().max(50).default("Package"),
  url: z.string().url("URL must be valid"),
  scope: z.string().min(1, "Scope is required").max(100),
  module: z.string().min(1, "Module is required").max(100),
  bundler: z.enum(["vite", "webpack"]).default("vite"),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

/**
 * Zod schema for updating a remote app
 */
export const updateRemoteAppSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Name must be lowercase alphanumeric with hyphens")
    .optional(),
  title: z.string().min(1).max(255).optional(),
  icon: z.string().max(50).optional(),
  url: z.string().url("URL must be valid").optional(),
  scope: z.string().min(1).max(100).optional(),
  module: z.string().min(1).max(100).optional(),
  bundler: z.enum(["vite", "webpack"]).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

/**
 * Zod schema for reordering apps
 */
export const reorderAppsSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int().min(0),
    }),
  ),
});

export type CreateRemoteAppInput = z.infer<typeof createRemoteAppSchema>;
export type UpdateRemoteAppInput = z.infer<typeof updateRemoteAppSchema>;
export type ReorderAppsInput = z.infer<typeof reorderAppsSchema>;

/**
 * Transform database model to API DTO
 */
export function toDto(model: RemoteAppModel): RemoteAppDto {
  return {
    id: model.id,
    name: model.name,
    title: model.title,
    icon: model.icon,
    url: model.url,
    scope: model.scope,
    module: model.module,
    bundler: model.bundler,
    isActive: model.is_active,
    displayOrder: model.display_order,
    createdAt: new Date(model.created_at).toISOString(),
    updatedAt: new Date(model.updated_at).toISOString(),
  };
}

/**
 * Transform API input to database model fields
 */
export function toModel(
  input: CreateRemoteAppInput | UpdateRemoteAppInput,
): Partial<RemoteAppModel> {
  const model: Partial<RemoteAppModel> = {};

  if ("name" in input && input.name !== undefined) model.name = input.name;
  if ("title" in input && input.title !== undefined) model.title = input.title;
  if ("icon" in input && input.icon !== undefined) model.icon = input.icon;
  if ("url" in input && input.url !== undefined) model.url = input.url;
  if ("scope" in input && input.scope !== undefined) model.scope = input.scope;
  if ("module" in input && input.module !== undefined)
    model.module = input.module;
  if ("bundler" in input && input.bundler !== undefined)
    model.bundler = input.bundler;
  if ("isActive" in input && input.isActive !== undefined)
    model.is_active = input.isActive;
  if ("displayOrder" in input && input.displayOrder !== undefined)
    model.display_order = input.displayOrder;

  return model;
}
