console.log("hi");


const inputName = document.getElementById("userName");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const signinBtn = document.getElementById("signinBtn");
const nameField = document.getElementById("nameField");
const title = document.getElementById("title");
const err = document.getElementById("errMessage");


const forgotpasswordLink = document.getElementById("forgotPasswordId");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");


//add click functions on both buttons
signinBtn.onclick = function(){
    nameField.style.maxHeight = "0";
    //title.innerHTML = "Sign In";
    signupBtn.classList.add("disable");
    signinBtn.classList.remove("disable");

    err.style.display = "none";

    const email = inputEmail.value;
    const password = inputPassword.value;
    
    const obj = {email, password};

    if(!email || !password)return;

    try{
        axios.post('http://localhost:3000/login', obj)
            .then(res=>{
                console.log('Signin successful', res.data);
              
               if(res.status===200){
                 localStorage.setItem('token', res.data.token);
                 console.log(res.data);
                 window.location.href = "./expense.html"; 
               }
                })
            .catch(err=>{
                console.log("Error axios:", err.response);
                if(err.response && err.response.status === 400 && err.response.data === 'Email already registered'){
                       const modal = document.getElementById("modal");
                       const modalmsg = document.getElementById("modalmsg");
                       modal.style.display = "block";
                       modalmsg.textContent = `${email} is already registered with Catch`;
                       
                 }else {
                        console.error('Signin failed', err);
                 }
                
            })
        
        }
        catch(err){console.log("Error during signin", err)}
}
    





signupBtn.onclick = async function(){
    nameField.style.maxHeight = "65px";
    //title.innerHTML = "Sign Up";
    signupBtn.classList.remove("disable");
    signinBtn.classList.add("disable");

    err.style.display = "none";

    const userName = inputName.value;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const obj = {userName, email, password};

    if(!userName || !email || !password)return;
 
    console.log("obj",obj);

    try{
    axios.post('http://localhost:3000/signUp', obj)
        .then(res=>{
            console.log('Signup successful');
        })
        .catch(err=>{
            console.log("Error axios:", err.response);
            if(err.response && err.response.status === 400 && err.response.data === 'Email already registered'){
                   const modal = document.getElementById("modal");
                   const modalmsg = document.getElementById("modalmsg");
                   modal.style.display = "block";
                   modalmsg.textContent = `${email} is already registered with Catch`;
                   
             }else {
                    console.error('Signup failed', err);
             }
            
        })
    
    }catch(err){
        console.log("Error during signup", err);
    }
}





function closeModal(){
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    const form = document.getElementById("form");
    form.reset();
}






forgotpasswordLink.onclick = function(event){
event.preventDefault();
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
forgotPasswordModal.style.display = "block";

document.getElementById("closeModalBtn").addEventListener("click", function(){
    event.preventDefault();
    forgotPasswordModal.style.display ="none";
   
})

resetPasswordBtn.onclick = async function(event) {
    event.preventDefault();
    const email = document.getElementById("forgotPasswordEmail").value;
    const obj = {email: email}
    console.log(",,,,,,,,,,,,,,",email);
    try{
       await axios.post("http://localhost:3000/forgotPasswordMail",obj)
        console.log(",,,,,,,,,,,,,,,done");
      //  http://localhost:3000/signUp
    }catch(err){console.log(err)}
   
    alert(`Link sent to ${email} to create new password`);
    forgotPasswordModal.style.display ="none";
 }
}