import { addDays, formatDate } from '../../utils';
import { CreateBookingRequest, UpdateBookingRequest, PatchBookingRequest } from '../../api/types/bookingTypes';

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

export const patchNamePayload = (): PatchBookingRequest => ({
    firstname: 'Julius',
    lastname: 'Caesar',
});