$("#btnSave").click(function(){
    var Username = document.getElementById("inlineFormInputGroup").value;

    if(Username){
      console.log(Username);
      localStorage.Username = Username;

      window.location = "../AMS/views/viewAssets.html";


    }
    else{
      alert("Please enter username");
      console.log("error");

    }

    });
  