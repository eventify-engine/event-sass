import CrudRepository from "~/repos/CrudRepository";
import type ConferenceResource from "~/resources/ConferenceResource";
import type Resource from "~/types/Resource";
import type EventResource from "~/resources/EventResource";

export default class EventRepository extends CrudRepository<EventResource, number> {
    protected baseUrl: string = '/conferences';

    constructor(conferenceId: number) {
        super();
        this.baseUrl += `/${conferenceId}/events`;
    }

    override store<R = Resource<EventResource>>(data: EventResource): Promise<R> {
        return super.store(data);
    }

    public hostPrefix(value: string): Promise<Resource<{id: number|null}>> {
        return this.client.get<Resource<{id: number|null}>>(`${this.baseUrl}/host-prefix?` + querify({value}).toString());
    }

    public show(id: number) {
        return this.client.getData<Resource<ConferenceResource>>(`conference.show.${id}`, `${this.baseUrl}/${id}`)
    }
}