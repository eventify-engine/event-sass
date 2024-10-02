import Repository from "~/repos/Repository";
import type Resource from "~/types/Resource";
import type ProfileResource from "~/resources/ProfileResource";

export default class ProfileRepository extends Repository {
    public index() {
        return this.client.getData<Resource<ProfileResource>>('profile', '/profile');
    }
}