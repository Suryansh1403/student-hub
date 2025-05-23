import { Router, Request, Response } from "express";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const router = Router();

router.post("/run-code", async (req: Request, res: Response): Promise<any> => {
  const { code }: { code: string } = req.body;

  if (!code) {
    return res.status(400).send("Code is required");
  }

  const id = uuidv4();
  const tempDir = path.join(__dirname, "..", "..", "tmp", id); // Windows-compatible
  fs.mkdirSync(tempDir, { recursive: true });

  const javaFilePath = path.join(tempDir, "Main.java");
  const runScriptPath = path.join(tempDir, "run.sh");

  fs.writeFileSync(javaFilePath, code);

  fs.copyFileSync(path.join(__dirname, "../../run.sh"), runScriptPath);
  fs.chmodSync(runScriptPath, "755");

const forwardSlashPath = tempDir.replace(/\\/g, '/');
console.log(forwardSlashPath);

const dockerCmd = `
  docker run --rm \
  -v "${forwardSlashPath}:/app" \
  -w /app \
  --cpus=".5" --memory="256m" --network none \
  openjdk:17-slim bash run.sh
`.trim();

exec(dockerCmd, (error, stdout, stderr) => {
  const output = stdout || stderr || "No output";
  if (error) {
    return res.status(200).json({ output });
  }
  res.status(200).json({ output });
});
});

export default router;
