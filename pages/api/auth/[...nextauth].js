import NextAuth, {getServerSession} from 'next-auth'

import GoogleProvider from 'next-auth/providers/google'
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import {Admin} from "@/models/Admin";
import {signOut} from "next-auth/react";

async function isAdminEmail(email){
    return !! (await Admin.findOne({email:email}));
}
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    adapter: MongoDBAdapter(clientPromise), //reuse an active connection to the database
    callbacks:{                             //only admins
        session: async ({session,token,user})=>{ //runs every time session is checked

            if ( await isAdminEmail(session?.user?.email)){
                return session;
            }else {
                return false;
            }

        }
    },

}
const authHandler = NextAuth(authOptions);
export default async function handler(...params) {
    await authHandler(...params);
}
export const isAdminRequest = async (req,res) =>{ //check if admin
    const session = await getServerSession(req,res,authOptions);
    if (!(await isAdminEmail(session?.user?.email))){

        res.status(401);
        res.end();
        throw 'not an admin';
    }
}