$(document).ready(() => {

  var timeout = 2000;
  var count = 0;
  $("#btnSave").click(() =>{
    var username = document.getElementById("inlineFormInputGroup").value;

    if (username !== null && username !== ''){

      localStorage.username = username;
      $('#loginLoader').fadeIn(500);
      $("#btnSave").attr("disabled",true);
      setTimeout(() => {
        
        window.location.href = "../AMS/views/viewAssets.html";

      }, timeout);
    }

    else{
      alert("Please enter your username")
    }

   })

})
