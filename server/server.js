import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
await connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Resume Builder Server is running");
});
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
