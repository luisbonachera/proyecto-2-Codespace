function signIn(){
    const token = localStorage.getItem("token");
    if (!token) {
        // location.href = "/login/";
    } else {
        decoded = jwt_decode(token);
        console.log(decoded._id);
        console.log(decoded.username);
        document.getElementById("logupLiNavbar").setAttribute("class","hidden");
        document.getElementById("loginLiNavbar").setAttribute("class", "hidden");

        document.getElementById("nombreLiNavbar").removeAttribute("hidden");
        document.getElementById("loginName").innerHTML = decoded.username;
        document.getElementById("myname").setAttribute("href", "/users/");

        document.getElementById("logoutLiNavbar").removeAttribute("hidden");
        document.getElementById("myList").setAttribute("href", "/series/" + decoded._id);
       
       
        
    }
}

function signup(){
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("no hay token");
    } else {
        localStorage.removeItem("token");
        // location
    }
}
function RecogerUSers(){
    signIn()
}

function RecogerSeries(){
    signIn()
}