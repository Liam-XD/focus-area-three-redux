import { test, expect } from '@playwright/test';
import { AuthApi } from '../src/api/client/authApi';

test.describe.parallel('Auth API Checks', () => {
    test('API is up and running', async ({ request }) => {
        const authApi = new AuthApi(request);
        const response = await authApi.ping();
        expect(response.status()).toBe(201);
    }
    );

    test('Valid credentials for auth returns token', async ({ request }) => {
        const authApi = new AuthApi(request);
        const response = await authApi.createToken();
        expect(response.status()).toBe(200);
        const responseObject = await response.json()
        expect(responseObject.token).toBeTruthy();
    });

    test('Invalid credentials for auth returns no token', async ({ request }) => {
        const authApi = new AuthApi(request);
        const response = await authApi.createToken("unknown", "password321");
        const responseObject = await response.json()
        expect(response.status()).toBe(200);
        expect(responseObject.token).toBeFalsy();
        expect(responseObject.reason).toBe('Bad credentials');
    });
});