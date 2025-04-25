import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();


export const ourFileRouter = {
  
  imageUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
      .middleware(async ({ req }) => {
        const { getUser } = getKindeServerSession()
        const user =await getUser()
      
        if (!user || !user.id) throw new Error('Unauthorized')
   return {user,userId:user.id}
    
    })
    .onUploadComplete(async ({ metadata, file }) => {
   
      await db.note.create({
        data:{
            key: file.key,
            authorId: metadata.userId,
            url: file.ufsUrl
        }
      })

      return { uploadedBy: metadata.userId };
    })
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
