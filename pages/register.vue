<script setup lang="ts">

</script>

<template>
    <UMain class="flex items-center justify-center bg-gradient-to-br from-blue-400 to-fuchsia-900 h-dvh">
        <UForm>
            <UCard class="w-72 bg-transparent/20 backdrop-blur ring-0 shadow-xl">
                <div class="flex flex-col gap-5">
                    <h3 class="text-gray-50 font-semibold text-xl text-center">Registration</h3>

                    <UFormGroup label="E-mail" name="email" :ui="{label: {base: 'text-gray-50'}}">
                        <UInput type="email" placeholder="make@yourevent.com"/>
                    </UFormGroup>

                    <UFormGroup label="Password" name="password" :ui="{label: {base: 'text-gray-50'}}">
                        <UInput type="password" placeholder="••••••••"/>
                    </UFormGroup>

                    <UFormGroup label="Confirm password" name="password_confirmation" :ui="{label: {base: 'text-gray-50'}}">
                        <UInput type="password" placeholder="••••••••"/>
                    </UFormGroup>

                    <div class="flex flex-col gap-2.5">
                        <UButton color="violet"
                                 label="Register"
                                 icon="i-heroicons-bolt"/>

                        <UButton color="violet"
                                 label="Sign in"
                                 icon="i-heroicons-arrow-right-end-on-rectangle"
                                 to="/login"/>
                    </div>
                </div>
            </UCard>
        </UForm>
    </UMain>
</template>

<style scoped>

</style>