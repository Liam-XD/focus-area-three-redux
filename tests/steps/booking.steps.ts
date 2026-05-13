import { expect, APIRequestContext } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { AuthApi } from '../../src/api/client/authApi';
import { BookingApi } from '../../src/api/client/bookingApi';
import { AuthTokenResponse } from '../../src/api/types/authTypes';
import { BookingResponse, CreateBookingResponse } from '../../src/api/types/bookingTypes';
import { createBookingPayload, patchNamePayload, updateBookingPayload } from '../../src/test-data/factories/bookingFactory';
import { HttpState } from './support/httpState';

const { Before, After, Given, When, Then } = createBdd();

const httpState = new HttpState();
let authToken: string | undefined;
let createdBookingId: number | undefined;

// Resetting shared state before each scenario
Before(async ({ }) => {
    httpState.reset();
    authToken = undefined;
    createdBookingId = undefined;
});

// Automatically acquiring auth token for scenarios that require write access
Before({ tags: '@update or @patch or @delete' }, async ({ request }) => {
    const authApi = new AuthApi(request);
    httpState.setResponse(await authApi.createToken());
    expect(httpState.getResponse().status()).toBe(200);
    const body = await httpState.readBody<AuthTokenResponse>();
    expect(body.token).toBeTruthy();
    authToken = body.token;
    httpState.reset();
});

// Cleanup - Deleting created bookings after each scenario
After(async ({ request }) => {
    if (authToken && createdBookingId) {
        try {
            const bookingApi = new BookingApi(request); // Creates a new instance of BookingApi for cleanup
            await bookingApi.deleteBooking(createdBookingId, authToken); // Attempt to delete the created booking
            console.log(`Cleaned up booking ID: ${createdBookingId}`);
        } catch (error) {
            console.log(`Failed to cleanup booking ID: ${createdBookingId}`);
        }
    }
});

function getCreatedBookingId(): number {
    expect(createdBookingId).toBeDefined();
    return createdBookingId as number;
}

function getAuthToken(): string {
    expect(authToken).toBeDefined();
    return authToken as string;
}

async function createBookingAndStoreId(request: APIRequestContext) {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.createBooking(createBookingPayload()));

    const body = await httpState.readBody<CreateBookingResponse>();
    expect(body.bookingid).toBeTruthy();
    createdBookingId = body.bookingid;
}

Given('I created a booking with the default booking payload', async ({ request }) => {
    await createBookingAndStoreId(request);
    expect(httpState.getResponse().status()).toBe(200);
});

Given('I delete the booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.deleteBooking(getCreatedBookingId(), getAuthToken()));
    expect(httpState.getResponse().status()).toBe(201);
});

When('I create a booking with the default booking payload', async ({ request }) => {
    await createBookingAndStoreId(request);
});

When('I retrieve the created booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.getBooking(getCreatedBookingId()));
});

When('I update the created booking with the update booking payload', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.updateBooking(getCreatedBookingId(), updateBookingPayload(), getAuthToken()));
});

When('I patch the created booking with the patch name payload', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.patchBooking(getCreatedBookingId(), patchNamePayload(), getAuthToken()));
});

When('I delete the created booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.deleteBooking(getCreatedBookingId(), getAuthToken()));
});

When('I retrieve the deleted booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.getBooking(getCreatedBookingId()));
});

Then('the booking response status should be {int}', async ({ }, statusCode: number) => {
    expect(httpState.getResponse().status()).toBe(statusCode);
});

Then('the response should contain a booking id', async ({ }) => {
    const body = await httpState.readBody<CreateBookingResponse>();
    expect(body.bookingid).toBeTruthy();
});

Then('the booking first name should be {string}', async ({ }, firstName: string) => {
    const body = await httpState.readBody<BookingResponse>();
    expect(body.firstname).toBe(firstName);
});

Then('the booking first name should not be {string}', async ({ }, firstName: string) => {
    const body = await httpState.readBody<BookingResponse>();
    expect(body.firstname).not.toBe(firstName);
});

Then('the booking last name should be {string}', async ({ }, lastName: string) => {
    const body = await httpState.readBody<BookingResponse>();
    expect(body.lastname).toBe(lastName);
});

Then('the booking additional needs should be {string}', async ({ }, additionalNeeds: string) => {
    const body = await httpState.readBody<BookingResponse>();
    expect(body.additionalneeds).toBe(additionalNeeds);
});