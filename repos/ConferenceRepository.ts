import CrudRepository from "~/repos/CrudRepository";
import type ConferenceResource from "~/resources/ConferenceResource";
import type Resource from "~/types/Resource";

export default class ConferenceRepository extends CrudRepository<ConferenceResource, number> {
    protected baseUrl: string = '/conferences';

    override store<R = Resource<ConferenceResource>>(data: ConferenceResource): Promise<R> {
        return super.store(data);
    }

    public hostPrefix(value: string): Promise<Resource<{id: number|null}>> {
        return this.client.get<Resource<{id: number|null}>>(`${this.baseUrl}/host-prefix?` + querify({value}).toString());
    }

    public show(id: number) {
        return this.client.getData<Resource<ConferenceResource>>(`conference.show.${id}`, `${this.baseUrl}/${id}`)
    }
}