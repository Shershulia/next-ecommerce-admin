import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";
import {Admin} from "@/models/Admin";

export default async function handle(req,res){
    await mongooseConnect();
    await isAdminRequest(req,res);
    if (req.method==="POST"){
        const {email} = req.body;
        if(await Admin.findOne({email})){
            res.state(400).json({message:'already exsists!'})
        }else {
            res.json(await Admin.create({email}));
        }
    }
    if (req.method==="GET"){
        res.json(await Admin.find());
    }
    if(req.method==="DELETE"){
        const {id}=req.query;
        await  Admin.findByIdAndDelete(id);
        res.json(true);
    }
}