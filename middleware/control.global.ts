import type ProfileResource from "~/resources/ProfileResource";

export default defineNuxtRouteMiddleware(async (to) => {
    const profileState = useState<ProfileResource | null>('profile', () => null);

    if (to.path.startsWith('/control') && !profileState.value)
        return navigateTo('/login');

    if (profileState.value && (to.path == '/login' || to.path == '/register'))
        return navigateTo('/control');
});