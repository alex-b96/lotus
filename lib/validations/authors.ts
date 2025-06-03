import { z } from "zod"

// Schema for query parameters when listing authors
export const authorListQuerySchema = z.object({
  page: z.string().nullable().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().nullable().optional().transform((val) => val ? Math.min(parseInt(val, 10), 50) : 20),
  search: z.string().nullable().optional(),
  sortBy: z.string().nullable().optional().transform((val) => val || "poems").pipe(z.enum(["createdAt", "name", "poems"])),
  order: z.string().nullable().optional().transform((val) => val || "desc").pipe(z.enum(["asc", "desc"])),
})

// Type exports for TypeScript
export type AuthorListQuery = z.infer<typeof authorListQuerySchema>