// This file provides factory functions to generate payloads for creating, updating, and patching bookings in the API.

import { addDays, formatDate } from '../../utils';
import { CreateBookingRequest, UpdateBookingRequest, PatchBookingRequest } from '../../api/types/bookingTypes';

// Creates a payload for creating a booking with default check-in and check-out dates based on the current date, which can be overridden by providing offsets.
export const createBookingPayload = (checkinOffset = 2, checkoutOffset = 5): CreateBookingRequest => {
    const today = new Date();

    return {
        firstname: 'Alexander',
        lastname: 'Great',
        totalprice: 375,
        depositpaid: true,
        bookingdates: {
            checkin: formatDate(addDays(today, checkinOffset)),
            checkout: formatDate(addDays(today, checkoutOffset)),
        },
        additionalneeds: 'Breakfast',
    };
};

// Creates a payload for updating a booking.
export const updateBookingPayload = (checkinOffset = 3, checkoutOffset = 6): UpdateBookingRequest => {
    const today = new Date();

    return {
        firstname: 'Caesar',
        lastname: 'Salad',
        totalprice: 1544,
        depositpaid: false,
        bookingdates: {
            checkin: formatDate(addDays(today, checkinOffset)),
            checkout: formatDate(addDays(today, checkoutOffset)),
        },
        additionalneeds: 'Extra pillows',
    };
};

// Creates a payload for patching the first and last name in a booking.
export const patchNamePayload = (): PatchBookingRequest => ({
    firstname: 'Julius',
    lastname: 'Caesar',
});