import { test, expect } from '@playwright/test';
import { AuthApi } from '../src/api/client/authApi';
import { BookingApi } from '../src/api/client/bookingApi';
import { createBookingPayload, updateBookingPayload, patchNamePayload } from '../src/test-data/factories/bookingFactory';

let authToken: string;
let createdBookingId: number;
let bookingApi: BookingApi;

test.describe.serial('Booking Flow', () => {
  test.beforeAll(async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.createToken();
    expect(response.status()).toBe(200);
    const responseObject = await response.json()
    authToken = responseObject.token;
    expect(authToken).toBeTruthy();
  });

  test.beforeEach(async ({ request }) => {
    bookingApi = new BookingApi(request);
  });

  test('Create a new booking', async () => {
    const response = await bookingApi.createBooking(createBookingPayload());
    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.bookingid).toBeTruthy();
    createdBookingId = responseObject.bookingid;
  });

  test('Retrieve Booking', async () => {
    expect(createdBookingId).toBeTruthy();
    const response = await bookingApi.getBooking(createdBookingId);
    expect(response.status()).toBe(200);
    const booking = await response.json();
    expect(booking.firstname).toBe('Alexander');
  });

  test('Update Booking', async () => {
    expect(createdBookingId).toBeTruthy();
    const response = await bookingApi.updateBooking(createdBookingId, updateBookingPayload(), authToken);
    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.firstname).toBe('Caesar');
  })

  test('Update name fields only', async () => {
    expect(createdBookingId).toBeTruthy();
    const response = await bookingApi.patchBooking(createdBookingId, patchNamePayload(), authToken);
    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.firstname).not.toBe('Caesar');
    expect(responseObject.lastname).toBe('Caesar');
    expect(responseObject.additionalneeds).toBe('Extra pillows');

  })

  test('Delete the booking', async () => {
    expect(createdBookingId).toBeTruthy();
    const response = await bookingApi.deleteBooking(createdBookingId, authToken);
    expect(response.status()).toBe(201);
  })

  test('Attempt to retrieve deleted booking', async () => {
    expect(createdBookingId).toBeTruthy();
    const response = await bookingApi.getBooking(createdBookingId);
    expect(response.status()).toBe(404);
  });
});