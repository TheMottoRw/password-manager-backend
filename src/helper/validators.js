function validatePassword(pwd) {
    var res = { "status": false, "message": `Password must be 8 characters containing lowercase,uppercase letter,numbers and at least one special characters` };
    var pattern =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

    if (pattern.test(pwd)) {
        res.status = true;
        res.message = "valid";
    }
    console.log("Is password valid");
    console.log(res);
    return res;
}
function validateEmailAddress(email) {
    var res = { "status": false, "message": `Invalid email address` };
    var pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

    if (pattern.test(email)) {
        res.status = true;
        res.message = "valid";
    }
    return res;
}
function validateRwandanPhoneNumber(number) {
    var res = { "status": false, "message": `Invalid rwandan phone number` };
    var pattern = /^(\+25|25)?07[2,3,8,9][0-9]{7}$/

    if (pattern.test(number)) {
        res.status = true;
        res.message = "valid";
    }
    return res;
}

export default {
    validatePassword,
    validateEmailAddress,
    validateRwandanPhoneNumber
}