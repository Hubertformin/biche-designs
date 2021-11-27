import {NextApiRequest, NextApiResponse} from "next";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_LIVE_KEY, {
    apiVersion: '2020-08-27',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // get the product details
    const sale = JSON.parse(req.body);

    const chargeParams: Stripe.ChargeCreateParams = {
        amount: sale.totalAmount,
        currency: 'EUR',
        source: sale.cardToken.id,
        description: `Pay for total items on Biche`,
        metadata: {}
    };

    await stripe.charges.create(chargeParams)
        .then(charge => {
            console.log(charge);
            res.status(200).json(charge);
        })
        .catch(err => {
            res.status(500).json(err.toString());
        });

}
