
/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */

$('#searchView').fadeIn(500);

function search(){
     var assetNo        = document.getElementById('asseetsno').value ,
         room           = document.getElementById('roomno').value ,
         location       = document.getElementById('location').value ,
         description    = document.getElementById('description').value ;

         var results = (assetNo +" - "+ room +" - "+  location +" - "+  description);

         if(" -  -  - " == results){
            alert("Please enter alteast one filter");
         }else{
            alert(results);
            $('#searchView').hide();
            $('#loader').fadeIn(500);
            setTimeout(function(){
                $('#loader').hide();
                $('#searchView').fadeIn(500);
            },5000);
         }
}

/*-------   Zoom handler -------*/
var width = screen.width;
var height = screen.height;
if( (width > 700) && (height < 700) || (width < 1400) && (height < 900)){
    toggleZoomScreen("80%");
}else{
    toggleZoomScreen("100%");
}
function toggleZoomScreen(value) {
    document.body.style.zoom= value;
} 
/*------   Zoom handler -----*/