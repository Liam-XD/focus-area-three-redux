// This file defines TypeScript interfaces for the booking-related API requests and responses.

export interface BookingDates {
    checkin: string;
    checkout: string;
}

export interface BookingPayload {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

export type BookingResponse = BookingPayload;

export type CreateBookingRequest = BookingPayload;

export type UpdateBookingRequest = BookingPayload;

export type PatchBookingRequest =
    Partial<Omit<BookingPayload, 'bookingdates'>> & {
        bookingdates?: Partial<BookingDates>;
    };

export interface CreateBookingResponse {
    bookingid: number;
    booking: BookingPayload;
}