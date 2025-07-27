// import { verify } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
    const publicPaths = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];

    const url = getRequestURL(event).pathname;

    if (publicPaths.includes(url)) return;

    const token = getCookie(event, "auth_token");
    if (!token) {
        throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        event.context.user = decoded;
    } catch (err) {
        throw createError({ statusCode: 401, message: "Invalid or expired token" });
    }
});
