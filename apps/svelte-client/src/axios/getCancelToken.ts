import type { CancelTokenSource } from "axios/dist/axios";
import axios from "axios/dist/axios";

export function getCancelToken(): CancelTokenSource {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    return source;
}