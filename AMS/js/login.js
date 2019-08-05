$(document).ready(() => {

  var timeout = 1000;
  var count = 0;

  $("#btnSave").click(() => {
    $('#loginLoader').fadeIn(500);
    $("#btnSave").attr("disabled", true);
    $.ajax({
      url: "../../ams/ams_apis/slimTest/index.php/login",
      dataType: "JSON",
      method: "POST",
      success: (data) => {
        console.log(data[0].filter);
        filter = data[0].filter;
        if (filter !== null && filter !== '') {
          localStorage.filter = filter;
          setTimeout(() => {
            window.location.href = "../AMS/views/viewAssets.html";
          }, timeout);
        }

      },
      error: (err) => {
        console.log(err);
        $("#btnSave").attr("disabled", false);
        alert("Please contact system admin");
        $('#loginLoader').hide();
      }
    });

  })
})

//     // var username = document.getElementById("inlineFormInputGroup").value;
//     var filter = "";

//     // if (username !== null && username !== '') {

//     //   localStorage.username = username;
//     //   $('#loginLoader').fadeIn(500);
//     //   $("#btnSave").attr("disabled", true);


//         // dataType: "JSON",
//         // data: '{"username" :"' + username + '"}',

//           // filter = data[0].filter;
//           // localStorage.filter = filter;
//           // if (filter !== '' && filter !== null) {
//           //   setTimeout(() => {
//           //     window.location.href = "../AMS/views/viewAssets.html";
//           //   }, timeout);
//           // }




//     // else {
//     //   alert("Please enter your username")
//     // }

//   // })

// // })
