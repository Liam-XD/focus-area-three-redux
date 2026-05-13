import { expect } from '@playwright/test';
import { AuthApi } from '../../src/api/client/authApi';
import { AuthTokenResponse } from '../../src/api/types/authTypes';
import { createBdd } from 'playwright-bdd';
import { HttpState } from './support/httpState';

const { Before, Given, When, Then } = createBdd();

const httpState = new HttpState();
let usernameOverride: string | undefined;
let passwordOverride: string | undefined;

// Reset shared state before each scenario
Before(async ({ }) => {
    httpState.reset();
    usernameOverride = undefined;
    passwordOverride = undefined;
});


Given('the auth API endpoint is available', async ({ request }) => {
    // This step is decorative since API availability is tested in next steps.
});

Given('I have valid auth credentials', async ({ }) => {
    // Undefined values use the values set in the .env file
    usernameOverride = undefined;
    passwordOverride = undefined;
});

Given(
    'I have invalid auth credentials with username {string} and password {string}',
    async ({ }, invalidUsername: string, invalidPassword: string) => {
        usernameOverride = invalidUsername;
        passwordOverride = invalidPassword;
    }
);

When('I call the API health endpoint', async ({ request }) => {
    const authApi = new AuthApi(request);
    httpState.setResponse(await authApi.ping());
});

When('I request an auth token', async ({ request }) => {
    const authApi = new AuthApi(request);
    httpState.setResponse(await authApi.createToken(usernameOverride, passwordOverride));
});

Then('the response status should be {int}', async ({ }, statusCode: number) => {
    expect(httpState.getResponse().status()).toBe(statusCode);
});

Then('the response should contain a token', async ({ }) => {
    const body = await httpState.readBody<AuthTokenResponse>();
    expect(body.token).toBeTruthy();
});

Then('the response should not contain a token', async ({ }) => {
    const body = await httpState.readBody<AuthTokenResponse>();
    expect(body.token).toBeFalsy();
});

Then('the auth failure reason should be {string}', async ({ }, reason: string) => {
    const body = await httpState.readBody<AuthTokenResponse>();
    expect(body.reason).toBe(reason);
});