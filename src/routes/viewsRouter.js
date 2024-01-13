import express from "express";
import path from "path";
// import users from "../controllers/users";
const viewRouter = express.Router();
import {fileURLToPath} from 'url';

const _filename = fileURLToPath(import .meta.url);
const _dirname = path.dirname(path.dirname(_filename));


let views_path = _dirname+"/views";
const readCookieRenderSidebar = (req)=>{
    console.log(req.header("Cookie"));
    const cookieArr = req.header("Cookie").split(";");
    let cookieValue = "",sidebar="";
    for(let i=0;i<cookieArr.length;i++){
        let cookieSplit = cookieArr[i].split("=");
        console.log(cookieSplit);
        if(cookieSplit[0].trim()==="user_type"){
            cookieValue = cookieSplit[1];
            break;
        }
    }
    console.log("Cookie value::"+cookieValue);
    switch (cookieValue.toLowerCase()){
        case "admin":
            sidebar = "includes/admin-sidebar.html";break;
        case "planner":
            sidebar = "includes/planner-sidebar.html";break;
        default:
            sidebar = "includes/supplier-sidebar.html";break;
    }
    return sidebar;
}
viewRouter.get("/v/",async (req,res)=>{
    res.redirect(`/v/login`);
})

viewRouter.get("/v/login",async (req,res)=>{
    res.render(`${views_path}/login.html`);
})
viewRouter.get("/v/register",async (req,res)=>{
    res.render(`${views_path}/register.html`);
})

viewRouter.get("/v/forget",async (req,res)=>{
    res.render(`${views_path}/forget-password.html`);
})

viewRouter.get("/v/otp",async (req,res)=>{
    res.render(`${views_path}/otp.html`);
})
viewRouter.get("/v/acverify",async (req,res)=>{
    res.render(`${views_path}/verify_account.html`);
})
viewRouter.get("/v/logs",async (req,res)=>{
    res.render(`${views_path}/logs.html`);
})

viewRouter.get("/v/signup",async (req,res)=>{
    res.render(`${views_path}/signup.html`);
})
viewRouter.get("/v/users",async (req,res)=>{
    res.render(`${views_path}/in-users.html`,{layout:readCookieRenderSidebar(req)});
})
viewRouter.get("/v/user/:id",async (req,res)=>{
    res.render(`${views_path}/update-user.html`,{layout:readCookieRenderSidebar(req)});
})
viewRouter.get("/v/qr",async (req,res)=>{
    res.render(`${views_path}/qr-code.html`);
})
viewRouter.get("/v/locked",async (req,res)=>{
    res.render(`${views_path}/locked-users.html`);
})
viewRouter.get("/v/addmanager",async (req,res)=>{
    res.render(`${views_path}/add-manager.html`);
})
viewRouter.get("/v/profile",async (req,res)=>{
    res.render(`${views_path}/profile.html`);
})
export default viewRouter;