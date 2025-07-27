import { ref, computed } from "vue";

const user = ref(null);
const loading = ref(false);
const error = ref(null);

export function useAuth() {
    // console.trace("useAuth called");

    const isLoggedIn = computed(() => !!user.value);

    const fetchUser = async () => {
        loading.value = true;
        error.value = null;

        try {
            const { data } = await useFetch("/api/auth/me", { server: true });
            user.value = data.value?.user || null;
        } catch (err) {
            error.value = err;
            user.value = null;
        } finally {
            loading.value = false;
        }
    };

    return {
        user,
        loading,
        error,
        isLoggedIn,
        fetchUser,
    };
}
