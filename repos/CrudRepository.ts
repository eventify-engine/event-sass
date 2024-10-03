import type PaginatedCollection from "~/types/PaginatedCollection";
import Repository from "~/repos/Repository";

export default abstract class CrudRepository<T, ID> extends Repository {
    protected abstract baseUrl: string;
    protected postFiles: boolean = false;
    protected putFiles: boolean  = false;

    public list<C = PaginatedCollection<T>>(request: () => any) {
        return this.client.getLazyFetch<C>(
            () => `${this.baseUrl}?${querify(request()).toString()}`
        );
    }

    public store<R = void>(data: T): Promise<R> {
        return this.client.post<R>(this.baseUrl, data, this.postFiles);
    }

    public update(data: T): Promise<void> {
        return this.client.put<void>(`${this.baseUrl}/${this.getId(data)}`, data, this.putFiles);
    }

    public remove(id: ID): Promise<void> {
        return this.client.delete<void>(`${this.baseUrl}/${id}`);
    }

    public removeMany(ids: ID[]): Promise<void> {
        return this.client.delete<void>(this.baseUrl, {ids});
    }

    protected getId(data: T): ID {
        return (data as any).id;
    }
}