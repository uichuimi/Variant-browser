export interface IReadable {
    fetch<T,U>(endpoint: string, data?: T, query?: object): U;
}