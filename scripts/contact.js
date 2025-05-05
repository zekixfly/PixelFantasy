function isEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        ZekiCore.getClass("formTip")[0].html = "Please fill in the correct email format!";
        
    } else {
        ZekiCore.getClass("formTip")[0].html = "";
        return true;
    }
}