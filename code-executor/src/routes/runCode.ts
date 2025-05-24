import { Router, Request, Response } from "express";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const router = Router();
type TestCase = {
  input:string,
  output:string
}
router.post("/run-code", async (req: Request, res: Response): Promise<any> => {
  const { code, testcases }: { code: string; testcases: TestCase[] } = req.body;

  if (!code) {
    return res.status(400).send("Code is required");
  }

  if (!testcases || !Array.isArray(testcases) || testcases.length === 0) {
    return res.status(400).send("Testcases are required and should be an array");
  }

  for (const testcase of testcases) {
    const id = uuidv4();
    const tempDir = path.join(__dirname, "..", "..", "tmp", id);
    fs.mkdirSync(tempDir, { recursive: true });

    const javaFilePath = path.join(tempDir, "Main.java");
    const runScriptPath = path.join(tempDir, "run.sh");
    const inputFilePath = path.join(tempDir, "input.txt");

    fs.writeFileSync(javaFilePath, code);
    fs.copyFileSync(path.join(__dirname, "../../run.sh"), runScriptPath);
    fs.chmodSync(runScriptPath, "755");

    fs.writeFileSync(inputFilePath, testcase.input);

    const forwardSlashPath = tempDir.replace(/\\/g, "/");

    const dockerCmd = `
      docker run --rm \
      -v "${forwardSlashPath}:/app" \
      -w /app \
      --cpus=".5" --memory="256m" --network none \
      openjdk:17-slim bash run.sh
    `.trim();

    const output = await new Promise<string>((resolve) => {
      exec(dockerCmd, (error, stdout, stderr) => {
        if (error) {
          resolve(stderr || stdout || "Runtime or Compilation Error");
        } else {
          resolve(stdout || stderr || "No Output");
        }
      });
    });


    const expectedOutput = testcase.output.trim()

    const cleanedOutput = output.trim();

    if (cleanedOutput !== expectedOutput) {
      return res.status(200).json({
        status: false,
        testcase: testcase.input,
        expected: expectedOutput,
        got: cleanedOutput,
        message: "failed",
      });
    }
  }


  res.status(200).json({
    status: true,
    message: "All testcases passed",
  });
});


export default router;
