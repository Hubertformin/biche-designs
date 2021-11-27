import Stripe from 'stripe';
import {NextApiRequest, NextApiResponse} from "next";

const stripe = new Stripe(process.env.STRIPE_LIVE_KEY, {
    apiVersion: '2020-08-27',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        try {
            const {amount} = req.body;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'EUR'
            });

            res.status(200).json(paymentIntent.client_secret);

        } catch (e) {
            res.status(500).json({statusCode: 500, message: e.message});
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(400).end("Method not allowed");
    }
}
