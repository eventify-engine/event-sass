<script setup lang="ts">

</script>

<template>
    <UMain class="flex items-center justify-center bg-gradient-to-br from-blue-400 to-fuchsia-900 h-dvh">
        <slot/>
    </UMain>
</template>

<style>
.has-error {
    animation: 0.1s linear alternate shake;
    animation-iteration-count: 5;
}

@keyframes shake {
    0% {
        transform: translateX(-0.1rem);
    }

    100% {
        transform: translateX(0.1rem);
    }
}
</style>