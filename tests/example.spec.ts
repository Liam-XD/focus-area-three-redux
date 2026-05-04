import { test, expect } from '@playwright/test';
import { AuthApi } from '../src/api/client/authApi';
import { BookingApi } from '../src/api/client/bookingApi';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(baseDate: Date, daysToAdd: number): Date {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

let authToken: string;
let createdBookingId: number;

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

test.describe.serial('Booking Flow', () => {
  test('Auth Token Retrieval', async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.createToken();
    expect(response.status()).toBe(200);
    const responseObject = await response.json()
    authToken = responseObject.token;
  });

  test('Create a new booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);

    const today = new Date();
    const checkinDate = formatDate(addDays(today, 2));
    const checkoutDate = formatDate(addDays(today, 5));

    const response = await bookingApi.createBooking({
      "firstname": "Alexander",
      "lastname": "Great",
      "totalprice": 375,
      "depositpaid": true,
      "bookingdates": {
        "checkin": checkinDate,
        "checkout": checkoutDate
      },
      "additionalneeds": "Breakfast"
    });

    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.bookingid).toBeTruthy();
    createdBookingId = responseObject.bookingid;
  });

  test('Retrieve Booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    expect(createdBookingId).toBeTruthy();
    const response = await bookingApi.getBooking(createdBookingId);
    expect(response.status()).toBe(200);
    const booking = await response.json();
    expect(booking.firstname).toBe('Alexander');
  });

  test('Update Booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);
    const today = new Date();
    const checkinDate = formatDate(addDays(today, 3));
    const checkoutDate = formatDate(addDays(today, 6));

    expect(createdBookingId).toBeTruthy();

    const response = await bookingApi.updateBooking(createdBookingId,
      {
        "firstname": "Caesar",
        "lastname": "Salad",
        "totalprice": 1544,
        "depositpaid": true,
        "bookingdates": {
          "checkin": checkinDate,
          "checkout": checkoutDate
        },
        "additionalneeds": "Extra pillows"
      },
      authToken
    );

    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.firstname).toBe('Caesar');
  })

  test('Update name fields only', async ({ request }) => {
    const bookingApi = new BookingApi(request);

    expect(createdBookingId).toBeTruthy();

    const response = await bookingApi.patchBooking(createdBookingId, {
      "firstname": "Julius",
      "lastname": "Caesar",
    },
      authToken
    );
    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.firstname).not.toBe('Caesar');
    expect(responseObject.lastname).toBe('Caesar');
    expect(responseObject.additionalneeds).toBe('Extra pillows');

  })

  test('Delete the booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);

    expect(createdBookingId).toBeTruthy();

    const response = await bookingApi.deleteBooking(createdBookingId, authToken);
    expect(response.status()).toBe(201);
  })

  test('Attempt to retrieve deleted booking', async ({ request }) => {
    const bookingApi = new BookingApi(request);

    expect(createdBookingId).toBeTruthy();

    const response = await bookingApi.getBooking(createdBookingId);
    expect(response.status()).toBe(404);
  });


});