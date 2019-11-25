//check for filter in local storage
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}

window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '') {
        // clearLocalStorageFilters();
        // populate_dropdown();
    }
}

if (localStorage.filter == "ALL EQUIPMENT") {

    $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
    $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').unbind().on('change', function () {
        var filter = $("#class-options option:selected").text();
        localStorage.filter = filter;
        toogleSub(filter);

        clearLocalStorageFilters();
        populate_dropdown();

        //clear btn text
        checkFilter("search_view_building");

        $('#currentAssetsTable').DataTable().clear().destroy();
        $("#searchView").show();
        $("#printAssets").hide();


    });

} else {
    toogleSub(localStorage.filter);
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}
