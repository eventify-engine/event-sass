<script setup lang="ts">
import {type InferType} from "yup";
import type {Form, FormSubmitEvent} from "#ui/types";
import AuthRepository from "~/repos/AuthRepository";

definePageMeta({
    layout: 'auth'
});

const authRepo = new AuthRepository();

const state = ref({
    name                 : '',
    email                : '',
    password             : '',
    password_confirmation: ''
});

const {schema, action} = authRepo.register();
const toast            = useToast();
const form             = ref<Form<Schema>>();
const hasError         = ref<boolean>(false);
const loading          = ref<boolean>(false);
const token            = useCookie<string>('token', {expires: new Date(Date.now() + 3600 * 24 * 31 * 1000)});

type Schema = InferType<typeof schema>;

async function submit(event: FormSubmitEvent<Schema>) {
    if (!form.value)
        return;

    form.value.clear();
    loading.value  = true;
    hasError.value = false;

    try {
        const response = await action(event.data);
        token.value = response.data.token;
        await navigateTo('/control');
    } catch (e: any) {
        if (e.statusCode === 422) {
            form.value.setErrors(Object.keys(e.data.errors).map((key: string) => ({
                message: e.data.errors[key].join('. '),
                path   : key
            })));

            hasError.value = true;
        } else {
            toast.add({
                title      : 'Whoops',
                description: e.statusCode === 500 ? 'Something broke on the server' : e.message,
                color      : 'red',
                icon       : 'i-heroicons-exclamation-circle-16-solid'
            });
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <Head>
        <title>Registration // Eventify</title>
    </Head>

    <UForm ref="form" :state="state" :schema="schema" @submit="submit" @error="() => hasError = true">
        <UCard class="w-72 bg-transparent/20 backdrop-blur ring-0 shadow-xl"
               :class="{'has-error': hasError}">
            <div class="flex flex-col gap-5">
                <h3 class="text-gray-50 font-semibold text-xl text-center">Registration</h3>

                <UFormGroup label="Name"
                            name="name"
                            required
                            help="Maximum 25 characters"
                            :ui="{label: {base: 'text-gray-50', required: 'after:text-red-400'}, help: 'text-violet-300', error: 'text-red-400 drop-shadow'}">
                    <UInput placeholder="John Doe"
                            v-model="state.name"/>
                </UFormGroup>

                <UFormGroup label="E-mail"
                            name="email"
                            required
                            :ui="{label: {base: 'text-gray-50', required: 'after:text-red-400'}, error: 'text-red-400 drop-shadow'}">
                    <UInput type="email"
                            placeholder="make@yourevent.com"
                            v-model="state.email"/>
                </UFormGroup>

                <UFormGroup label="Password"
                            name="password"
                            help="Minimum 8 characters"
                            required
                            :ui="{label: {base: 'text-gray-50', required: 'after:text-red-400'}, help: 'text-violet-300', error: 'text-red-400 drop-shadow'}">
                    <UInput type="password"
                            placeholder="••••••••"
                            v-model="state.password"/>
                </UFormGroup>

                <UFormGroup label="Confirm password"
                            name="password_confirmation"
                            required
                            :ui="{label: {base: 'text-gray-50', required: 'after:text-red-400'}, error: 'text-red-400 drop-shadow'}">
                    <UInput type="password"
                            placeholder="••••••••"
                            v-model="state.password_confirmation"/>
                </UFormGroup>

                <div class="flex flex-col gap-2.5">
                    <UButton type="submit"
                             color="violet"
                             label="Register"
                             icon="i-heroicons-bolt"
                             :loading="loading"/>

                    <UButton color="violet"
                             label="Sign in"
                             icon="i-heroicons-arrow-right-end-on-rectangle"
                             to="/login"/>
                </div>
            </div>
        </UCard>
    </UForm>
</template>

<style scoped>

</style>