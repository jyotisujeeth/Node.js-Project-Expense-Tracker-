const myForm = document.querySelector('#my-form');
const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#Description');
const categoryInput=document.querySelector('category');
const expenseList = document.querySelector('#expense');

myForm.addEventListener('submit', onSubmit);
var desc=descriptionInput.value;

function onSubmit(e){
    e.preventDefault();
    var amount=amountInput.value
    var Description=descriptionInput.value

    var hdgdg=document.getElementById('category')
    var category=hdgdg.options[hdgdg.selectedIndex].text;




    let obj={
      amount,
      Description,
      category
    };
    const token  = localStorage.getItem('token')
    axios.post("http://localhost:3000/admin/add-expense",obj,  { headers: {"Authorization" : token} })
    .then((response)=>{
      console.log(response)
      showNewUserOnScreen(response.data.newExpenseDetail)  
    })
    .catch((err)=>{
      document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
      console.log(err);
    })
}

// function parseJwt (token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   return JSON.parse(jsonPayload);
// }

function showPremiumUserMessage(){
  document.getElementById('rzp-button1').style.visibility = "hidden"
  document.getElementById('message').innerHTML = "You are a premium user "
}

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};


window.addEventListener("DOMContentLoaded", () =>{
  const objUrlParams=new URLSearchParams(window.location.search);
  const page =objUrlParams.get("page") || 1;
  const token  = localStorage.getItem('token')
  console.log("token======>",token)
  const decodeToken = parseJwt(token)
  console.log(decodeToken)
  console.log(decodeToken.ispremiumuser)
  if(decodeToken.ispremiumuser){
    showPremiumUserMessage()
    showLeaderboard()
  }
  axios.get(`http://localhost:3000/admin/get-expenses?page=${page}`, { headers: {"Authorization" : token} })
  .then((response)=>{
    
    console.log(response);
    for(var i=0;i<response.data.allExpenses.length;i++){
      showNewUserOnScreen(response.data.allExpenses[i]);
    }
    console.log(response.data);
    showPagination(response.data);
  })
  .catch((err)=>{
    console.log(err);
  })
})



function showNewUserOnScreen(user){
  document.getElementById('amount').value='';
  document.getElementById('Description').value='';
  // document.getElementById('category').options[document.getElementById('category').selectedIndex].text=""; 

    const parentNode=document.getElementById('expense');
    const childHTML = `<li id=${user.id} class="list-group-item"> ${user.amount} - ${user.Description}-${user.category}
                                          <button onclick=deleteUser('${user.id}') class="btn btn-danger btn-sm"> Delete Expense </button>
                                      
                                       </li>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

  

function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
  pagination.innerHTML='';
  if(hasPreviousPage){
    
    const btn2=document.createElement('button')
    btn2.className="btn btn-info"
    btn2.style.margin="5px"
    btn2.innerHTML=previousPage
    btn2.addEventListener('click',()=> getProducts(previousPage))
    pagination.appendChild(btn2)
  }
  const btn1=document.createElement('button')
  btn1.className="btn btn-info"
  btn1.style.margin="5px"
  btn1.innerHTML=`<h3>${currentPage}</h3>`
  btn1.addEventListener('click',()=> getProducts(currentPage))
  pagination.appendChild(btn1)
  if(hasNextPage){
    
    const btn3=document.createElement('button')
    btn3.style.margin="5px"
    btn3.className="btn btn-info"
    btn3.innerHTML=nextPage
    btn3.addEventListener('click',()=> getProducts(nextPage))
    pagination.appendChild(btn3)
  }
}

function getProducts(page){
  const parentNode=document.getElementById('expense');
  parentNode.innerHTML='';
  const token  = localStorage.getItem('token')
  axios.get(`http://localhost:3000/admin/get-expenses?page=${page}`, { headers: {"Authorization" : token} })
  .then((response)=>{
    
    console.log(response);
    for(var i=0;i<response.data.allExpenses.length;i++){
      showNewUserOnScreen(response.data.allExpenses[i]);
    }
    showPagination(response.data);
  })
  .catch((err)=>{
    console.log(err);
  })
}




function editUserDetails(id,amount, Description, category){
    document.getElementById('amount').value = amount;
    document.getElementById('Description').value = Description;
    
    document.getElementById('category').options[document.getElementById('category').selectedIndex].text=category;
    console.log(document.getElementById('category').options[document.getElementById('category').selectedIndex].text)
    deleteUser(id);
}
  

function deleteUser(id){
  const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/admin/delete-expense/${id}`,  { headers: {"Authorization" : token} })
    .then((response)=>{  
      console.log(response);  
      removeUserFromScreen(id)
    })
    .catch((err)=>{
      console.log(err);
    })
}


function download(){
  const token = localStorage.getItem('token')
  axios.get('http://localhost:3000/admin/download', { headers: {"Authorization" : token} })
  .then((response) => {
      if(response){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileURL;
          a.download = 'myexpense.txt';
          a.click();
      } else {
          console.log("Something went wrong")
      }

  })
  .catch((err) => {
      console.log(err);
  });
}



function showLeaderboard(){
  const inputElement = document.createElement("input")
  // inputElement.setAttribute("id","leaderboard");
  inputElement.type = "button"
  inputElement.value = 'Show Leaderboard'
  inputElement.className="btn btn-info"
  // const inputEled = documen
  inputElement.onclick = async() => {
      const token = localStorage.getItem('token')
      const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
      console.log(userLeaderBoardArray)

      var leaderboardElem = document.getElementById('leaderboard')
      leaderboardElem.innerHTML += '<h2> Leader Board:</<h2>'
      userLeaderBoardArray.data.forEach((userDetails) => {
        console.log(userDetails);
          leaderboardElem.innerHTML += `<li class="list-group-item">Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses} </li>`
      })
      
  }
  document.getElementById("message").appendChild(inputElement);
  // document.getElementById("message").appendChild(inputEled);


}
  

function removeUserFromScreen(id){
  const parentNode = document.getElementById('expense');
  const childNodeToBeDeleted = document.getElementById(id);
  if(childNodeToBeDeleted){
    parentNode.removeChild(childNodeToBeDeleted);
  }  
}

document.getElementById('rzp-button1').onclick = async function (e) {
  const token = localStorage.getItem('token')
 
  const response  = await axios.get('http://localhost:3000/purchase/purchasepremium', { headers: {"Authorization" : token} });
  console.log(response);

   console.log("aaaaaaaaaaaaaaaaaaaaaaa", response.data);
   console.log(response.razorpay_payment_id);
   console.log(response.data.order);
   console.log(response.data.order.id);

  var options =
  {
   "key": response.data.key_id, // Enter the Key ID generated from the Dashboard

   "order_id": response.data.order.id,// For one time payment
   
   // This handler function will handle the success payment
   "handler": async function (response) {
      const res = await axios.post('http://localhost:3000/purchase/updateTransactionStatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"Authorization" : token} })
      
      console.log(res)
       alert('You are a Premium User Now')
       document.getElementById('rzp-button1').style.visibility = "hidden"
       document.getElementById('message').innerHTML = "You are a premium user "
       localStorage.setItem('token', res.data.token)
       showLeaderboard()
   },
};





const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
  console.log(response)
  alert('Something went wrong')
});
}