import {NextApiRequest, NextApiResponse} from "next";
import {InvoiceNumber} from 'invoice-number';
import {realDatabase} from "../../firebase/db-service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const _inv = await realDatabase.ref('inv').get().then(payload => payload.val());
        const inv = InvoiceNumber.next(_inv);
        await realDatabase.ref('inv').set(inv);
        res.status(200).json({inv});
    } catch (e) {
        console.error(e);
        res.status(500).json({message: e.toString()})
    }
};
