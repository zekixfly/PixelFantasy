function isEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        getClasses("formTip")[0].innerHTML = "Please fill in the correct email format!";
        
    } else {
        getClasses("formTip")[0].innerHTML = "";
        return true;
    }
}