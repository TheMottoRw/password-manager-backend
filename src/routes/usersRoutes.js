import express from "express";
import users from "../controllers/users.js";
const userRouter = express.Router();

userRouter.post("/user",async (req,res)=>{
    const response = await users.save(req.body);
    res.send(response);
})
userRouter.post("/user/manager",async (req,res)=>{
    console.log(req.body);
    const response = await users.addManager(req.body);
    console.log(response);
    res.send(response);
})
userRouter.post("/login",async (req,res)=>{
    const response = await users.login(req.body);
    console.log(response);
    res.send(response);
})
userRouter.get("/users",async (req,res)=>{
    const response = await users.load();
    res.send(response);
})
userRouter.get("/users/locked",async (req,res)=>{
    const response = await users.loadLockedUsers();
    res.send(response);
})
userRouter.get("/user/:id",async (req,res)=>{
    const response = await users.load(req.params.id);
    res.send(response);
})
userRouter.post("/account/verify",async (req,res)=>{
    const response = await users.verifyAccount(req.body);
    console.log(response);
    res.send(response);
})
userRouter.post("/account/resend",async (req,res)=>{
    const response = await users.resendCode(req.body);
    console.log(response);
    res.send(response);
})
userRouter.post("/account/change",async (req,res)=>{
    const response = await users.changeUserStatus(req.body);
    res.send(response);
})
userRouter.post("/otp/enable",async (req,res)=>{
    const response = await users.enableOtpAfterScanComplete(req.body);
    res.send(response);
})
export default userRouter;