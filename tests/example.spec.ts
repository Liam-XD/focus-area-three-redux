import { test, expect } from '@playwright/test';

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
    const response = await request.get('https://restful-booker.herokuapp.com/ping');
    expect(response.status()).toBe(201);
  });

  test('Valid credentials for auth returns token', async ({ request }) => {
    const response = await request.post('https://restful-booker.herokuapp.com/auth', { data: { username: "admin", password: "password123" } });
    expect(response.status()).toBe(200);
    const responseObject = await response.json()
    expect(responseObject.token).toBeTruthy();
  });

  test('Invalid credentials for auth returns no token', async ({ request }) => {
    const response = await request.post('https://restful-booker.herokuapp.com/auth', { data: { username: "unknown", password: "password321" } });
    const responseObject = await response.json()
    expect(responseObject.token).toBeFalsy();
    expect(responseObject.reason).toBe('Bad credentials');
  });
});

test.describe.serial('Booking Flow', () => {
  test('Auth Token Retrieval', async ({ request }) => {
    const response = await request.post('https://restful-booker.herokuapp.com/auth', { data: { username: "admin", password: "password123" } });
    expect(response.status()).toBe(200);
    const responseObject = await response.json()
    authToken = responseObject.token;
  });


  test('Create a new booking', async ({ request }) => {
    const today = new Date();
    const checkinDate = formatDate(addDays(today, 2));
    const checkoutDate = formatDate(addDays(today, 5));

    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
      data: {
        "firstname": "Alexander",
        "lastname": "Great",
        "totalprice": 375,
        "depositpaid": true,
        "bookingdates": {
          "checkin": checkinDate,
          "checkout": checkoutDate
        },
        "additionalneeds": "Breakfast"
      }
    });

    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.bookingid).toBeTruthy();
    createdBookingId = responseObject.bookingid;
  });

  test('Retrieve Booking', async ({ request }) => {
    expect(createdBookingId).toBeTruthy();
    const response = await request.get(`https://restful-booker.herokuapp.com/booking/${createdBookingId}`);
    expect(response.status()).toBe(200);
    const booking = await response.json();
    expect(booking.firstname).toBe('Alexander');
  });

  test('Update Booking', async ({ request }) => {
    const today = new Date();
    const checkinDate = formatDate(addDays(today, 3));
    const checkoutDate = formatDate(addDays(today, 6));

    expect(createdBookingId).toBeTruthy();
    const response = await request.put(`https://restful-booker.herokuapp.com/booking/${createdBookingId}`, {
      headers: {
        Cookie: `token=${authToken}`
      },
      data: {
        "firstname": "Caesar",
        "lastname": "Salad",
        "totalprice": 1544,
        "depositpaid": true,
        "bookingdates": {
          "checkin": checkinDate,
          "checkout": checkoutDate
        },
        "additionalneeds": "Extra pillows"
      }
    })
    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.firstname).toBe('Caesar');
  })

  test('Update name fields only', async ({ request }) => {
    expect(createdBookingId).toBeTruthy();
    const response = await request.patch(`https://restful-booker.herokuapp.com/booking/${createdBookingId}`, {
      headers: {
        Cookie: `token=${authToken}`
      },
      data: {
        "firstname": "Julius",
        "lastname": "Caesar",
      }
    })
    expect(response.status()).toBe(200);
    const responseObject = await response.json();
    expect(responseObject.firstname).not.toBe('Caesar');
    expect(responseObject.lastname).toBe('Caesar');
    expect(responseObject.additionalneeds).toBe('Extra pillows');

  })

  test('Delete the booking', async ({ request }) => {
    expect(createdBookingId).toBeTruthy();
    const response = await request.delete(`https://restful-booker.herokuapp.com/booking/${createdBookingId}`, {
      headers: {
        Cookie: `token=${authToken}`
      }
    })
    expect(response.status()).toBe(201);
  })

  test('Attempt to retrieve deleted booking', async ({ request }) => {
    expect(createdBookingId).toBeTruthy();
    const response = await request.get(`https://restful-booker.herokuapp.com/booking/${createdBookingId}`);
    expect(response.status()).toBe(404);
  });


});