<script setup lang="ts">
import type ProfileResource from '~/resources/ProfileResource';

const profile = useState<ProfileResource|null>('profile');
</script>

<template>
    <Head>
        <title>Control // Eventify</title>
    </Head>

    <UMain class="flex items-center justify-center h-dvh">
        <ULandingHero :title="`Hi, ${profile?.name}!`"
                      description="Control anything. Anywhere. Anytime."
                      :links="[{label: 'Go home', icon: 'i-heroicons-home-solid', size: 'xl', to: '/'}]"/>
    </UMain>
</template>

<style scoped>

</style>