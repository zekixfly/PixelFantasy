function isEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        getClasses("formTip")[0].innerHTML = "請填寫正確的郵件格式！";
        
    } else {
        getClasses("formTip")[0].innerHTML = "";
        return true;
    }
}