var menu_ids = [
    "ams_view",             //0
    "ams_move",             //1
    "ams_cert",             //2
    "drodown-menu",         //3,4,5
    "ams_add",              //4
    "ams_rem",              //5
    "ams_asset_link",       //6
    "ams_location",         //7
    "ams_users",            //8
    ""                      //9
];

customMenu(menu_ids);

function customMenu(menu_ids) {
    
    var roles = localStorage.role;
        
    if(roles != "ADMIN"){
        var roles_default = ("V|M|C|CAR|CA|CR|AL|L|U").split("|");
        var role_split = roles.split("|");

        role_split = roles_default.filter(function(val) {
            return role_split.indexOf(val) == -1;
           });

           console.log("role_split");
           console.log(role_split);
           console.log("role_split");
    
        for (var i = 0; i < menu_ids.length; i++) {
            for (var t = 0; t < role_split.length; t++) {
                var target_id = role_link(role_split[t], menu_ids);
                target_li = $("#menu-list").find("#" + target_id);
                $(target_li).remove();
            }
        }
    }

}

function role_link(value, menu_ids) {
    switch (value) {
        case "V":
            return menu_ids[0];
        case "M":
            return menu_ids[1];
        case "C":
            return menu_ids[2];
        case "CAR":
            return menu_ids[3];
        case "CA":
            return menu_ids[4];
        case "CR":
            return menu_ids[5];
        case "AL":
            return menu_ids[6];
        case "L":
            return menu_ids[7];
        case "U":
            return menu_ids[8];
        default:
            return menu_ids[9];

    }
}

function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}

// username
document.getElementById('username').innerHTML = (replaceAll('"', '', localStorage.username)).toUpperCase();
