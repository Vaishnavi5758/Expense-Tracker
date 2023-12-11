
const token = localStorage.getItem('token');
console.log(token);



function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
  

function submitForm(event) {

   
    event.preventDefault(); // Prevent the default form submission

    // Get the values of the amount, description, and type fields
    var amount = document.getElementById("amount").value;
    var description = document.getElementById("description").value;
    var type;

    // Determine the selected type (expense or income)
    if (document.getElementById("expense").checked) {
        type = "Expense";
    } else if (document.getElementById("income").checked) {
        type = "Income";
    }

    const obj =  {
        amount: amount,
        description: description,
        type: type
    };

    // Make a POST request using Axios
    axios.post('http://localhost:3000/AddExpenseToDB',   obj, {headers:{"Authorization": token}})
    .then(function (response) {
        // Fetch and update totals immediately after posting data
        fetchTotals();
    })
    .catch(function (error) {
        // Handle errors
        console.error(error);
    });

   
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";


   // updateTabContents(currentTab);
}

// Function to fetch and update totals
function fetchTotals() {
    axios.get('http://localhost:3000/getTotals',{headers: {"Authorization": token}})
    .then(function (response) {
        // Update the UI with total expense and total income
        document.getElementById("totalExpense").textContent = response.data.totalExpense;
       
        document.getElementById("totalIncome").textContent = response.data.totalIncome;
    })
    .catch(function (error) {
        // Handle errors
        console.error(error);
    });
}

// Fetch and update totals when the page loads
fetchTotals();


function fetchUserInfo() {
    axios.get('http://localhost:3000/getUserInfo',{headers: {"Authorization": token}}) 
        .then(function (response) {
            console.log("response",response);
            displayUserInfo(response.data);
        })
        .catch(function (error) {
            console.error('Error fetching user info:', error);
        });
}

function displayUserInfo(userData) {

    const userName = userData.userName; 

    const nameElement = document.getElementById('userName');
    nameElement.textContent = userName;
}


window.onload = function () {
    console.log("userinfo");
    fetchUserInfo();
};


  


  document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    document.getElementById('premiumbutton').onclick = async function(e) {
      e.preventDefault();
    
    try{
    const response = await axios.get('http://localhost:3000/premiummembership', { headers: {"Authorization": token}})
    console.log("Response>>>>>>>>",response,response.data.orderid, response.data.key_id); //response will contain orderid

    var options = {
      "key": response.data.key_id, 
      "order_id": response.data.orderid, //for one time payment
      // a handler function to handle the success payment
      "handler": async function(response){
          try{
            await axios.post('http://localhost:3000/updatetransactionstatus',
            {order_id: options.order_id, payment_id: response.razorpay_payment_id,},
            {headers: {"Authorization": token} });

            alert('You are a premium user now');
           // localStorage.setItem('token', response.data.token); //payment token
            showPremiumUser();

            }catch(err){
              console.log(err);
            }
           
            //showLeaderboard();
        } 

      }

      const rzp1 = new Razorpay(options);
      rzp1.open(); 
      rzp1.on("payment.failed", function (response) {
        console.log(response)
        alert("Payment Failed!")
    });
  } catch (err) {
    console.error(err);
  }
  }
  });

  function showPremiumUser(){
    const premiumButton = document.getElementById('premiumbutton');
    premiumButton.style.display = 'none';
    const leaderboardBtn = document.getElementById('leaderboardbtn');
    leaderboardBtn.style.display = 'inline-block';
    document.getElementById('premiumuser').innerHTML = 'Premium Member';

  leaderboardBtn.onclick = async()=>{
    try{
    const leaderboardArray = await axios.get('http://localhost:3000/showLeaderboard', { headers: { "Authorization": token } })

      for(let i=0; i<leaderboardArray.data.length; i++){
        let obj = leaderboardArray.data[i];
        const table = document.getElementById("leaderboardtable")
        const row = document.createElement('tr');          
    
        const rankData = document.createElement('td');    
        rankData.textContent = `${i+1}`;
        row.appendChild(rankData);
    
        const totalData = document.createElement('td');    
        totalData.textContent = `${obj.total??0}`;
        row.appendChild(totalData);
    
        const nameData = document.createElement('td');    
        nameData.textContent = `${obj.name}`;
        row.appendChild(nameData);

        table.appendChild(row);
      }
     }catch(err){
    console.log('Error fetching Leaderboard', err);
    }

   }
  }


  // Assuming this code is in your client-side JavaScript file (script.js)

// document.addEventListener('DOMContentLoaded', () => {
//     const userList = document.getElementById('userList');
  
//     // Function to fetch and display leaderboard
//     const fetchLeaderboard = async () => {
//         document.getElementById('premiumuser').innerHTML = 'You are a Premium User';

//       try {
//         const response = await fetch('http://localhost:3000/showLeaderboard',{headers: {"Authorization": token}})  // Replace with your server URL
//         if (!response.ok) {
//           throw new Error('Network response was not ok.');
//         }
  
//         const leaderboardData = await response.json();
  
//         // Clear any existing content in the user list
//         userList.innerHTML = '';
  
//         // Create elements to display the leaderboard
//         leaderboardData.forEach(user => {
//           const userElement = document.createElement('div');
//           userElement.textContent = `Name: ${user.userName}, Total Expense: ${user.total}`;
//           userList.appendChild(userElement);
//         });
//       } catch (error) {
//         console.error('Error fetching leaderboard:', error);
//         // Handle error, show message to the user, etc.
//       }
//     };
  
    // Trigger the fetch function when the button is clicked (for example)
//     const leaderboardBtn = document.getElementById('leaderboardBtn');
//     leaderboardBtn.addEventListener('click', fetchLeaderboard);
//   });
