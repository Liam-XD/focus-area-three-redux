import { expect, APIRequestContext } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { BookingApi } from '../../src/api/client/bookingApi';
import { BookingResponse, CreateBookingResponse } from '../../src/api/types/bookingTypes';
import { createBookingPayload, patchNamePayload, updateBookingPayload } from '../../src/test-data/factories/bookingFactory';
import { HttpState } from './support/httpState';
import { AuthState } from './support/authState';

const { Before, After, Given, When, Then } = createBdd();

const httpState = new HttpState();
const authState = new AuthState();
let authToken: string | undefined;
let createdBookingId: number | undefined;
let createdBookingIds: number[] = [];

// Resetting shared state before each scenario
Before(async ({ }) => {
    httpState.reset();
    authToken = undefined;
    createdBookingId = undefined;
    createdBookingIds = [];
});

// Automatically acquiring auth token for scenarios that require write access
Before({ tags: '@update or @patch or @delete' }, async ({ request }) => {
    authToken = await authState.acquireAuthToken(request);
});

// Cleanup - Deleting created bookings after each scenario
After(async ({ request }) => {
    // If a single booking was created and an auth token is available, attempt to clean it up
    if (authToken && createdBookingId) {
        try {
            const bookingApi = new BookingApi(request); // Creates a new instance of BookingApi for cleanup
            await bookingApi.deleteBooking(createdBookingId, authToken); // Attempt to delete the created booking
            console.log(`Cleaned up booking ID: ${createdBookingId}`);
        } catch (error) {
            console.log(`Failed to cleanup booking ID: ${createdBookingId}`);
        }
    }

    // If multiple bookings were created and an auth token is available, attempt to clean them all up
    if (createdBookingIds.length > 0 && !authToken) {
        try {
            authToken = await authState.acquireAuthToken(request);
            const bookingApi = new BookingApi(request); // Creates a new instance of BookingApi for cleanup
            for (const bookingId of createdBookingIds) {
                await bookingApi.deleteBooking(bookingId, authToken); // Attempt to delete each created booking
                console.log(`Cleaned up booking ID: ${bookingId}`);
            }
        } catch (error) {
            console.log(`Failed to cleanup one or more booking IDs: ${createdBookingIds.join(', ')}`);
        }
    }
});

const getCreatedBookingId = (): number => {
    expect(createdBookingId).toBeDefined();
    return createdBookingId as number;
};

const getAuthToken = (): string => {
    expect(authToken).toBeDefined();
    return authToken as string;
};

const createBookingAndStoreId = async (request: APIRequestContext) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.createBooking(createBookingPayload()));

    const body = await httpState.readBody<CreateBookingResponse>();
    expect(body.bookingid).toBeTruthy();
    createdBookingId = body.bookingid;
};

const createMultipleBookingsAndStoreIds = async (
    request: APIRequestContext,
    bookingData: Array<{ firstname: string; lastname: string }>,
) => {
    const bookingApi = new BookingApi(request);
    for (const data of bookingData) {
        const payload = { ...createBookingPayload(), ...data };
        httpState.setResponse(await bookingApi.createBooking(payload));
        const body = await httpState.readBody<CreateBookingResponse>();
        expect(body.bookingid).toBeTruthy();
        createdBookingIds.push(body.bookingid);
    }
};

Given('I created a booking with the default booking payload', async ({ request }) => {
    await createBookingAndStoreId(request);
    expect(httpState.getResponse().status()).toBe(200);
});

Given(`I have created bookings with the following names:`, async ({ request }, table: { hashes: () => Array<{ firstname: string; lastname: string }> }) => {
    const bookingData = table.hashes(); //Hashes converts the table data into an array of objects with keys matching the column headers
    await createMultipleBookingsAndStoreIds(request, bookingData);
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

When('I retrieve booking ids filtered by lastname {string}', async ({ request }, lastName: string) => {
    const bookingApi = new BookingApi(request);
    httpState.setResponse(await bookingApi.getBookingIds({ lastname: lastName }));
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

Then('every retrieved booking should have lastname {string}', async ({ request }, expectedLastName: string) => {
    const ids = await httpState.readBody<Array<{ bookingid: number }>>();
    expect(ids.length).toBeGreaterThan(0);

    const bookingApi = new BookingApi(request);
    for (const item of ids) {
        const response = await bookingApi.getBooking(item.bookingid);
        expect(response.status()).toBe(200);
        const booking = (await response.json()) as BookingResponse;
        expect(booking.lastname).toBe(expectedLastName);
    }
});