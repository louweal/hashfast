<template>
    <main>
        <Header :gradient="true" />

        <section class="section">
            <div class="container flex flex-col gap-8">
                <DashboardNav :active="'subscriptions'" />

                <p>Coming soon</p>

                <h1 v-if="isLoggedIn">Welcome, {{ user.name }} {{ user.wallet }}</h1>
            </div>
        </section>
    </main>
</template>

<script setup>
const { user, loading, error, isLoggedIn, fetchUser } = useAuth();
await fetchUser();
</script>
