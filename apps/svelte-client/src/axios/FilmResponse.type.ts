export interface FilmResponse<Result> { 
    results: Result; 
    totalCount: number;
    searchCount: number;
    metadata?: number;
}