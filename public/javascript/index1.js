
// const mysql=require('mysql');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Kuladeep@12",
//     database: "dbms"
//   });
  
//   con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });



function sendOTP(){
    const email = document.getElementById('email');
    const otpverify = document.getElementsByClassName('otpverify')[0];
    const btn=document.getElementById('enable');
    btn.disabled=true;
   // const cont=document.getElementById('invisible').textContent;

  //  console.log(cont);

    // Create a SMTP crendentials that I showed u in my previous video

    // Generating random number as OTP;

    let otp_val = Math.floor(Math.random()*10000);

    let emailbody = `
        
        <h2>Your OTP is </h2>${otp_val}
    `;
``

   console.log("hi",email.value);
   // if(cont===email.value){
    Email.send({
        SecureToken : "fbaf3a2b-21d0-45c9-b719-0d54f9292ab0",
        To : email.value,
        From : "kuladeepguptha@gmail.com",
        Subject : "This is the from tourist",
        Body : emailbody
    }).then(
        //if success it returns "OK";
      message => {
        if(message === "OK"){
            alert("OTP sent to your email "+email.value);

            // now making otp input visible
            otpverify.style.display = "block";
            const otp_inp = document.getElementById('otp_inp');
            const otp_btn = document.getElementById('otp-btn');

            otp_btn.addEventListener('click',()=>{
                // now check whether sent email is valid
                if(otp_inp.value == otp_val){
                    alert("Email address verified...");

                    btn.disabled=false;
                    con.query("alter table user set isverified=true where email=?",cont,(err,rows,fields)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(rows);
                        }
                    })
                   // redirect('/register');
                }
                else{
                    alert("Invalid OTP");
                }
            })
        }
      }
    );

}

//else{

   // alert("please enter the same email id as before");
//}


// function message(){
   
// }