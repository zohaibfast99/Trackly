import {z} from "zod"

export const userSchema = z.object({
    name:z.string().min(2, "Name is required").max(50, "Maximum is 50 characters"),
    about: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    industryType: z.string().min(1, "Industry type is required"),
    //email: z.string().email("Invalid email address"),
    email: z.email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    image: z.string().optional(),
})

export const workspaceSchema = z.object({
    name:z
    .string()
    .min(2, "Name is required")
    .max(50, "Maximum is 50 characters"),
    description: z.string().optional(),
})