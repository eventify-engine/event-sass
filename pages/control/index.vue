<script setup lang="ts">
import type ProfileResource from '~/resources/ProfileResource';
import ConferenceRepository from "~/repos/ConferenceRepository";

definePageMeta({
    layout: 'control'
});

const profile = useState<ProfileResource | null>('profile');
const repo    = new ConferenceRepository();

const {data: conferences} = await repo.list(() => ({}));
</script>

<template>
    <Head>
        <title>Control // Eventify</title>
    </Head>

    <ULandingHero v-if="conferences?.data.length == 0"
                  title="No conferences"
                  description="Let's make a new one!"
                  :links="[{label: 'New conference', color: 'gray', icon: 'i-heroicons-plus', size: 'xl', to: '/control/conferences/create'}]"/>

    <div v-else-if="conferences" class="h-full py-10">
        <UCard class="w-full max-w-xl overflow-clip" :ui="{body: {padding: ''}}">
            <template #header>
                <div class="flex items-center gap-5">
                    <UInput size="xl"
                            class="grow"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Search..."/>

                    <UButton color="gray"
                             icon="i-heroicons-plus"
                             size="xl"
                             label="New conference"
                             to="/control/conferences/create"/>
                </div>
            </template>

            <ul>
                <li v-for="conference in conferences.data" :key="conference.id">
                    <NuxtLink :to="`/control/conferences/${conference.id}`"
                              class="flex gap-2 hover:bg-primary-500 hover:text-gray-50 px-4 sm:px-6 py-2.5 sm:py-3 text-xl">
                        <span>{{ conference.name }}</span>
                    </NuxtLink>
                </li>
            </ul>
        </UCard>
    </div>
</template>

<style scoped>

</style>