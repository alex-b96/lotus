import { z } from "zod"

// Schema for creating a new poem
export const createPoemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required").max(10000, "Content must be less than 10,000 characters"),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["DRAFT", "SUBMITTED", "PUBLISHED", "REJECTED"]).optional().default("SUBMITTED"),
})

// Schema for updating a poem
export const updatePoemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
  content: z.string().min(1, "Content is required").max(10000, "Content must be less than 10,000 characters").optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "SUBMITTED", "PUBLISHED", "REJECTED"]).optional(),
})

// Schema for query parameters when listing poems
export const poemListQuerySchema = z.object({
  page: z.string().nullable().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().nullable().optional().transform((val) => val ? Math.min(parseInt(val, 10), 1000) : 20),
  search: z.string().nullable().optional(),
  authorId: z.string().nullable().optional(),
  tag: z.string().nullable().optional(),
  sortBy: z.string().nullable().optional().transform((val) => val || "publishedAt").pipe(z.enum(["publishedAt", "createdAt", "title", "likes"])),
  order: z.string().nullable().optional().transform((val) => val || "desc").pipe(z.enum(["asc", "desc"])),
})

// Type exports for TypeScript
export type CreatePoemInput = z.infer<typeof createPoemSchema>
export type UpdatePoemInput = z.infer<typeof updatePoemSchema>
export type PoemListQuery = z.infer<typeof poemListQuerySchema>