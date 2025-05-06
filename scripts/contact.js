function isEmail(email) {
    const fromTipEl = ZekiCore.getClass("formTip")[0];
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        fromTipEl.html = "Please fill in the correct email format!";
        
    } else {
        fromTipEl.html = "";
        return true;
    }
}