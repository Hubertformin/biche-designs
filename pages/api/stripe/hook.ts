import {NextApiRequest, NextApiResponse} from "next";
import {paymentCollection} from "../../../firebase/db-service";
import * as SendGrid from "@sendgrid/mail";
import {
    generateAdminPurchaseAlert,
    generatePurchaseEmailTemplate,
    generateStockReportEmail
} from "../../../utils/email-templates";

SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const response = req.body;
    // // console.log("gotten body");
    if (response.type === 'payment_intent.succeeded') {
      // // console.log("Payment succeded");
        // get payment info
        const paymentIntent = response.data.object;
        try {
          // // console.log("gettting payment");
            const payment = await paymentCollection.doc(paymentIntent.id).get().then(snap => {
                return {id: snap.id, ...snap.data()}
            });

           if (payment.id) {
               // reduce item quantities and add report
               // axios.post('https://bichedesigns.com/api/stripe/compute', payment);
               // await compute({items: payment.items, amount: payment.amount});
               // save payment
               paymentCollection.doc(paymentIntent.id).update({paymentIntent});

             // console.log(payment.user.email);
             // send user email confirming their payment...
             if (payment.user?.email) {
               // console.log("email launch...");
               const msg = {
                 to: payment.user?.email,
                 from: 'BICHE Store <info@bichedesigns.com>', // Use the email address or domain you verified above
                 subject: payment.preOrder ? `You pre-ordered ${payment.items[0].name}` : 'Thank you for your purchase',
                 html: generatePurchaseEmailTemplate({payment, supportMail: 'info@bichedesigns.com', card: payment.paymentIntent?.charges?.data[0]?.payment_method_details?.card}),
               };
               try {
                 await SendGrid.send(msg);
               } catch (error) {
                 console.error(error);
                 if (error.response) {
                   console.error(error.response.body)
                 }
               }
             }
             // send email to Admin
               try {
                   await SendGrid.send({
                       to: ['bichelenora@gmail.com', 'biche.web@gmail.com', 'bichedesigns@gmail.com'],
                       from: 'BICHE Store <info@bichedesigns.com>', // Use the email address or domain you verified above
                       subject: `New order from ${payment.user.name}`,
                       html: generateAdminPurchaseAlert({payment}),
                   });
               } catch (error) {
                   console.error(error);
                   if (error.response) {
                       console.error(error.response.body)
                   }
               }
           } else  {
             // console.log("failed to use payment");
             res.status(500).json({message: "The specific payment was not found"});
             return;
           }
           // send positive response
          // console.log("Final report");
          res.status(200).json({message: "Weebhook complete"});

        } catch (e) {
          // response
          res.status(500).json({message: e.toString()});
        }
    } else {
      res.status(200).json({message: "The payment was not successful"});
    }
}
