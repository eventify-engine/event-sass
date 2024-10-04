import CrudRepository from "~/repos/CrudRepository";
import type Resource from "~/types/Resource";
import type ThreadResource from "~/resources/ThreadResource";

export default class ThreadRepository extends CrudRepository<ThreadResource, number> {
    protected baseUrl: string = '/conferences';

    constructor(conferenceId: number, eventId: number) {
        super();
        this.baseUrl += `/${conferenceId}/events/${eventId}/threads`;
    }

    override store<R = Resource<ThreadResource>>(data: ThreadResource): Promise<R> {
        return super.store(data);
    }

    public show(id: number) {
        return this.client.getData<Resource<ThreadResource>>(`thread.show.${id}`, `${this.baseUrl}/${id}`)
    }
}