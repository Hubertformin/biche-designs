import {CartModel} from "./item.model";
import {PaymentIntent, PaymentMethodCreateParams} from "@stripe/stripe-js";


export type PaymentModel = {
    id?: string;
    items: CartModel[];
    invoiceNumber: string;
    userId: string;
    preOrder: boolean;
    user: PaymentMethodCreateParams.BillingDetails;
    paymentIntent: any,
    amount: number;
    userAgent: {
        deviceType: string,
        browser: string,
        os: string,
        osVersion: string
    },
    date: number;
}
