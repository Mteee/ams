$(document).ready(function() {

  var timeout = 1000;
  var count = 0;

  var url_string =  window.location;
  var arr = (url_string).toString().split("=");
  var c = arr[arr.length-1];
  localStorage.username = c;
  console.log(c);

  // localStorage.username = c;
  // console.log(c);

    $('#loginLoader').fadeIn(500);
    $("#btnSave").attr("disabled", true);
    $.ajax({
      url: "../../ams/ams_apis/slimTest/index.php/login",
      dataType: "JSON",
      data: '{"username" :"'+c+'"}',
      method: "POST",
      success: function(data) {

        console.log(data[0].filter);
        filter = data[0].filter;
        if (filter !== null && filter !== '') {
          localStorage.filter = filter;
          setTimeout(function() {

            window.location.href = "../AMS/views/viewAssets.html";
          }, timeout);
        }

      },
      error: function(err) {
        console.log(err);
        $("#btnSave").attr("disabled", false);
        alert("Please contact system admin");
        $('#loginLoader').hide();
      }
    });

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
