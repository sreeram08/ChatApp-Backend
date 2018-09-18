const nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user: 'sreeram.pra@gmail.com',
        pass: '********'
    }
});

let mailOptions = {
    from: 'sreeram.pra@gmail.com',
    to: '',
    subject: 'Welcome',
    html:"<h1>Welcome to chat room</h1>"
};

let autoEmail = (reciever, message) =>{

    mailOptions.to = reciever;

    mailOptions.html = message;
    //console.log(mailOptions);

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        }else{
            console.log('Email Sent' + info.response);
        }
    });

}//end autoEmail

module.exports = {
    autoEmail: autoEmail
}