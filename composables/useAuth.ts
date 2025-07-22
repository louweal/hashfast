// composables/useAuth.ts
import { useState } from "#app";
import { useCookie } from "#imports";
// import { verifyToken } from "~/server/utils/jwt";

interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export function useAuth() {
    // 1) global reactive store for the logged‑in user
    const user = useState<User | null>("auth:user", () => null);
    const pending = useState<boolean>("auth:pending", () => false);
    const error = useState<string | null>("auth:error", () => null);

    async function login(email: string, password: string) {
        error.value = null;
        pending.value = true;
        try {
            // Use $fetch – Nuxt’s wrapper around ofetch
            const loggedInUser = await $fetch<User>("/api/login", {
                method: "POST",
                body: { email, password },
            });

            user.value = loggedInUser; // store user globally
        } catch (err: any) {
            // Handle 4xx / 5xx errors
            error.value = err?.statusMessage || err?.data?.message || "Login failed";
            user.value = null;
        } finally {
            pending.value = false;
        }
    }

    function logout() {
        user.value = null;
    }

    return { user, pending, error, login, logout };
}
