export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
}
export declare class PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
