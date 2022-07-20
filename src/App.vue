<template>
    <div class="w-full h-screen bg-green flex items-center justify-center">
        <div>
            <div>
                <router-link to="/">Home</router-link>
                |
                <router-link to="/about">About</router-link>
            </div>

            <router-view />
        </div>
    </div>
</template>

<style></style>
