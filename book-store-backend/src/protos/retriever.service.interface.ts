import { Observable } from 'rxjs';

export interface HybridBookRetrieverService {
  Retrieve(
    request: RetrieveRequest,
  ): Observable<RetrieveResponse>;
}


export interface RetrieveRequest {
    query: string;
    denseTopK: number;
    sparseTopK: number;
    topK: number;
    topN: number;
}

export interface RetrieveResponse {
    bookIds: string[];
    scores: number[];
}