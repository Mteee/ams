    var timeout = 1000;
    var count = 0;
    $('#loginLoader').fadeOut(500);

    localStorage.clear();

    var url_string = window.location;
    var arr = (url_string).toString().split("=");
    var c = arr[arr.length - 1];
    localStorage.username = c;
    console.log(c);

    function startApp() {

      $('#loginLoader').slideToggle(500);

    $.ajax({
      url: "../../ams/ams_apis/slimTest/index.php/login",
      dataType: "JSON",
      data: '{"username" :"' + c + '"}',
      method: "POST",
      success: function (data) {

        console.log(data[0].filter);
        filter = data[0].filter;
        if (filter !== null && filter !== '') {
          localStorage.filter = filter;
          setTimeout(function () {

            window.location.href = "../AMS/views/viewAssets.html";
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

