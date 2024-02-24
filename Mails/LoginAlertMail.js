const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
    user:  "vr384695@gmail.com",
    pass:   "rhebfxcwhnvaquye"
    }
})
const LoginAlertMail = async (email) => {
    const info = await transporter.sendMail({
      from: '"Developer"s Zone" vr384695@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Login Alert !!", // Subject line
      text: "Someone tried to login in new device just a moment ago in Developer's Zone", // plain text body
      html: `<p>Is it you ? </p>
      `, // html body
    });
    if(info){
        return console.log("Login Alert Email is sent")
    }
  };

module.exports = LoginAlertMail;