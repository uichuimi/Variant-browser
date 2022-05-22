export interface ICreatable {
    create<T,U>(data: T, endpoint: string): U;
}