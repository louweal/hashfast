// server/api/login/index.get.ts
import { H3Event, readBody, createError } from "h3";
// import { sign } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema
const LoginInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = LoginInput.parse(body);

    console.log("login: " + email);

    // look up the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
    }

    // compare hashed passwords
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
    }

    // create a session token
    const token = jwt.sign(
        { sub: user.id }, // payload
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
    );

    // set cookie – secure, httpOnly, sameSite
    setCookie(event, "auth", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("setCookie: " + token);

    // Sanitise and return user data (issue token here if you use JWT/Sessions)
    const { password: _omit, ...safeUser } = user;
    return safeUser;
});
