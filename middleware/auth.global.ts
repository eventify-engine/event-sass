import ProfileRepository from "~/repos/ProfileRepository";
import type ProfileResource from "~/resources/ProfileResource";

export default defineNuxtRouteMiddleware(async (to) => {
    const profileRepo  = new ProfileRepository();
    const profileState = useState<ProfileResource | null>('profile', () => null);
    const token        = useCookie<string>('token');

    if (token.value && !profileState.value) {
        try {
            const {data: profile} = await profileRepo.index();
            profileState.value    = profile.value?.data ?? null;
        } catch {
            profileState.value = null;
            token.value        = '';
        }
    } else if (!token.value) {
        profileState.value = null;
    }
});