import {NextApiRequest, NextApiResponse} from "next";
import {generateGenericMailTemplate} from "../../utils/email-templates";
import * as SendGrid from "@sendgrid/mail";
import * as microCors from  'micro-cors';

const cors = microCors();
SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {to, subject, message} = req.body;

    const msg = {
        to,
        from: 'BICHE Designs <info@bichedesigns.com>', // Use the email address or domain you verified above
        subject,
        html: generateGenericMailTemplate(message)
    };
    try {
        await SendGrid.send(msg);
        res.status(200).json({statusCode: 500, message: 'Email was sent'});
    } catch (error) {
        console.log(error);
        if (error.response) {
            res.status(500).json({statusCode: 500, message: error.response.body});
        } else {
            res.status(500).json({statusCode: 500, message: error.toString()});
        }
    }
};

export default cors(handler);
