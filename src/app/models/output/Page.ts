export interface Page<Type> {
    page: number;
    size: number;
    sort: string;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
    content: Array<Type>;
}