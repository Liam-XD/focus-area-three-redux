import { APIRequestContext, expect } from '@playwright/test';
import { AuthApi } from '../../../src/api/client/authApi';
import { AuthTokenResponse } from '../../../src/api/types/authTypes';
import { HttpState } from './httpState';



export class AuthState {
    private httpState = new HttpState();
    private authToken: string | undefined;

    async acquireAuthToken(request: APIRequestContext): Promise<string> {
        const authApi = new AuthApi(request);
        this.httpState.setResponse(await authApi.createToken());
        expect(this.httpState.getResponse().status()).toBe(200);

        const body = await this.httpState.readBody<AuthTokenResponse>();
        expect(body.token).toBeTruthy();

        this.authToken = body.token;
        this.httpState.reset();

        return this.authToken as string;
    }
}