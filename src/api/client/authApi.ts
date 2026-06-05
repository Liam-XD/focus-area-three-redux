import { APIRequestContext } from '@playwright/test';
import { env } from '../../config/env';
import { ENDPOINTS } from '../../config/constants';

// This class enables interaction with the auth API. The provided methods all ofor checking the health of the API and acquiring auth tokens.
export class AuthApi {
    constructor(private request: APIRequestContext) { }

    async ping() {
        return this.request.get(`${env.baseUrl}${ENDPOINTS.PING}`);
    }

    async createToken(username = env.username, password = env.password) {
        return this.request.post(`${env.baseUrl}${ENDPOINTS.AUTH}`, {
            data: { username, password }
        });
    }
}