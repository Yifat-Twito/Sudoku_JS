// ----- Log-In function -----
function logIn() {
    let Username = document.getElementById("usrnm").value
    let Password = document.getElementById("psw").value

    if (Username == "abcd" && Password == "1234" ) {
        window.location.href = './index.html';
    }
    else {
        return  alert("Worng username or password! \nHint: Username = abcd, Password = 1234");
    }
    
}

function guest() {
    window.location.href = './index.html';
}


    
    
    

    