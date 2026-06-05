import { APIResponse, expect } from '@playwright/test';

export class HttpState {
    private response: APIResponse | undefined;
    private responseBody: unknown;

    reset() {
        this.response = undefined;
        this.responseBody = undefined;
    }

    setResponse(response: APIResponse) {
        this.response = response;
        this.responseBody = undefined;
    }

    getResponse(): APIResponse {
        expect(this.response).toBeDefined();
        return this.response as APIResponse;
    }

    async readBody<ResponseBody>(): Promise<ResponseBody> {
        if (this.responseBody === undefined) {
            this.responseBody = await this.getResponse().json();
        }

        return this.responseBody as ResponseBody;
    }
}
