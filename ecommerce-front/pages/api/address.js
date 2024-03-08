import { getSession } from "next-auth/react";
import { mongooseConnect } from "@/lib/mongoose";
import { Address } from "@/models/Address";

export default async function handle(req, res) {
    await mongooseConnect();

    const session = await getSession({ req });

    if (req.url !== '/api/address' && !req.session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    const userEmail = session?.user.email;

    if (req.method === 'PUT') {
        const {userEmail, ...otherData} = req.body;
        const address = await Address.findOne({userEmail});
        if(address) {
            res.json(await Address.findByIdAndUpdate(address._id, otherData));
        } else {
            res.json(await Address.create({userEmail, ...otherData}));
        }
    }

    if (req.method === 'GET') {
        const address = await Address.findOne({ userEmail: userEmail });
        res.json(address);
    }
}
