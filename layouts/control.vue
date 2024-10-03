<script setup lang="ts">
import type ProfileResource from '~/resources/ProfileResource';

const profile = useState<ProfileResource | null>('profile');
const token   = useCookie<string>('token');

async function logout() {
    profile.value = null;
    token.value   = '';
    await navigateTo('/login');
}
</script>

<template>
    <div>
        <UHeader title="Eventify">
            <template v-if="profile" #right>
                <UButton variant="ghost"
                         icon="i-heroicons-arrow-right-on-rectangle"
                         color="gray"
                         label="Logout"
                         @click="logout"/>
            </template>
        </UHeader>

        <UMain class="flex justify-center">
            <slot/>
        </UMain>
    </div>
</template>

<style scoped>

</style>