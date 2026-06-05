// This file defines TypeScript interfaces for the authentication-related API responses.
// An interface declares what shape an opjec should have.

export interface AuthTokenResponse {
    token?: string;
    reason?: string;
}
