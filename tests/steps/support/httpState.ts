// This class manages the state of HTTP responses during tests, allowing step definitions to access the latest response.

import { APIResponse, expect } from '@playwright/test';

export class HttpState {
    private response: APIResponse | undefined;
    private responseBody: unknown;

    reset() { // Clears the stored response and response body
        this.response = undefined;
        this.responseBody = undefined;
    }

    setResponse(response: APIResponse) {
        this.response = response;
        this.responseBody = undefined; // Resets the response body to ensure it is re-read for each new response
    }

    getResponse(): APIResponse { // Retrieves the stored response and ensures it is defined before returning
        expect(this.response).toBeDefined();
        return this.response as APIResponse;
    }

    async readBody<ResponseBody>(): Promise<ResponseBody> {
        if (this.responseBody === undefined) {
            this.responseBody = await this.getResponse().json(); // Reads and stores the response body if it hasn't been read yet
        }

        return this.responseBody as ResponseBody; // Returns the stored response body
    }
}
