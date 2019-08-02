$(document).ready(() => {

  var timeout = 2000;
  var count = 0;
  $("#btnSave").click(() => {
    var username = document.getElementById("inlineFormInputGroup").value;
    var filter = "";

    if (username !== null && username !== '') {

      localStorage.username = username;
      $('#loginLoader').fadeIn(500);
      $("#btnSave").attr("disabled", true);

      $.ajax({
        url: "../../ams/ams_apis/slimTest/index.php/login",
        method: "POST",
        dataType: "JSON",
        data: '{"username" :"' + username + '"}',
        success: (data) => {
          filter = data[0].filter;
          localStorage.filter = filter;
          if (filter !== '' && filter !== null) {
            setTimeout(() => {
              window.location.href = "../AMS/views/viewAssets.html";
            }, timeout);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    else {
      alert("Please enter your username")
    }

  })

})
