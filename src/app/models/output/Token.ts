export interface Token {
    token_type?: string;
    token?: string;
    expires_in?: number;
    refresh_token?: string;
    error?: string;
}