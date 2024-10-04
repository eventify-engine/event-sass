import CrudRepository from "~/repos/CrudRepository";
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

    public show(id: number) {
        return this.client.getData<Resource<EventResource>>(`event.show.${id}`, `${this.baseUrl}/${id}`)
    }
}