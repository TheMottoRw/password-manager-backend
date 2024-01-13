import express from "express";
import logs from "../controllers/logs.js";

const logsRouter = express.Router();
logsRouter.get("/logs",async (req,res)=>{
    const response = await logs.load();
    res.send(response);
})
export default logsRouter;