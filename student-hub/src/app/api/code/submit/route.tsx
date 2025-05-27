import { db } from "@/db";
import { Question } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";



type RequestBody = {
  code: string,
  question:Question
};
type Data = {
  status:boolean,
     testcase: string|null,
        expected: string|null,
        got: string|null,
        message: string,
}
export  async function POST(req: NextRequest, res: NextResponse) {
 
    const { code, question } : RequestBody = await req.json();
    console.log(code,question)

  if (!code || !question) {
    return NextResponse.json({ message: "Invalid request body" });
  }

  const testcases = await db.testCase.findMany({where:{
    questionId:question.id
  }})

  try {
    // Forward request to code-executor server
    const response = await fetch("http://localhost:3002/api/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, testcases }),
    });

    const data:Data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error });
  }
}
