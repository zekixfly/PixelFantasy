function initContact() {
    emailjs.init('A1O32767lvzH8CNyq');
    const sendStatusEl = ZekiCore.getId('send-status');
    const contactFormEl = ZekiCore.getId('contact-form');
    sendStatusEl.addClass('d-none');
    contactFormEl.on('submit', function(event) {
        event.preventDefault();
        // generate a five digit number for the contact_number variable
        this.contact_number.value = Math.random() * 100000 | 0;
        // these IDs from the previous steps
        contactFormEl.addClass('d-none');
        sendStatusEl.delClass('d-none');
        emailjs.sendForm('service_zekixfly', 'template_zekixfly', this)
            .then(function() {
                resultPage("✅ Mail sent successfully!");
            }, function(error) {
                resultPage(`❌ Sorry, Mail delivery failed...<br />${error?.text}`);
            });
    });
    function resultPage(message){        
        sendStatusEl.getClass('msg')[0].html = message;
        sendStatusEl.getClass('sending')[0].addClass('d-none');
        sendStatusEl.getClass('return')[0].addClass('d-block');
        sendStatusEl.getClass('return')[0].on('click',()=>{
            sendStatusEl.getClass('sending')[0].delClass('d-none');
            sendStatusEl.getClass('return')[0].delClass('d-block');
            sendStatusEl.getClass('msg')[0].html = 'Sending mail...';
            sendStatusEl.addClass('d-none');
            contactFormEl.delClass('d-none');
        })
    }
}

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