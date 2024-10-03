import CrudRepository from "~/repos/CrudRepository";
import type ConferenceResource from "~/resources/ConferenceResource";
import type Resource from "~/types/Resource";

export default class ConferenceRepository extends CrudRepository<ConferenceResource, number> {
    protected baseUrl: string = '/conferences';

    override store<R = Resource<ConferenceResource>>(data: ConferenceResource): Promise<R> {
        return super.store(data);
    }

    public show(id: number) {
        return this.client.getData<Resource<ConferenceResource>>(`conference.show.${id}`, `${this.baseUrl}/${id}`)
    }
}