import express, { json } from 'express';
import userRouter from "./routes/usersRoutes.js";
import logsRouter from "./routes/logsRoutes.js";
import path from "path"
import viewRouter from "./routes/viewsRouter.js";
import nunjucks from "nunjucks";

import cookieSession from "cookie-session";
import {fileURLToPath} from 'url';
import utils from "./helper/utils.js";
import dotenv from "dotenv";
dotenv.config();
const _filename = fileURLToPath(import .meta.url);
const _dirname = path.dirname(_filename);
const app = express();
const views = _dirname+'/views';

nunjucks.configure(views,{
    autoescape:true,cache:false,express:app
})
app.engine("html",nunjucks.render);
app.set("view engine","html");
app.use(json())
app.use(userRouter)
app.use(logsRouter)
app.use(viewRouter)

//Cookies
app.use(cookieSession({
    name: 'session',
    keys: ["totp"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
const PORT = process.env.PORT || 3000;
app.use('/static', express.static(path.join(_dirname, 'public')))

app.get('/', async (req, res) => {
    res.redirect("/v/")
    // res.json({ status: true, message: "Our node.js app works" })
});
app.get('/token', async (req, res) => {
    // let token = genToken();
         res.json({ status: true, message: "Our Node app works",data:utils.generateOtpToken("RRG2KZTIY2PI0182","damn@yopmail.com") })
});
app.get('/qr', async (req, res) => {
    // let token = genToken();
    res.set("Content-Type", "image/jpeg");
    res.send(utils.generateQR("Asua Roger"))
});


app.listen(PORT, () => console.log(`App listening at port ${PORT}`));

