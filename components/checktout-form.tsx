import React, {useEffect, useState} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {
    PaymentMethodCreateParams,
    StripeCardElementOptions
} from "@stripe/stripe-js";
import '../styles/CheckoutForm.module.less';
import {formatCurrency} from "../utils/format-currency.util";
import InputMask from 'react-input-mask';
import axios from "axios";
import CheckoutError from "./checkout-error";
import {CheckCircleFilled} from "@ant-design/icons/lib";
import {paymentCollection} from "../firebase/db-service";
import Link from "next/link";
import {useUser} from "../utils/auth/useUser";
import {Form, Input} from "antd";
import {PaymentModel} from "../models/payment.model";

const CARD_OPTIONS: StripeCardElementOptions = {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#999',
            color: '#2B2B2B',
            fontWeight: '400',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            fontVariant: 'tabular-nums',
            lineHeight: '1.5715',
            backgroundColor: '#fff',
            ':-webkit-autofill': {
                color: '#fce883',
            },
            '::placeholder': {
                color: '#999',
            },
        },
        invalid: {
            iconColor: '#f55f4f',
            color: '#f55f4f',
        },
    },
    hidePostalCode: true
};

const CardField = ({onChange}) => (
    <div className="FormRow">
        <CardElement options={CARD_OPTIONS} onChange={onChange} />
    </div>
);

const Field = ({
                   label,
                   id,
                   type,
                   placeholder,
                   required,
                   autoComplete,
                   value,
                   onChange,
               }) => (
    <div className="FormRow">
        <label htmlFor={id} className="FormRowLabel">
            {label}
        </label>
        <input
            className="FormRowInput"
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
        />
    </div>
);
const MaskedField = ({
                   label,
                   id,
                   type,
                   placeholder,
                   required,
                   autoComplete,
                   value,
                   onChange,
               }) => (
    <div className="FormRow">
        <label htmlFor={id} className="FormRowLabel">
            {label}
        </label>
        <InputMask
            mask="(999) 999-9999" maskChar=" "
            placeholder={placeholder}
            type={type}
            required={required}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
        />
    </div>
);

const SubmitButton = ({processing, error, children, disabled}) => (
    <button
        className={`SubmitButton ${error ? 'SubmitButton--error' : ''}`}
        type="submit"
        disabled={processing || disabled}
    >
        {processing ? 'Processing...' : children}
    </button>
);


const ResetButton = ({onClick}) => (
    <button type="button" className="ResetButton" onClick={onClick}>
        <svg width="32px" height="32px" viewBox="0 0 32 32">
            <path
                fill="#FFF"
                d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"
            />
        </svg>
    </button>
);

const CheckoutForm = ({cart, amount = 0, preOrder= false, onFinish, userAgent = null}) => {
    const stripe = useStripe();
    const elements = useElements();
    const {user} = useUser();

    useEffect(() => {
        if (user) {
            setBillingDetails({...billingDetails, name: user.displayName, email: user.email});
        }
    }, [user]);

    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);

    const [billingDetails, setBillingDetails] = useState<PaymentMethodCreateParams.BillingDetails>({
        email: '',
        phone: '',
        name: '',
        address: {city: '', country: 'IT', state: '', postal_code: '', line1: ''}
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        if (checkoutError) {
            elements.getElement('card').focus();
            return;
        }

        if (cardComplete) {
            setProcessing(true);
        }

        try {
            const {data: clientSecret} = await axios.post('/api/stripe/payment_intent', {
                amount
            });

            const paymentMethodReq = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
                billing_details: billingDetails,
            });

            if (paymentMethodReq.error) {
                setCheckoutError(paymentMethodReq.error.message);
                setProcessing(false);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodReq.paymentMethod.id
            });

            if (error) {
                setCheckoutError(error.message);
                setProcessing(false);
                return;
            }
            // get invoice number...
            /*let invoiceNumber;
              try {
                const {data} = await axios.get('/api/inv-gen');
                invoiceNumber = data.inv;

            } catch (e) {
                console.error(e);

            }*/
            const date = new Date();
            const invoiceNumber = `${date.getMonth()}${date.getDate()}${Date.now().toString().slice(-5)}`;

            const payload: PaymentModel = {
                items: cart,
                invoiceNumber,
                userId: user? user.uid : null,
                user: {...billingDetails},
                preOrder: preOrder,
                paymentIntent,
                amount: amount,
                userAgent: {
                    deviceType: userAgent?.deviceType ?? '',
                    browser: userAgent?.browser ?? '',
                    os: userAgent?.os ?? '',
                    osVersion: userAgent?.osVersion ?? ''
                },
                date: Date.now()
            };

            setProcessing(false);

            if (paymentIntent.status === "succeeded") {
                // add payment to firestore
                await paymentCollection.doc(paymentIntent.id).set(payload);
                // set success state
                setCheckoutSuccess(true);
                setTimeout(() => {
                    onFinish();
                }, 2000);
            }
        } catch (err) {
            setCheckoutError(err.message);
        }
    };

    return checkoutSuccess ? (
        <div className="success-msg text-center text-lg pt-10 mb-16">
            <CheckCircleFilled className="text-green-400" style={{fontSize: 75, color: '#48bb78'}} />
            <h1 className="mt-4 text-green-400 text-xl font-bold">Thank you!</h1>
            <p className="mb-0">Your payment is being processed.</p>
            <p className="mb-0">Once your payment has been completed, you'll receive an email confirming your order!</p>
            <p>You'll be redirected to the shop shortly..</p>
        </div>
    ) : (
        <>
            {
                user ? null :
                    <div className="login-action text-center">
                        <div className="flex justify-center">
                            <Link href="/auth/login?src=checkout">
                                <button style={{width: '120px'}} className="btn-outlined mr-3">Login</button>
                            </Link>
                            <Link href="/auth/signup?src=checkout">
                                <button style={{width: '120px'}} className="btn-outlined">Create account</button>
                            </Link>
                        </div>
                        <p className="my-4">Or</p>
                    </div>
            }
            <form className="Form" onSubmit={handleSubmit}>
                <fieldset className="FormGroup">
                    <Field
                        label="Name"
                        id="name"
                        type="text"
                        placeholder="Your name"
                        required
                        autoComplete="name"
                        value={billingDetails.name}
                        onChange={(e) => {
                            setBillingDetails({...billingDetails, name: e.target.value});
                        }}
                    />
                    <Field
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="Your email"
                        required
                        autoComplete="email"
                        value={billingDetails.email}
                        onChange={(e) => {
                            setBillingDetails({...billingDetails, email: e.target.value});
                        }}
                    />
                    <MaskedField
                        label="Phone"
                        id="phone"
                        type="tel"
                        placeholder="(000) 000-0000"
                        required
                        autoComplete="tel"
                        value={billingDetails.phone}
                        onChange={(e) => {
                            setBillingDetails({...billingDetails, phone: e.target.value});
                        }}
                    />
                    <Field
                        label="Address"
                        id="address"
                        type="text"
                        placeholder="Address"
                        required
                        autoComplete="address"
                        value={billingDetails.address.line1}
                        onChange={(e) => {
                            setBillingDetails({...billingDetails, address: {...billingDetails.address, line1: e.target.value}});
                        }}
                    />
                    <Field
                        label="City"
                        id="city"
                        type="text"
                        placeholder="City"
                        required
                        autoComplete="city"
                        value={billingDetails.address.city}
                        onChange={(e) => {
                            setBillingDetails({...billingDetails, address: {...billingDetails.address, city: e.target.value}});
                        }}
                    />
                    <Field
                        label="Province"
                        id="state"
                        type="text"
                        placeholder="Province"
                        required
                        autoComplete="province"
                        value={billingDetails.address.state}
                        onChange={(e) => {
                            setBillingDetails({...billingDetails, address: {...billingDetails.address, state: e.target.value}});
                        }}
                    />
                </fieldset>
                <fieldset className="FormGroup">
                    <CardField
                        onChange={(e) => {
                            setCheckoutError(e.error);
                            setCardComplete(e.complete);
                        }}
                    />
                </fieldset>
                {checkoutError && <CheckoutError>{checkoutError}</CheckoutError>}
                <SubmitButton processing={processing} error={checkoutError} disabled={!stripe}>
                    Pay {formatCurrency(amount)}
                </SubmitButton>
            </form>
        </>
    )
};

const ELEMENTS_OPTIONS = {
    fonts: [
        {
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
        },
    ],
};

export default CheckoutForm;
