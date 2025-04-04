import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server"
import { json } from "stream/consumers";

export const POST = async (req:NextRequest)=>{
const {getUser} = await getKindeServerSession();
const {id,email} = await getUser()
const newUser = await db.user.create({
    data:{
        id,
        email:email!
    }
})

return NextResponse.json({user:newUser,success:true})

}