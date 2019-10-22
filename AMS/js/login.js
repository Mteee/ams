var timeout = 1000;
var count = 0;
$('#loginLoader').fadeOut(500);

var url_string = window.location;
var arr = (url_string).toString().split("=");
var c = arr[arr.length - 1];
localStorage.username = c;
console.log(c);

function startApp() {
  
  if (c.indexOf("http") > -1) {
    swal.fire({
      title: "Unauthorized Access",
      text: "Please Restart Desktop Application to Access System",
      showCloseButton: true,
      confirmButtonColor:"#C12E2A",
      type: "error",
      allowOutsideClick: true,
      animation:false,
      customClass:{
        popup:"animated tada"
      }
    }).then(function (result) {
      if (result.value) {

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
  }
  else {
    $('#loginLoader').slideToggle(500);

    $.ajax({
      url: "../../ams/ams_apis/slimTest/index.php/login",
      dataType: "JSON",
      data: '{"username" :"' + c + '"}',
      method: "POST",
      success: function (data) {

        console.log(data[0].filter);
        var filter = data[0].filter;
        
        if (filter != null && filter != '') {
          localStorage.filter = filter;
          localStorage.dropdownFilter = "ALL EQUIPMENT";
          setTimeout(function () {

            window.location.href = "../AMS/views/linkAssets.html";
          }, timeout);
        }

      },
      error: function (err) {
        console.log(err);
        $("#btnSave").attr("disabled", false);
        alert("Please contact system admin");
        $('#loginLoader').hide();
      }
    });

  }

}