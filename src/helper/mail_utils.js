import nodemailer from "nodemailer"

function sendEmail(subject,message,to){
    console.log("sending email")
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.MAIL_SENDER,
            pass: process.env.MAIL_PASSWORD
        }
    })
    const mailOptions = {
        from:"TPG App",
        replyTo:"hasua.mr@gmail.com",
        to: to,
        subject: subject,
        html: message
    }
    transporter.sendMail(mailOptions,function (err,info){
        if(err){
            console.log(err)
        }else{
            console.log(info.status)
            console.log("Email sent :"+info.response)
        }
    })
    console.log("email sender execution done")

}

export default {
    sendEmail
}