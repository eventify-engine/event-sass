<script setup lang="ts">
import type ProfileResource from '~/resources/ProfileResource';

definePageMeta({
    layout: 'control'
});

const profile = useState<ProfileResource|null>('profile');
</script>

<template>
    <Head>
        <title>Control // Eventify</title>
    </Head>

    <ULandingHero :title="`Hi, ${profile?.name}!`"
                  description="Control anything. Anywhere. Anytime."
                  :links="[{label: 'Go home', icon: 'i-heroicons-home-solid', size: 'xl', to: '/'}]"/>
</template>

<style scoped>

</style>