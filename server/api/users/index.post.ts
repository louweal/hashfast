// server/api/users.post.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { H3Event, sendError, createError } from "h3";

const prisma = new PrismaClient();

// 1) Zod schema for the request body
const UserInput = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be 8+ chars"),
});

// 2) Nuxt / Nitro named export for POST
export default defineEventHandler(async (event) => {
    try {
        // readBody parses JSON automatically
        const body = await readBody(event);
        const { email, password } = UserInput.parse(body);

        // 3) hash the password
        const hash = await bcrypt.hash(password, 10);

        // 4) create the user
        const user = await prisma.user.create({
            data: { email: email, password: hash },
        });

        // 5) strip sensitive data before returning
        const { password: _omit, ...safeUser } = user;
        return safeUser;
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            // Validation error → 400
            throw createError({ statusCode: 400, statusMessage: err.issues[0].message });
        }
        if (err.code === "P2002") {
            // Prisma unique‑constraint error → 409
            throw createError({ statusCode: 409, statusMessage: "Email already in use" });
        }
        // Unhandled → 500
        sendError(event, err);
    }
});
