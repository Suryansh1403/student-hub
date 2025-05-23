import express from "express";
import runCode from "./routes/runCode";
const app = express();
const PORT = 3002;

app.use(express.json());
console.log(runCode)
app.use("/api",  runCode);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
