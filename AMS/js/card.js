apis();
function apis(){
    getItemsCount("getUsers_dash","usersCount");
    getItemsCount("getPendingAssets_dash","pendingAssetsCount");
    // getItemsCount("getAllUsers_on_class","movedAssetsCount");
    // getItemsCount("getAllUsers_on_class","createdAssetsCount");
    // getItemsCount("getAllUsers_on_class","removedAssetsCount");
    // getItemsCount("getAllUsers_on_class","comCertCount");
    // getItemsCount("getAllUsers_on_class","decomCertCount");
}


function getItemsCount(a,b){
    var jsonData = '{"building" :"' + localStorage.building + '","level" :"' + localStorage.level + '","area_name" :"' + localStorage.area_name + '","area" :"' + localStorage.area + '","room_no" :"' + localStorage.room_no + '","assetNo" :"' + localStorage.assetno + '","dateRange" :"' + localStorage.dateRange + '","asset_class" :"' + localStorage.filter + '","role" :"' + localStorage.role + '","user" :"' + localStorage.username + '"}';
    
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/"+a,
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            document.getElementById(b).innerHTML = data.rows;  
            },
        error:function(error){
            console.log(error);     
        }
    });
}

setTimeout(function(){
    $('.count').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            }
        });
    });
},500);




$('.card-wrapper').hover(function(){
    $($(this)[0].childNodes[1]).toggleClass('card-icon-hover');
});