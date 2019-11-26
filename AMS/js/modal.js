function show(element,action){
    
    // var header = document.getElementById('modal-header').innerHTML = "";
    // var footer = document.getElementById('modal-footer').innerHTML = "";
    console.log(action);
    console.log(element);
    $(element).fadeIn();
    getData(action);

}

function hide(element){
    $(element).fadeOut();
}




               