function setValueBtn(id, value) {
    $('#' + id).text(value.toUpperCase());
}
function setValueInput(id, value) {
    $('#' + id).val(value);
}

function setValueInputBtn(id_1, id_2, value) {
    setValueBtn(id_1, value);
    setValueInput(id_2, value);
}


function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}


function resetBtn(resetId, resetTxt) {
    $(resetId).text(resetTxt);
}

function resetInput(resetId, resetTxt) {
    $(resetId).val(resetTxt);
}

function closeApp() {
    swal.fire({
        title: "Exit Application",
        text: "Are you sure you want to exit?",
        type: "question",
        showCloseButton: true,
        confirmButtonColor: "#C12E2A",
        allowOutsideClick: true,
        animation: false,
        customClass: {
            popup: 'animated tada'
        }

    }).then(function (result) {
        if (result.value) {
            closeMe();
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {

        }
    })
}

function closeMe() {
    // reset 
    localStorage.clear();
    open("../index.html", '_self')
    window.location.replace("../index.html");
    window.close();
}

function updateLetterToIcon(letter) {
    var results = "";
    switch (letter) {
        case "Y":
            results = "<p class='text-success'><strong>YES</strong></p>";
            break;
        case "N":
            results = "<p class='text-danger'><strong>NO</strong></p>";
            break;
        case "y":
            results = "<p class='text-success'><strong>YES</strong></p>";
            break;
        case "n":
            results = "<p class='text-danger'><strong>NO</strong></p>";
            break;
    }

    return results;
}


function toogleSub(filter) {
    if (filter == "IT EQUIPMENT") {
        $('.filter_sub').show();
    } else {
        $('.filter_sub').hide();
    }
}


function getDatee(a) {
    var date = new Date(a);

    var day = parseInt(date.getDate());
    var month = parseInt(date.getMonth()) + 1;
    var year = parseInt(date.getFullYear());

    if (year < 10) {
        year = "0" + year;
    }
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return (year + "/" + month + "/" + day);
}
