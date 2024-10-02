<script setup lang="ts">
</script>

<template>
    <NuxtLoadingIndicator/>

    <UNotifications/>

    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
    transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
    transform: scale(80%);
    opacity: .5;
}
</style>