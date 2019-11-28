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
      confirmButtonColor: "#C12E2A",
      type: "error",
      allowOutsideClick: true,
      animation: false,
      customClass: {
        popup: "animated tada"
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

        console.log(data);

        var filter = data[0].filter;
        localStorage.role = data[0].role;


        if (filter != null && filter != '' && data[0].status != "0") {
          localStorage.filter = filter;
          localStorage.backupFilter = filter;
          setTimeout(function () {
            if (data[0].role == "ADMIN") {
              window.location.href = "../AMS/views/dashboard.html";
            }
            else {
              window.location.href = "../AMS/views/viewAssets.html";
            }
          }, timeout);
        } else {
          swal.fire({
            title: "Account Locked",
            text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE:#41200",
            type: "error",
            showCloseButton: true,
            confirmButtonColor: "#C12E2A",
            allowOutsideClick: true,

          });
          $('#loginLoader').slideToggle(500);
        }

      },
      error: function (err) {
        console.log(err);

        $("#btnSave").attr("disabled", false);

        swal.fire({
          title: "Unexpected Error #41404",
          text: "An error has occured, please contact admin (amsdev@ialch.co.za)",
          type: "error",
          showCloseButton: true,
          confirmButtonColor: "#C12E2A",
          allowOutsideClick: true,

        })

        $('#loginLoader').slideToggle(500);
      }
    });

  }

}