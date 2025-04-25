import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
   const session = await getKindeServerSession()
  const isAuth = await session.isAuthenticated()
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { title, description, isPublic, key }:{title:string,key:string,description:string,isPublic:boolean} = body;

    const updatedNote = await db.note.update({
        where:{
            key:key
        },
        data:{
            title,
            description,
            isPublic,
        }
    })

 
return NextResponse.json({updatedNote})

}