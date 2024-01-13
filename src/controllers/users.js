import db from "../db.js"
import validators from "../helper/validators.js";
import utils from "../helper/utils.js";
import mail_utils from "../helper/mail_utils.js";

const validateInput = (obj, resolve) => {
    let isValid = true;
    if (obj.hasOwnProperty("email") === undefined || obj.hasOwnProperty("password") === undefined) {
        resolve({status: false, message: "All fields are required"});
        isValid = false;
    }
    if (obj.email === "" || obj.password === "") {
        resolve({status: false, message: "All fields are required"});
        isValid = false;
    }
    const emailValidation = validators.validateEmailAddress(obj.email.trim());
    if (!emailValidation.status) {
        emailValidation.message = "Invalid email address";
        resolve(emailValidation)
        isValid = false;
    }
    return isValid;
}
const save = (obj) => {
    let verificationCode = utils.generateRandomChars(6);
    let verificationExp = new Date(new Date().getTime() + 3600 * 1000).toISOString().replaceAll("T"," ").substring(0,16);
    let query = `INSERT INTO users SET email='${obj.email}',password='${obj.password}',is_verified=0,verification_code='${verificationCode}',verification_expiration='${verificationExp}',user_type='User',status='verify_account'`;
    let queryExist = `select * from users where email='${obj.email}' and user_type='User'`;

    return new Promise((resolve, reject) => {
        if (validateInput(obj, resolve)) {
            if (obj.password === undefined || obj.password === "") resolve({
                status: false,
                message: "Password should not be empty"
            })
            db.query(queryExist, async (err, res) => {
                if (res.length > 0)
                    resolve({status: false, message: "User already exist"});
                else {
                    db.query(query, async (err, res) => {
                        if (err) reject(err);
                        mail_utils.sendEmail("Verify your account",`Find code to verify your account ${verificationCode}`,obj.email);
                        db.query(`INSERT INTO logs SET email='${obj.email}',action='Create account',message='User account created with ${obj.email}',status=true`, (err, res) => {
                        });
                        resolve({
                            status: true,
                            message: "User account created successfully",
                            action: "verify_account",
                        });
                    })
                }
            })

        }
    })
}
const addManager = (obj) => {
    let generatedPassword = utils.generateRandomChars(12);
    let verificationCode = utils.generateRandomChars(6);
    let verificationExp = new Date(new Date().getTime() + 3600 * 1000).toISOString().replaceAll("T"," ").substring(0,16);
    let query = `INSERT INTO users SET email='${obj.email}',password='${generatedPassword}',is_verified=0,verification_code='${verificationCode}',verification_expiration='${verificationExp}',user_type='Manager',status='verify_account'`;
    let queryExist = `select * from users where email='${obj.email}' and user_type='User'`;

    return new Promise((resolve, reject) => {
        if (validateInput(obj, resolve)) {
            db.query(queryExist, async (err, res) => {
                if (res.length > 0)
                    resolve({status: false, message: "User already exist"});
                else {
                    db.query(query, async (err, res) => {
                        if (err) reject(err);
                        mail_utils.sendEmail("Manager Account created",`Go to http://localhost:3000 to log into your account your password is  ${generatedPassword}`,obj.email);
                        mail_utils.sendEmail("Verify your account",`Find code to verify your account ${verificationCode}`,obj.email);
                        db.query(`INSERT INTO logs SET email='${obj.email}',action='Create Manager account',message='User account created with ${obj.email} created',status=true`, (err, res) => {
                        });
                        resolve({
                            status: true,
                            message: "Manager account created successfully",
                            action: "verify_account",
                        });
                    })
                }
            })

        }
    })
}
const verifyAccount = (obj) => {
    let query = `UPDATE users SET status='active',is_verified=1 where email='${obj.email}'`;
    let queryExist = `select * from users where email='${obj.email}' and is_verified=0 and verification_code='${obj.code}'`;
    return new Promise((resolve, reject) => {
        db.query(queryExist, async (err, res) => {
            let otpUrl, qrImage = "";
            if (res.length > 0) {
                db.query(query);
                    db.query(`INSERT INTO logs SET email='${obj.email}',action='Account verification succeed',message='Account verified with ${obj.email}',status=true`, (err, res) => {
                    });
                    resolve({
                        status: true,
                        message: "User account verified successfully",
                        action: "done",
                        data:res[0]
                    });
            } else {
                db.query(`INSERT INTO logs SET email='${obj.email}',action='Account verification failed',message='Failed to verify account with ${obj.email}',status=false`, (err, res) => {
                });

                resolve({
                    status: false,
                    message: "Failed to verify account",
                    action: "done",
                });
            }
        })
    })
}
const resendCode = (obj) => {
    let verificationCode = utils.generateRandomChars(6);
    let query = `UPDATE users SET verification_code='${verificationCode}',is_verified=0 where email='${obj.email}'`;
    let queryExist = `select * from users where email='${obj.email}' and is_verified=0`;

    return new Promise((resolve, reject) => {
        db.query(queryExist, async (err, res) => {
            let otpUrl, qrImage = "";
            if (res.length > 0) {
                db.query(query);
                mail_utils.sendEmail("Verify your account",`Find code to verify your account ${verificationCode}`,obj.email);

                resolve({
                    status: true,
                    message: "Account verification code sent successfully",
                    action: "verify_account",
                });
            } else {
                db.query(`INSERT INTO logs SET email='${obj.email}',action='Account verification failed',message='Failed to verify account with ${obj.email}',status=false`, (err, res) => {
                });

                resolve({
                    status: false,
                    message: "User does not exist",
                    action: "verify_account",
                });
            }
        })
    })
}

const load = (id = 0) => {
    let query = "select * from users";
    let queryId = `select * from users where id=${id}`;
    return new Promise((resolve, reject) => {
        if (id === 0) {
            db.query(query, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        } else {
            db.query(queryId, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        }
    })
}
const loadLockedUsers = () => {
    let query = `select * from users where status="Locked"`;
    return new Promise((resolve, reject) => {
            db.query(query, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
    })
}
const login = (obj) => {
    let query = `SELECT id,email,user_type,is_verified,status,created_at FROM users WHERE email='${obj.email}' AND password='${obj.password}' limit 1`;
    return new Promise((resolve, reject) => {
        db.query(query, async (err, res) => {
            if (err) reject(err);
            if (res.length === 0) {
                db.query(`INSERT INTO logs SET email='${obj.email}',action='Login',action='Login attempt with ${obj.email} and failed',status=false`, (err, res) => {
                });
                resolve({status: false, message: "Wrong username or password"})
            } else {
                let userInfo = res[0];
                db.query(`INSERT INTO logs SET email='${obj.email}',action='Login',message='Login attempt with ${obj.email} and otp ${res[0].is_otp_enabled?"enabled":"not enabled"} password matches',status=false`, (err, res) => {
                });
                console.log(userInfo);
                if (!userInfo.is_verified)
                    resolve({status: true, action: "verify_account", message: "Verify account,check your email"});
                else if (userInfo.status==="Locked")
                    resolve({status: false, action: "account_locked", message: "Account has been locked,please contact the administrator"});
                else {
                        resolve({
                            status: true, action: "done", message: "Logged in successful",
                            data:userInfo
                        });
                }
            }
        })
    })
}
const changeUserStatus = (obj) => {
    let query = `UPDATE users SET status='${obj.status}',locked_at=CURRENT_TIMESTAMP WHERE email='${obj.email}'`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if (err) reject(err);
            db.query(`INSERT INTO logs SET email='${obj.email}',action='Account ${obj.status}',message='Account ${obj.status} email ${obj.email}',status=true`, (err, res) => {
            });
            resolve({status: true, message: "OTP Enabled successful"})
        })
    })
}
const verifyCode = (obj) => {
    let query = `SELECT * FROM users WHERE is_verified=0 AND verification_code='${obj.code}' AND status='verify_account' WHERE email='${obj.email}'`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if (err) reject(err);
            if (res.length == 0) {
                resolve({status: false, message: "Verification failed,click resend if it expired"})
            }
            db.query(`INSERT INTO logs SET email='${obj.email}',action='Account ${obj.status}',message='Account ${obj.status} email ${obj.email}',status=true`, (err, res) => {
            });
            resolve({status: true, message: "OTP Enabled successful"})
        })
    })
}
export default {
    save,
    load,
    login,
    verifyAccount,
    changeUserStatus,
    loadLockedUsers,
    addManager,
    resendCode
}