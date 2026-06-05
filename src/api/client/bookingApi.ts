import { APIRequestContext } from '@playwright/test';
import { env } from '../../config/env';
import { ENDPOINTS } from '../../config/constants';
import { CreateBookingRequest, UpdateBookingRequest, PatchBookingRequest } from '../types/bookingTypes';

export class BookingApi {
    constructor(private request: APIRequestContext) { }

    async createBooking(bookingData: CreateBookingRequest) {
        return this.request.post(`${env.baseUrl}${ENDPOINTS.BOOKING}`, {
            data: bookingData,
        });
    }

    async getBooking(bookingId: number) {
        return this.request.get(`${env.baseUrl}${ENDPOINTS.BOOKING}/${bookingId}`);
    }

    async updateBooking(bookingId: number, bookingData: UpdateBookingRequest, token: string) {
        return this.request.put(`${env.baseUrl}${ENDPOINTS.BOOKING}/${bookingId}`, {
            data: bookingData,
            headers: {
                'Cookie': `token=${token}`
            }
        });
    }

    async patchBooking(bookingId: number, bookingData: PatchBookingRequest, token: string) {
        return this.request.patch(`${env.baseUrl}${ENDPOINTS.BOOKING}/${bookingId}`, {
            data: bookingData,
            headers: {
                'Cookie': `token=${token}`
            }
        });
    }

    async deleteBooking(bookingId: number, token: string) {
        return this.request.delete(`${env.baseUrl}${ENDPOINTS.BOOKING}/${bookingId}`, {
            headers: {
                'Cookie': `token=${token}`
            }
        });
    }

    async getBookingIds(filter?: { lastname?: string }) {
        const queryParams = new URLSearchParams();
        if (filter?.lastname) {
            queryParams.append('lastname', filter.lastname);
        }
        const url = `${env.baseUrl}${ENDPOINTS.BOOKING}?${queryParams.toString()}`;
        return this.request.get(url);
    }
}