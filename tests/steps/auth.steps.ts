import { expect, APIResponse } from '@playwright/test';
import { AuthApi } from '../../src/api/client/authApi';
import { AuthTokenResponse } from '../../src/api/types/authTypes';
import { createBdd } from 'playwright-bdd';

const { Before, Given, When, Then } = createBdd();

let response: APIResponse | undefined;
let responseBody: AuthTokenResponse | undefined;
let usernameOverride: string | undefined;
let passwordOverride: string | undefined;

// Reset shared state before each scenario
Before(async ({ }) => {
    response = undefined;
    responseBody = undefined;
    usernameOverride = undefined;
    passwordOverride = undefined;
});

// Helper functions to access shared state with proper type assertions
function getResponse(): APIResponse {
    expect(response).toBeDefined();
    return response as APIResponse;
}

// Reads and caches the response body as an AuthTokenResponse
async function readResponseBody(): Promise<AuthTokenResponse> {
    if (responseBody === undefined) {
        responseBody = (await getResponse().json()) as AuthTokenResponse;
    }
    return responseBody!;
}

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
    response = await authApi.ping();
    responseBody = undefined;
});

When('I request an auth token', async ({ request }) => {
    const authApi = new AuthApi(request);
    response = await authApi.createToken(usernameOverride, passwordOverride);
    responseBody = undefined;
});

Then('the response status should be {int}', async ({ }, statusCode: number) => {
    expect(getResponse().status()).toBe(statusCode);
});

Then('the response should contain a token', async ({ }) => {
    const body = await readResponseBody();
    expect(body.token).toBeTruthy();
});

Then('the response should not contain a token', async ({ }) => {
    const body = await readResponseBody();
    expect(body.token).toBeFalsy();
});

Then(/the auth failure reason should be (.+)/, async ({ }, reason: string) => {
    const body = await readResponseBody();
    expect(body.reason).toBe(reason);
});