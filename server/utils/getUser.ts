import { parseCookies, H3Event } from "h3";
import { verifyToken } from "~/server/utils/jwt";

export function getUser(event: H3Event) {
    const token = parseCookies(event)?.auth;
    if (!token) return null;

    try {
        return verifyToken(token);
    } catch {
        return null;
    }
}
