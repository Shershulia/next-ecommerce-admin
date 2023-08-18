
import {mongooseConnect} from "@/lib/mongoose";
import {Category} from "@/models/Category";
import {getServerSession} from "next-auth";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);
    if (method==='POST'){
        const {name,parentCategory,properties} = req.body;
        const productDoc = await Category.create({name,
            parent:parentCategory || undefined,
            properties})
        res.json(productDoc)
    }
    if (method==='PUT'){
        const {_id,name,parentCategory,properties} = req.body;
        const productDoc = await Category.updateOne({_id},{name,parent:parentCategory || undefined,properties})
        res.json(productDoc)
    }
    if (method==='GET'){
        res.json(await Category.find().populate('parent'));
    }
    if (method === 'DELETE') {
        if (req.query?.id) {
            res.json(await Category.deleteOne({_id:req.query?.id}));
        }
    }

}
