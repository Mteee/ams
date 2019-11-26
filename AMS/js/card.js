
defaultFilter();

getItemsCount();

function getItemsCount() {

    var jsonData = '{"building" :"' + localStorage.building + '","level" :"' + localStorage.level + '","area_name" :"' + localStorage.area_name + '","area" :"' + localStorage.area + '","room_no" :"' + localStorage.room_no + '","sub_location" :"' + localStorage.sub_location + '","assetNo" :"' + localStorage.assetno + '","dateStart" :"' + localStorage.dateStart + '","dateEnd" :"' + localStorage.dateEnd + '","asset_class" :"' + localStorage.filter + '","role" :"' + localStorage.role + '","user" :"' + localStorage.username + '"}';

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getCounts",
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            console.log(data);
            document.getElementById("activeAssetsCount").innerHTML = data.data[0].ACTIVE;
            document.getElementById("inactiveAssetsCount").innerHTML = data.data[0].INACTIVE;
            document.getElementById("pendingAssetsCount").innerHTML = data.data[0].PENDING;
            document.getElementById("movedAssetsCount").innerHTML = data.data[0].MOVED;
            document.getElementById("assetsWithNoCrtCount").innerHTML = data.data[0].assetsWithNoCert;
            document.getElementById("comCertCount").innerHTML = data.data[0].assetsWithCert;
            document.getElementById("decomCertCount").innerHTML = data.data[0].assetsWithCert;
            document.getElementById("usersCount").innerHTML = data.data[0].USERS;
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// setTimeout(function () {
//     $('.count').each(function () {
//         $(this).prop('Counter', 0).animate({
//             Counter: $(this).text()
//         }, {
//             duration: 4000,
//             easing: 'swing',
//             step: function (now) {
//                 $(this).text(Math.ceil(now).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
//             }
//         });
//     });
// }, 4000);

$('.card-wrapper').hover(function () {
    $($(this)[0].childNodes[1]).toggleClass('card-icon-hover');
});

function defaultFilter() {
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area_name = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.assetno = '';
    localStorage.dateStart = '2005/01/01';
    localStorage.dateEnd = '9999/12/31';
}
