function show(action,bg_color,header_text,count){
    if($("#"+count).text() == "0"){
        swal.fire({
            title: "No data",
            text: "no data available",
            type: "error",
            showCloseButton: true,
            confirmButtonColor: "#C12E2A",
            allowOutsideClick: true,

        })
    }
    else{
    $("#loader-overlay").css("display","block");
    var header = document.getElementById('modal-header').innerHTML = header_text;
    $("#modal-header,#exportBtn").removeClass();
    $("#modal-header,#exportBtn").addClass(bg_color);
    $("#modal-header").addClass("modals-header");
    $("#exportBtn").addClass("btn-lg");
    // var footer = document.getElementById('modal-footer').innerHTML = "";
    getData(action);
    }
}

function hide(element){
    $(element).fadeOut();
}




               