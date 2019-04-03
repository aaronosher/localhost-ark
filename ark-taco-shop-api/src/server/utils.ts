import { Request } from "hapi";

export interface PaginatedResults<T> {
    results: T[];
    totalCount: number;
}

export interface PaginableData<T> {
    rows: T[];
    count: number;
}

export interface PaginationParams {
    offset: number;
    limit: number;
}

export interface HandlerResponse<T> {
    data: T;
}

export const paginate = (request: Request): PaginationParams => ({
    offset: ((Number(request.query.page) || 1) - 1) * (Number(request.query.limit) || 100),
    limit: Number(request.query.limit) || 100,
});

export const respondWithCollection = <T>(data: T): HandlerResponse<T> => ({ data });

export const toPagination = <T>({ rows: results, count: totalCount }: PaginableData<T>): PaginatedResults<T> => ({
    results,
    totalCount,
});
