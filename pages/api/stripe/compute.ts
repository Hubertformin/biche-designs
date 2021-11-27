import {NextApiRequest, NextApiResponse} from "next";
import {itemsCollection, paymentCollection, reportsCollection} from "../../../firebase/db-service";
import * as SendGrid from "@sendgrid/mail";
import {generateStockReportEmail} from "../../../utils/email-templates";
import {ItemModel} from "../../../models";
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

import firebase from "../../../firebase/clientApp";
const incrementVal = (val: number) => firebase.firestore.FieldValue.increment(val);



export default async (req: NextApiRequest, res: NextApiResponse) => {
    const response = req.body;
    // // console.log("gotten body");
    if (response.type === 'payment_intent.succeeded') {

        const paymentIntent = response.data.object;
        try {
            // console.log("gettting payment");
            const payment = await paymentCollection.doc(paymentIntent.id).get().then(snap => {
                return {id: snap.id, ...snap.data()}
            });

            if (payment.id && payment.amount) {
                // save report to db
                const date = new Date();
                const dayId = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                // add global report
                const globalReportRef = reportsCollection.doc('GLOBAL');
                // update global ref
                globalReportRef.update({numberOfOrders: incrementVal(1), amount: incrementVal(payment.amount)})
                    .catch(err => console.error(err));
                // try to update active report, else add it
                try {
                    await reportsCollection.doc(dayId).update({numberOfOrders: incrementVal(1), amount: incrementVal(payment.amount)})
                } catch (e) {
                    console.error(e);
                    await reportsCollection.doc(dayId).set({numberOfOrders: 1, amount: payment.amount});
                }
                // Decrement item quantities and flag low stock items..
                let lowItems: ItemModel[] = [];
                for (const _item of payment.items) {
                    try {
                        const newQty = Number(_item.quantity - _item.itemQuantity);
                        // if item's quantity is less than low stock.. email admin
                        if (newQty <= _item.lowStockLevel) {
                            lowItems.push(_item);
                            // set item's state to low stock
                            _item.stockStatus = "LOW_STOCK";
                        } else if (newQty < 1) {
                            lowItems.push(_item);
                            _item.stockStatus = "OUT_OF_STOCK";
                        }
                        // save item to db
                        await itemsCollection.doc(_item.id).update({quantity: newQty, stockStatus: _item.stockStatus});
                    } catch (e) {
                        console.error(e);
                        res.status(500).json({message: e.toString()});
                    }
                }
                if (lowItems.length > 0) {
                    // send email
                    SendGrid.send({
                        to: ['bichelenora@gmail.com', 'biche.web@gmail.com', 'bichedesigns@gmail.com'],
                        from: 'BICHE Store <info@bichedesigns.com>', // Use the email address or domain you verified above
                        subject: 'Your inventory is running low',
                        html: generateStockReportEmail(lowItems),
                    }).then(() => {
                        res.status(200).json({message: "Computation complete"});
                    }).catch(e => {
                        res.status(500).json({message: e.toString()});
                    }).finally(() => {
                        lowItems = [];
                    });
                } else {
                    res.status(200).json({message: "Computation complete"});
                }
            } else {
                res.status(500).json({message: 'This payment could not be found'});
            }
        } catch (e) {
            res.status(500).json({message: e.toString()});
        }
    }
};
