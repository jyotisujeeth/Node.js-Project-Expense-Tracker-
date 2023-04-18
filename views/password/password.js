function password(e) {
    e.preventDefault();
    console.log(e.target.email);

    const passwordDetails = {
        email: e.target.email.value
    }
    console.log(passwordDetails)
    axios.post('http://localhost:3000/password/forgotpassword',passwordDetails).then(response => {
            console.log(response.data)
            alert("Reset link is sucessfully sent to the registered email")
    }).catch(err => {
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    })
}