/*!
 * AME SYSADMIN Library Version 1
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (MB MAPHUMULO PROVISIONER)
 * Released under the AME license
 * Date: 2018-09-13
 */
/*---------------------------------------------------- Loging in Script ----------------------------------------------*/
var selectedCheckboxes = 0;
var rowCount = 0;
var countSap = 0;
var tt = 0,count = 0,res = "";

//kicks in when user press login button on index page
function login(){

    //check time
var d = new Date();
if(d.getHours() < 8 || d.getHours() > 17){
    $('#alert').show();             //display alert message
    $('#results').html("<strong>Please wait until 08:00 to login</strong>");    //populate results dive with the error text
    
    //hide message after 4secs
    setTimeout(function(){
        $('#alert').slideToggle();
    },4000);
}else{

//get input from fields
    username = $("#username").val(),
    password = $("#password").val();

    //check content on the fields
    if(username == ""){
        $("#errorUser").text("required");
    }else{
        $("#errorUser").text("");
    }

    if(password == ""){
        $("#errorPass").text("required");
    }else{
        $("#errorPass").text("");
    }

    //if theres is content check if valid
    if(username != "" && password != ""){
        $("#login_form").slideToggle(); //hide form
        $("#login_loader").fadeIn(500); // display loader

        //giving 2 seconds for loader
        setTimeout(function(){
            var obj = '{"u_username" : "'+username+'","u_password" : "'+password+'"}', //creating object
                wsUrl  =  "assets/includes/apis/loginUser.php"; //api for logging in url

            //making request using ajax
            $.ajax({
                method : 'POST', //method used
                url: wsUrl, //passing in url
                data : obj, // passing in created object
                success : function(data){

                    var txt = '['+data+']',
                        found = false,
                        obj = JSON.parse(txt); //converting feedback to javascript object (JSON)
  
                    //if both inputs matches set found true nd redirect user to dashboard 
                    if(username == obj[0].data[0].USERNAME && password == obj[0].data[0].PASSWORD){
                        found = true;
                    }

                    if(found){
                        window.location.href = "dashboard.html";
                    }else{
                        results = "Invalid Credentials. Please check and try again";
                        
                        //if any of the given credentials are invalid

                        $("#login_loader").fadeOut(200); //hidding loader
                        $("#login_form").slideToggle();  //show form
                        $("#username").val(username);    //put back the username
                        $('#alert').show();              //display alert message
                        $('#results').text(results);     //populate results dive with the error text
                        
                        //hide message after 2secs
                        setTimeout(function(){
                            $('#alert').slideToggle();
                        },2000);
                    } //close else
                },// close success function on ajax
                error : function(err){
                    console.log("Error " + JSON.stringify(err));

                    results = "Sorry we're experiencing technical problems."+
                               "Please try again later.";
                        
                        $("#login_loader").fadeOut(200);    //hidding loader
                        $("#login_form").slideToggle();     //show form
                        $("#username").val(username);       //put back the username
                        $('#alert-net').show();             //display alert message
                        $('#results-net').text(results);    //populate results dive with the error text
                        
                        //hide message after 4secs
                        setTimeout(function(){
                            $('#alert-net').slideToggle();
                        },4000);
                } //close error function on ajax
            });// close ajax request
        },2000);// close setTimeout function
    }// close if statement
}
}//close login function

/*---------------------------------------------------- End Loging in Script ----------------------------------------------*/

/*---------------------------------------------------- File Manager Scripts ----------------------------------------------*/

function datepickerLoad(){

//listens to date change
$('#pickyDate').datepicker({
    todayHighlight: true,
    format: 'yyyy-mm-dd'
}).datepicker("setDate", new Date()).on('changeDate', getFiles);

function getFiles(){
    var fullDate = $('#pickyDate').datepicker('getFormattedDate'),
        year2 = fullDate.substring(2,4),                    //get the years last two digits (format # 18 #)
        year = fullDate.substring(0,4)                      //get the full year (format # 2018 #)
        month = fullDate.substring(5,7),                    //get the month (format # 07 #)
        day = fullDate.substring(8,11),                     //get the day (format # 01 #)
        newDate2 = day+"-"+checkMonth(month)+"-"+year2,     //create date format (01-07-2018)
        newDate = year+''+month+''+day;                     //create date format (20180701)
        console.log(fullDate);
        localStorage.wordsDate = newDate2;                  //storing date to localStorage
        localStorage.number = newDate;                      // ||      ||   ||    ||
        $(this).datepicker('hide');
        var today = getDate();      //current date

        if(newDate == ""){                                  //check date received
            $('#dateSet').text("No date Selected");
        }else{
            $('#dateSet').text(localStorage.wordsDate);
        }
    
        if(today.numbers == newDate){
            $('#dateSet').text("Today");
        }

        $('#tbody').text('');                               //eraise table content
        $('#tbody').hide();                                 //populate table content
        $('#loadFiles').hide();
        $('#table').hide();
        $('#login_loader').show(); 
        console.log("Test");
        console.log(localStorage.wordsDate);
        var date = localStorage.wordsDate.replaceAll('-',' ');
        console.log(date);
        var date = decrementDate(date,1);
        date = parseDate(date); 
        date = date.numbers;     
        getBackdatedPayments(date);
};//cloase dateChange function.
}
//loads current date content when dashboard starts
function load(){
console.log("Kicks in");
    $('#loadSap').hide();                                                   // Hide next button to SAP tab

    var date = 0,displayDate = "";

        date = localStorage.number;                                         //getting values on a localStorage
        displayDate = localStorage.wordsDate;                               //|| ||     ||   |    |    |    |

    //check if 1st run nd generate date
    if(date == "" || date == null){                         
        var today = getDate();                                              //generate new date
        date = today.numbers;
        displayDate = today.date;
        $('#dateSet').text("Today");
        console.log("1");
    }else{
        $('#dateSet').text(localStorage.wordsDate);
        var displayDate = makeDAte(date);
        console.log("2");
    }//close if statement
    
    date = decrementDate(displayDate,1);                                    //decrementing date since main date of the file equals the previous day of the actual date
    date = parseDate(date);                                                 //convert date to valid format (20180701 AND 01 JUL 2018)

    date = date.numbers;                                                    //get date in numeric format (20180701)

    $('#login_loader').show();                                              // display loader
                                                                           
    var rows = 0;

    if(rows < 1){
        console.log("3");
        $('#login_loader3').hide();
        $('#backdatedPay').hide();
        $('#loadFiles').fadeIn(500);
        $('#tbody').fadeIn(500);
        $('#table').fadeIn(500);
        
        var obj = '{"date" : "'+date+'"}',                                  //creating object
        tbody = '',                                                         //declaring for table body content
        wsUrl  =  "assets/includes/apis/readLetters.php";                   //path for getting current files or letters

    //giving loader sometime to load (1 sec)
    setTimeout(function(){
       //$('#login_loader').fadeOut(300);                                   // terminating loader
       console.log("4");
        $.ajax({
            method : 'POST',                                                // method used
            data : obj,                                                     // passing data
            url: wsUrl,                                                     // passing url
            success : function(data){
                
                $('#login_loader').hide();
                var txt = '['+data+']',                                     // accepts feedback
                    found = false,      
                    obj = JSON.parse(txt),                                  // converting recieved data to JSON
                    count = 0,                                              // Start count for loop
                    lengthh = Object.keys(obj[0].data).length;              //get lenght of recieved objects
                    console.log("5");
                    //if there are records found

                    var jsonFiles = "";

                    if(obj[0].rows > 0){
                        tbody = "";
                        console.log("6");
                        if(lengthh < 4){
                            console.log("7");
                            localStorage.jsonFilesTemp = "";
                            localStorage.FileDateTemp = "";
                            var results = findMissingFile(obj,lengthh);
                            $('#loadSap').hide();
                            tbody = '<tr><td colspan="8"><center><h4>File(s) missing (<strong>'+results+'</strong>).</h4></center></td><td><button class="btn btn_btn btn_warning" onclick="">Report</button></td></tr>';
                        }else{
                            console.log("8");
                            $('#loadSap').show();
                             //loop through the objects
                             var fileTypes = ['misc cash','BAR','HBMISCCASH','HBBAR'];
                             var files = ['mc','bar','hbmc','hbbar'];
                             var values = [];
                             localStorage.FileDateTemp = displayDate;
                            for(i = 0;i<lengthh;i++){

                                switch(obj[0].data[i].MAIN_FILETYPE){
                                    case fileTypes[0]:
                                        values[0] = (obj[0].data[i].MAIN_ID);
                                        break;
                                    case fileTypes[1]:
                                        values[1] = (obj[0].data[i].MAIN_ID);
                                        break;
                                    case fileTypes[2]:
                                        values[2] = (obj[0].data[i].MAIN_ID);
                                        break;
                                    case fileTypes[3]:
                                        values[3] = (obj[0].data[i].MAIN_ID);
                                        break;
                                }
                                
                                console.log(obj[0].data[i]);
                                var sapcount = countSapLoaded(obj[0].data[i].CASH_SAPLOAD_IND);
                                var ans1 = updateLetterToIcon(obj[0].data[i].MIRTH_LOADED_IND),
                                ans2 = updateLetterToIcon(obj[0].data[i].MIRTH_LOADED_IND),
                                ans3 = updateLetterToIcon(obj[0].data[i].CASH_SAPLOAD_IND);
                                // getBarFiles(obj[0].data[i].MAIN_FILETYPE,obj[0].data[i].main_id);
                                tbody += '<td scope="row"><strong>'+ (count+1) +'</strong></td><td>'+displayDate+'</td><td>'+obj[0].data[i].MAIN_DATE+'</td><td>'+obj[0].data[i].MAIN_FILETYPE+'</td><td class="text-center">'+obj[0].data[i].MAIN_FILENO+'</td><td class="text-center">'+ans1+'</td><td class="text-center">'+ans2+'</td><td class="text-center">'+ans3+'</td><td><a class="btn btn_btn" href="view.html?key=bfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*fbfdbfbdfbdbzUYFKfu8gf8(87of^6f8oO*DO&^rF^Of7686F&^*f&code='+obj[0].data[i].MAIN_FILETYPE+'&mirth='+obj[0].data[i].MIRTH_LOADED_IND+'&date='+obj[0].data[i].MAIN_DATE+'&file='+obj[0].data[i].MIRTH_LOADED_IND+'&main_id='+obj[0].data[i].MAIN_ID+'&sap='+obj[0].data[i].CASH_SAPLOAD_IND+'">View</a></td></tr>';
                                found = true;
                                count++; // incrementing count
                            }

                            if(sapcount == 4){countSap = 0;}

                            for(j=0;j<4;j++)
                               jsonFiles += '"'+files[j]+ '":"'+values[j]+'",';
    
                             localStorage.jsonFilesTemp = ("{"+jsonFiles.substr(0,jsonFiles.length-1)+"}");
                        }

                    }else{
                        console.log("9");
                        $('#loadSap').hide();
                        localStorage.jsonFilesTemp = "";
                        localStorage.FileDateTemp = "";
                        tbody = '<tr><td colspan="8"><center><h4>No Files for this date (<strong>'+displayDate+'</strong>).</h4></center></td></tr>';
                    }
                
                document.getElementById("tbody").innerHTML = tbody;

                //$('#tbody').fadeIn(500); // show it slowly
            },//close success function
            error:function(){
                obj = {status : 0};
            } // close error function
        });// close ajax function
     },1000);//close setTimeou function
    }else{

    }
    
}//close load function.

//a -> obj b->length #returns missing file names#
function findMissingFile(a,b){

    var fileTypes = ['misc cash','BAR','HBMISCCASH','HBBAR'],
        arr = [],
        notInObj = "";
    
    for(i = 0;i<b;i++){
        arr.push(a[0].data[i].MAIN_FILETYPE);
    }

    for(i=0;i<fileTypes.length;i++){
        if(!arr.includes(fileTypes[i])){
            notInObj += fileTypes[i] + ",";
        }
    }
    notInObj = notInObj.substring(0,notInObj.length-1);
    return notInObj;
}//close findMissingFile

//gets session for logged in user and also check if user did login
function checkLoginUser(){
    $.ajax({
        url: "assets/includes/apis/getUserSessions.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt),
                id = (obj[0].data[0].USER_ID),
                first_name = (obj[0].data[0].FIRST_NAME); // getting firstname from object
                
                localStorage.id = id;
                if(obj[0].rows > 0){
                    $('body').fadeIn(500);
                    $('#username').text(first_name);
                }else{
                    window.location.href = "index.html";
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close checkloginUser Function

//show balance
function showBalance(){
    $('#viewBalance').slideToggle();
    var text = document.getElementById('btn_showBalance');

    if(text.innerHTML == "View Balance"){
        text.innerHTML = "Hide Balance";
    }else{
        text.innerHTML = "View Balance";
    }
}//close ShowBalance Function

//function to report missing files
function reportMissingFile(){
    alert("Report Missing file clicked");
}//close reportMissing File Function

//function to report file mirthU_and_fbalance
function reportMirthU_and_fBalance(a){
    alert("Checking " +a);
}//close reportMissing File Function

// send data to SAP Process Files 
function processFiles(){
    alert("SAP process");
}//close ProcessFiles

/*-------------------------------------------- Selecting records for balances -----------------------------------------*/

//Misc cash New
function getTable10Results(file_name,type){
    var obj = '{"main_id" : "'+file_name+'","type" : "'+type+'"}', //creating object
        tbody = '', // declaring for table body content
        wsUrl  =  "assets/includes/apis/getBalances/getTable10Balances.php"; //path for getting current files or letters
        
        $.ajax({
            method : 'POST', // method used
            data : obj,      // passing data
            url: wsUrl,      // passing url
            success : function(data){
               
                var txt = '['+data+']', // accepts feedback
                    obj = JSON.parse(txt); // converting recieved data to JSON

                    //if there are records found
                    if(obj[0].rows > 0){
                        
                        debits = obj[0].data[0].DEBITS;
                        credits = obj[0].data[0].CREDITS;

                        if(debits == null & credits == null)
                            tbody = '('+debits+') - ('+credits+')';
                        else
                            tbody = '('+debits+') - ('+credits+')';

                    }else{
                        tbody = '<center><h4>No balances Found.</h4></center>';
                    }
                    
                document.getElementById("table10").innerHTML += tbody;
                
            },//close success function
            error:function(){
            } // close error function
        });// close ajax function
}

function getTable99Results(file_name,type){
    var obj = '{"main_id" : "'+file_name+'","type" : "'+type+'"}', //creating object
        tbody = '', // declaring for table body content
        wsUrl  =  "assets/includes/apis/getBalances/getTable99Balances.php"; //path for getting current files or letters
        
        $.ajax({
            method : 'POST', // method used
            data : obj,      // passing data
            url: wsUrl,      // passing url
            success : function(data){
                var txt = '['+data+']', // accepts feedback
                    obj = JSON.parse(txt); // converting recieved data to JSON

                    //if there are records found
                    if(obj[0].rows > 0){
                        debits = obj[0].data[0].DEBITS99;
                        credits = obj[0].data[0].CREDITS99;
                        if(debits == null & credits == null)
                            tbody = 'Not processed';
                        else
                            tbody = '('+debits+') - ('+credits+')';
                    }else{
                        tbody = '<center><h4>No balances Found.</h4></center>';
                    }
                document.getElementById("table99").innerHTML += tbody;
                
            },//close success function
            error:function(){
            } // close error function
        });// close ajax function
}
//END Misc cash New

//BAR
function getTableBar10Results(file_name,type){
    var obj = '{"main_id" : "'+file_name+'","type" : "'+type+'"}', //creating object
        tbody = '', // declaring for table body content
        wsUrl  =  "assets/includes/apis/getBalances/getTableBar10Balances.php"; //path for getting current files or letters
        
        $.ajax({
            method : 'POST', // method used
            data : obj,      // passing data
            url: wsUrl,      // passing url
            success : function(data){
                
                var txt = '['+data+']', // accepts feedback
                    obj = JSON.parse(txt); // converting recieved data to JSON

                    //if there are records found
                    if(obj[0].rows > 0){
                        
                        debits = obj[0].data[0].DEBITS;
                        credits = obj[0].data[0].CREDITS;

                        if(debits == null & credits == null)
                            tbody = '('+debits+') - ('+credits+')';
                        else
                            tbody = '('+debits+') - ('+credits+')';

                    }else{
                        tbody = '<center><h4>No balances Found.</h4></center>';
                    }
                    
                document.getElementById("table10").innerHTML += tbody;
                
            },//close success function
            error:function(){
            } // close error function
        });// close ajax function
}

function getTableBar99Results(file_name,type){
    var obj = '{"main_id" : "'+file_name+'","type" : "'+type+'"}', //creating object
        tbody = '', // declaring for table body content
        wsUrl  =  "assets/includes/apis/getBalances/getTableBar99Balances.php"; //path for getting current files or letters
        
        $.ajax({
            method : 'POST', // method used
            data : obj,      // passing data
            url: wsUrl,      // passing url
            success : function(data){
               
                var txt = '['+data+']', // accepts feedback
                    obj = JSON.parse(txt); // converting recieved data to JSON

                    //if there are records found
                    if(obj[0].rows > 0){

                        debits = obj[0].data[0].DEBITS99;
                        credits = obj[0].data[0].CREDITS99;

                        if(debits == null & credits == null)
                            tbody = '('+debits+') - ('+credits+')';
                        else
                            tbody = '('+debits+') - ('+credits+')';

                    }else{
                        tbody = '<center><h4>No balances Found.</h4></center>';
                    }
                    
                document.getElementById("table99").innerHTML += tbody;
                
            },//close success function
            error:function(){
            } // close error function
        });// close ajax function
}
//END BAR

/*----------------------------------------- End Selecting records for balances ------------------------------------------*/

/*----------------------------------------------------Ending File Manager Scripts ----------------------------------------------*/

//function to get bacldated files
function getBarFiles(file_type,file_id){
    var results = "",
    found = false,
    data = '{"main_id":"'+file_id+'"}',                                     //declaring for table body content
    wsUrl  =  "assets/includes/apis/record15/getSpecificRecord15.php";      //path for getting current files or letters

    switch(file_type){
        case "BAR":
            tt++;
            
            results = file_id;
            found = true;
            break;
        case "HBBAR":
            tt++;
            
            found = true;
            results = file_id;
            break;
        default:
           
            break;
    }

    if(found){
        $.ajax({
            url: wsUrl,
            data: data,
            method: "POST",
            success : function(data){
            var txt = '['+data+']',
                ress = JSON.parse(txt);
                if(ress[0].status != 0){
                    var date1 = ress[0].data[count].MAIN_ID,
                            date2 = ress[0].data[count].TRAN_SERV_DATE,
                            accNo1 = ress[0].data[count].ACCOUNTNO,
                            date1 = date1.substring(4,12);
                    
                    res = '<td scope="row"><strong>'+ (count+1) +'</strong></td><td>'+ress[0].data[count].MAIN_ID+'</td><td>'+ress[0].data[count].TRAN_SERV_DATE+'</td><td>'+accNo1+'</td><td class="text-center">'+updateLetterToIcon(ress[0].data[count].PAYMENT_PROCESSED)+'</td><td>'+checkNull(ress[0].data[count].COMMENTS)+"</td><td><button onclick='showConfirmAlert(\""+accNo1+"\",\""+date1+"\",\""+date2+"\")' class='btn btn_btn btn_primary'>Update</button></td></tr>";
                }else{
                    res = '<tr><td colspan="7"><center><h4>No Back dated records  found.</h4></center></td></tr>';
                }
                
                if(tt == 2){
                    document.getElementById('tbody2').innerHTML = res;
                    tt = 0;
                }
            },//close success function
            error:function(){
            }//close error function
        });//close ajax function
    }
}

//loads files details
function runFilesDetails(){
    var param = getParams(window.location.href);
    var file_name = param.main_id;
    var file_type = param.code;
    
    if(file_type == "BAR" || file_type == "HBBAR"){
        getTableBar10Results(file_name,file_type);
        getTableBar99Results(file_name,file_type);
    }else{
        getTable10Results(file_name,file_type);
        getTable99Results(file_name,file_type);
    }

    populateFIlesDetails(param);

    function populateFIlesDetails(obj){
        var file = updateLetterToIcon(obj.file);
        var mirth = updateLetterToIcon(obj.mirth);
        var sap = updateLetterToIcon(obj.sap);

        $('#main').text(obj.main_id);
        $('#type').text(obj.code);
        $('#datee').text(makeDAte(obj.date));
        $('#mirth').html(mirth);
        $('#filee').html(file);
        $('#sapp').html(sap);

        if((param.mirth == "n" || (param.mirth == "n"))){
            $('#ErrorFiles').show();
            $('#balanceFiles').hide();
        }else{
            $('#balanceFiles').show();
            $('#ErrorFiles').hide();
        }
    }
}

//report file errors
function report(){
    var param = getParams(window.location.href);
    reportMirthU_and_fBalance(param.code);
}

//function to get number of backdated files
function getwaitingBackdates(){
    $.ajax({
        url: "assets/includes/apis/checks/checkLastBackDate.php",
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data.ans); // getting answer from object
               
                if(obj[0].status == "1"){
                    $('#loadFiles').hide();
                }else{
                    $('#loadFiles').fadeIn(500);
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}

//function to get numbeer of unload files
function getSapUnloads(){
    $.ajax({
        url: "assets/includes/apis/checks/checkLastUnloaded.php",
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data.ans); // getting answer from object
               
                if(obj[0].status == "1"){
                    $('#loadFiles').hide();
                }else{
                    $('#loadFiles').fadeIn(500);
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}

/*---------------------------------------------------- Dashboard Analytics  --------------------------------------------*/
//get number of Misc cash files
function getMiscNum(){
    $.ajax({
        url: "assets/includes/apis/analytics/getTotMiscCashFiles.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data[0].ANS); // getting answer from object
               
                if(obj[0].rows > 0){
                    $('#miscNo').text(num);
                }else{
                    $('#miscNo').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
});//close ajax function                    
}//close getMiscNum Function

//get number of HB Misc cash files
function getHBMiscNum(){
    $.ajax({
        url: "assets/includes/apis/analytics/getTotHB_MCFiles.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt),
                num = (obj[0].data[0].ANS); // getting answer from object
                
                if(obj[0].rows > 0){
                    $('#HbMiscNo').text(num);
                }else{
                    $('#HbMiscNo').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getHBMiscNum Function

//get number of Bar files
function getBarNum(){
    $.ajax({
        url: "assets/includes/apis/analytics/getTotBarFiles.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt),
                num = (obj[0].data[0].ANS); // getting answer from object
                
                if(obj[0].rows > 0){
                    $('#barNo').text(num);
                }else{
                    $('#barNo').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getBarNum Function

//get number of HB Bar files
function getHBBarNum(){
    $.ajax({
        url: "assets/includes/apis/analytics/getHB_BarFiles.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt),
                num = (obj[0].data[0].ANS); // getting answer from object
                
                if(obj[0].rows > 0){
                    $('#hbBarNo').text(num);
                }else{
                    $('#hbBarNo').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getHBBarNum Function

//get number of mirth upload errors 
function getMirthUploadErr(){
    $.ajax({
        url: "assets/includes/apis/analytics/getMirthUploadErr.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data[0].ANS); // getting answer from object
               
                if(obj[0].rows > 0){
                    $('#mirthUpload').text(num);
                }else{
                    $('#mirthUpload').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getMirthUploadErr Function

//get number of File Balance errors 
function getFileBalanceErr(){
     //request for number of file balance errors
    $.ajax({
        url: "assets/includes/apis/analytics/getFileBalanceErr.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data[0].ANS); // getting answer from object
               
                if(obj[0].rows > 0){
                    $('#FileBal').text(num);
                }else{
                    $('#FileBal').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getFileBalanceErr Function

//get number of files for current date
function getCurrDayNoOfFiles(){

    var date = getDate();                                   //get current date
    
    date = decrementDate(date.date,1);                      //decrementing date by 1 day
    
    date = parseDate(date);                                 //convert date to nvalid date format (returns json)    
    

    date = date.numbers;                                    //get numeric date format from JSON

    var obj = '{"date" : "'+date+'"}';

    //request for number of recieved files for current date
    $.ajax({
        method: 'POST',
        url: "assets/includes/apis/analytics/getCurrDayNoOfFiles.php", 
        data : obj,
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data[0].ANS); // getting answer from object
              
                if(obj[0].rows > 0){
                    $('#fileRecieved').text(num);
                }else{
                    $('#fileRecieved').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getCurrDayNoOfFiles Function

//get number of files Record15
function getNoOfRecord15(){
    //request for total number of all record15 files
    $.ajax({
        url: "assets/includes/apis/analytics/getNoOfRecord15.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data[0].ANS); // getting answer from object
              
                if(obj[0].rows > 0){
                    $('#rec15NoOfFiles').text(num);
                }else{
                    $('#rec15NoOfFiles').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getNoOfRecord15 Function

//get number of files Record15
function getNoOfFilestoUpdatedDate(){
    //request for number of backdated payments
    $.ajax({
        url: "assets/includes/apis/analytics/getNoOfFilestoUpdatedDate.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                num = (obj[0].data[0].ANS); // getting answer from object
               
                if(obj[0].rows > 0){
                    $('#updateFiles').text(num);
                }else{
                    $('#updateFiles').text("0");
                }//close if
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close getNoOfRecord15 Function

/*----------------------------------------------------Ends Dashboard Analytics  --------------------------------------------*/

/*----------------------------------------------------Record 15 Billing  --------------------------------------------*/

//function to get all test files on record15
function getRecord15s(){
    var wsUrl  =  "assets/includes/apis/getTest.php";           //path for getting current files or letters

    $('#login_loader').show();                                  // display loader

    //giving loader sometime to load (1 sec)
    setTimeout(function(){
        $('#login_loader').fadeOut(300);                        // terminating loader
        
        $.ajax({
            url: wsUrl,                                         // passing url
            success : function(data){
                var txt = '['+data+']',                         // accepts feedback
                    obj = JSON.parse(txt),                      // converting recieved data to JSON
                    count = 0,                                  // Start count for loop
                    lengthh = Object.keys(obj[0].data).length;  //get lenght of recieved objects

                    //if there are records found
                    if(obj[0].status == "1"){
                        tbody = "";
                        //loop through the objects
                        
                        for(i = 0;i<lengthh;i++){
                            
                            var date1 = obj[0].data[i].MAIN_ID,
                                date2 = obj[0].data[i].TRAN_SERV_DATE,
                                accNo1 = obj[0].data[i].ACCOUNTNO;
                                date1 = date1.substring(4,12);

                            if(date1 == date2){
                                tbody += '<td scope="row"><strong>'+ (count+1) +'</strong></td><td>'+obj[0].data[i].MAIN_ID+'</td><td>'+obj[0].data[i].TRAN_SERV_DATE+'</td><td>'+accNo1+'</td><td class="text-center">'+updateLetterToIcon(obj[0].data[i].PAYMENT_PROCESSED)+'</td><td>'+checkNull(obj[0].data[i].COMMENTS)+'</td><td><a class="btn btn_btn" href="#">View</a></td></tr>';
                            }else{
                                tbody += '<td scope="row"><strong>'+ (count+1) +'</strong></td><td>'+obj[0].data[i].MAIN_ID+'</td><td>'+obj[0].data[i].TRAN_SERV_DATE+'</td><td>'+accNo1+'</td><td class="text-center">'+updateLetterToIcon(obj[0].data[i].PAYMENT_PROCESSED)+'</td><td>'+checkNull(obj[0].data[i].COMMENTS)+"</td><td><button onclick='showConfirmAlert(\""+accNo1+"\",\""+date1+"\",\""+date2+"\")' class='btn btn_btn btn_primary'>Update</button></td></tr>";
                            }
                            count++; // incrementing count
                        }
                        
                    }else{
                        tbody = '<tr><td colspan="6"><center><h4>No Files found.</h4></center></td></tr>';
                    }
                
                document.getElementById("tbody").innerHTML = tbody;
                
                $('#tbody').hide(); // hide content on the table body
                $('#tbody').fadeIn(500); // show it slowly
            },//close success function
            error:function(){
                obj = {status : 0};
            } // close error function
        });// close ajax function
     },1000);//close setTimeou function
}//close getTest

//function to get Back dated Payments
function getBackdatedPayments(date){
   
    num = date;   
    var jsonFiles ="";
    console.log(num);
    $.ajax({
        url:"assets/includes/apis/readLetters.php",
        method:"POST",
        data:'{"date":"'+num+'"}',
        dataType:'JSON',
        success : function(value){
            console.log(value);
            var fileTypes = ['misc cash','BAR','HBMISCCASH','HBBAR'];
            var files = ['mc','bar','hbmc','hbbar'];
            var values = [];
            for(i = 0;i<value.data.length;i++){

                switch(value.data[i].MAIN_FILETYPE){
                    case fileTypes[0]:
                        values[0] = (value.data[i].MAIN_ID);
                        break;
                    case fileTypes[1]:
                        values[1] = (value.data[i].MAIN_ID);
                        break;
                    case fileTypes[2]:
                        values[2] = (value.data[i].MAIN_ID);
                        break;
                    case fileTypes[3]:
                        values[3] = (value.data[i].MAIN_ID);
                        break;
                }
            }

            for(j=0;j<4;j++)
                jsonFiles += '"'+files[j]+ '":"'+values[j]+'",';

            var file_ids = (JSON.parse(("{"+jsonFiles.substr(0,jsonFiles.length-1)+"}")));

            console.log(file_ids.bar);
            

            $('#login_loader2').show();                                    // display loader
            
            backdate(file_ids.bar,file_ids.hbbar);
            nullcosts(file_ids.bar,file_ids.hbbar);
            //giving loader sometime to load (1 sec)
            
        },
        error : function(){

        }
    });

}//close getBackdatedPayments

function nullcosts(a,b){
    var wsUrl  =  "assets/includes/apis/record15/nullcostcenter.php"; //path for getting current files or letters
    setTimeout(function(){
        $('#login_loader2').hide();                          // terminating loader
        var obj = '{"bar" : "'+a+'","hbbar":"'+b+'"}';

        console.log(obj);
        console.log("IN");
        $.ajax({
            url: wsUrl,
            method:"POST",
            data: obj,
            dataType : 'json',                                             // passing url
            success : function(data){
                console.log("1");
                console.log(data);
                if(data.rows < 1){
                    $('#nullCostCenter').hide();
                    console.log("2");
                }else{
                    console.log("3");
                    $('#nullCostCenter').show();
                    setTimeout(function(){
                        $('#loadFiles').hide();
                        $('#table').hide();
                    },500);
                   

                    $('#login_loader5').hide();
                    tbody = "";
                    //loop through the objects
                    //console.log(obj);
                    for(i = 0;i<data.data.length;i++){
                        var billno = data.data[i].BILLNO,
                            accNo1 = data.data[i].ACCOUNTNO,
                            main_id = data.data[i].MAIN_ID;
                        
                            tbody += '<tr ><td style="text-align:center;width:45px;"><input style="position:absolute;opacity:0;" type="checkbox"  value="'+main_id+','+accNo1+','+billno+'" class="checkitem">'+(i+1)+'</td><td>'+accNo1+'</td><td>'+billno+'</td><td><input type="text" size="10" id="'+accNo1+','+billno+','+main_id+'"/></td><td><button class="btn btn-successful" style="background-color: #1c3d48;color:white;width:100px;" onclick="updateNullCostCenter(\''+accNo1+'\',\''+billno+'\',\''+main_id+'\')">Update</button></td></tr>';
                        
                        count++; // incrementing count
                    }
                }
               
                document.getElementById("tbodyNullCostCenter").innerHTML = tbody;
                $('#login_loader5').hide();
                $('#tbodyNullCostCenter').hide(); // hide content on the table body
                $('#tbodyNullCostCenter').fadeIn(500); // show it slowly
                
            },//close success function
            error:function(){
                obj = {status : 0};
                console.log("Out");
            } // close error function
        });// close ajax function
    },1000);//close setTimeou function
}

function updateNullCostCenter(acc,bill,main){
    var loca = document.getElementById(acc+","+bill+","+main).value;

    if(loca == "" || loca == null){
        console.log("enpty");
    }else{
        var obj = '{"main_id":"'+main+'","acc":"'+acc+'","billno":"'+bill+'","loca":"'+loca+'"}';
        $.ajax({
            url:"assets/includes/apis/record15/updatenullcostcenter.php",
            method:"POST",
            data : obj,
            dataType  : "JSON",
            success : function(data){
                console.log(data);
            },
            error : function(error){
                console.log(error);
            }
        });
        $('#tbody').text('');                               //eraise table content
        $('#tbody').hide();                                 //populate table content
        $('#loadFiles').hide();
        $('#table').hide();
        $('#login_loader').show(); 
        console.log("Test");
        console.log(localStorage.wordsDate);
        var date = localStorage.wordsDate.replaceAll('-',' ');
        console.log(date);
        var date = decrementDate(date,1);
        date = parseDate(date); 
        date = date.numbers;     
        getBackdatedPayments(date);

    }
    
}


function skip(){
    $('#backdatedPay').hide();
    // $("#loadFiles").show();
    // $("#table").show();
    // $("#tbody").show();
    load();
}

function backdate(a,b){
    var wsUrl  =  "assets/includes/apis/record15/getSpecificRecord15.php"; //path for getting current files or letters
    setTimeout(function(){
        $('#login_loader2').hide();                          // terminating loader
        var obj = '{"bar" : "'+a+'","hbbar":"'+b+'"}';
        console.log(obj);
        $.ajax({
            url: wsUrl,
            method:"POST",
            data: obj,
            dataType: 'json',                                             // passing url
            success : function(data){
                console.log(data);
                var obj = data,                        // converting recieved data to JSON
                    count = 0,                                    // Start count for loop
                    lengthh = obj.data.length;    //get lenght of recieved objects
                    
                    setRows(obj.rows);
                
                    //if there are records found
                    if(obj.rows > 0){
                        $('#backdatedPay').fadeIn(500);
                        $('#login_loader3').hide();
                        $('#login_loader').hide(); 
                        tbody = "";
                        //loop through the objects
                        //console.log(obj);
                        for(i = 0;i<lengthh;i++){
                            var date1 = obj.data[i].MAIN_ID,
                                date2 = obj.data[i].TRAN_SERV_DATE,
                                accNo1 = obj.data[i].ACCOUNTNO;
                                date1 = date1.substring(4,12);
                                console.log(obj.data[i]);
                            
                                tbody += '<tr id="'+obj.data[i].MAIN_ID+','+accNo1+','+obj.data[i].SEQ_GL_ACCNO+'"><td style="text-align:center;width:45px;"><span class="check fixedcheck"></span><label class="containerr"><input style="position:absolute;" type="checkbox"  value="'+obj.data[i].MAIN_ID+','+accNo1+','+obj.data[i].SEQ_GL_ACCNO+'" class="checkitem"><span class="checkmark marker"></span></label></span></td><td>'+obj.data[i].MAIN_ID+'</td><td>'+accNo1+'</td><td>'+obj.data[i].BILLNO+'</td><td style="text-align:center;">'+obj.data[i].SEQ_GL_ACCNO+'</td><td>'+obj.data[i].TRAN_CODE+'</td><td>'+obj.data[i].TRAN_SERV_DATE+'</td><td>'+date1+'</td></tr>';
                            
                            count++; // incrementing count
                        }
                    }else{
                        tbody = '<tr><td colspan="6"><center><h4>No Files found.</h4></center></td></tr>';
                        $('#backdatedPay').hide(); 
                        load();
                        $('#loadFiles').fadeIn(500);
                        $('#login_loader').show();
                        $('#login_loader2').hide();
                    }
                
                document.getElementById("tbodyBackDated").innerHTML = tbody;
                $('#login_loader4').hide();
                $('#tbody').hide(); // hide content on the table body
                $('#tbody').fadeIn(500); // show it slowly
                
            },//close success function
            error:function(){
                obj = {status : 0};
            } // close error function
        });// close ajax function
    },1000);//close setTimeou function
}


//displays hidden alert as a modal
function showConfirmAlert(){
    $('#overlayRec').fadeIn(500);
    $('#confirm_alert').show(500);
}//close show confirm alert function

//closes a confirm modal 
function closeConfirmAlert(){
    $('#confirm_alert').fadeOut(500);
    $('#overlayRec').fadeOut(500);
    window.location.href = 'fileManagement.html';
}//close close confirm alert function

//closes a alert_previous modal 
function closeConfirmAlertError(){
    $('#confirm_alert_previous').fadeOut(500);
    $('#overlayRec').fadeOut(500);
}//close close confirm alert function
//closes a alert_previous modal 

function closeModal(){
    $('#confirm_alert').fadeOut(500);
    $('#overlayRec').fadeOut(500);
}//close close confirm alert function

function closeConfirmAlert2(){
    $('#confirm_alert').fadeOut(500);
    $('#overlayRec').fadeOut(500);
}//close close confirm alert function

//runs update method for a specific record in table record 15
function runUpdate(){
    var accNo = $('#record_deatils').text(),
        date = $('#date_new').text(),
        date2 = $('#date_old').text();
        closeConfirmAlert();
        updateRecord15(accNo,date,date2);
}//close run update method

//update function for a specific record in table record 15
function updateRecord15(accNo,date,date2){
    var wsUrl  =  "assets/includes/apis/record15/updateRecord15.php", //path for getting current files or letters
    obj = '{"accountNo" : "'+accNo+'","date" : "'+date+'","date2" : "'+date2+'"}';
    $('#tbody').slideToggle();
    $('#login_loader').show(); // display loader
    
    //giving loader sometime to load (1 sec)
    setTimeout(function(){
        $.ajax({
            method : "POST",
            data : obj,
            url: wsUrl,      // passing url
            success : function(data){

                var txt = '['+data+']', // accepts feedback
                    obj = JSON.parse(txt); // converting recieved data to JSON
                
                getRecord15s();
                $('#results').text(obj[0].data);
                $('#alert').fadeIn(1000);
                setTimeout(function(){
                    $('#alert').slideToggle(500);
                    $('#login_loader').fadeOut(300); // terminating loader
                },3000);
                
            },//close success function
            error:function(){
                obj = {status : 0};
            } // close error function
        });// close ajax function
     },1000);//close setTimeou function
}//close updateRecord15 function

/*----------------------------------------------------End Record 15 Billing  --------------------------------------------*/

/*-------------------------------------------------------- Helping functions --------------------------------------------------*/


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//get month name (APR) format
function checkMonth(month){
    month = parseInt(month); //converting parsed in data to integer
   
    var day = "";

    switch(month){
        case 01:
            day = "JAN";
            break;
        case 02:
            day = "FEB";
            break;
        case 03:
            day = "MAR";
            break;
        case 04:
            day = "APR";
            break;
        case 05:
            day = "MAY";
            break;
        case 06:
            day = "JUN";
            break;
        case 07:
            day = "JUL";
            break;
        case 08:
            day = "AUG";
            break;
        case 09:
            day = "SEP";
            break;
        case 10:
            day = "OCT";
            break;
        case 11:
            day = "NOV";
            break;
        case 12:
            day = "DEC";
            break;
        default:
            day = "none";
    }

    return day;
}//close checkMonth function

//check value if null put empty
function checkNull(val){
    if(val == null){
        return "Empty";
    }else{
        return val;
    }
}

//run all analytics
function getAnalytics(){
    getMiscNum();                   //gets total number of Misc cash files
    getHBMiscNum();                 //gets total number of HB Misc cash files (Legacy)
    getBarNum();                    //gets total number of Bar files
    getHBBarNum();                  //gets total number of HB Bar Files (Legacy)
    getCurrDayNoOfFiles();          //gets total number of Current Day Files from (dw.log_sapgl` table)
    getMirthUploadErr();            //gets total number of files not uploaded in Mirth
    getFileBalanceErr();            //gets total number of files which they dont balance
    getNoOfRecord15();              //gets total number of files in record15 
    getNoOfFilestoUpdatedDate();    //gets number of file sneds to be updated date
}//close getAnalytics function

//counting number of un uploaded file to disable the next button
function countSapLoaded(sapletter){
    
    switch(sapletter){
        case null:
           countSap += 1;
            break;
        case  " ":
           countSap += 1;
            break;           
        case "":
           countSap += 1;
            break;
        case "n":
            countSap += 1;
            break;
    }
    return countSap;
}

//updating y to icons
function updateLetterToIcon(letter){
    
    var results = "";

    switch(letter){
        case "y":
            results = '<i class="fa fa-check-circle" style="color:green;font-size:16pt;"></i>';
            break;
        case "n":
            results = '<i class="fa fa-times-circle" style="color:red;font-size:16pt;"></i>';
            break;
        case null:
            results = '<i class="fa fa-times-circle" style="color:red;font-size:16pt;"></i>';
            break;
        case "null":
            results = '<i class="fa fa-times-circle" style="color:red;font-size:16pt;"></i>';
            break;
        case  " ":
            results = '<i class="fa fa-times-circle" style="color:red;font-size:16pt;"></i>';
            break;           
        case "":
            results = '<i class="fa fa-times-circle" style="color:red;font-size:16pt;"></i>';
            break;
    }

    return results;
}//close updateLetterToIcon function

//current date (2018-05-11) format
function getDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    }
    
    if(mm<10) {
        mm = '0'+mm
    }
    
    today2 =  dd + ' ' + checkMonth(mm)  + ' ' +  yyyy;
    today =   yyyy + '' + mm + '' + dd;

    today = '{"numbers":"'+today+'","date":"'+today2+'"}';
    today = JSON.parse(today);

    return today;
}//close getDate (current) function

//changing parsed in date to new date format (2018-05-11 AND 20180511) format
function parseDate(date){
    var today = new Date(date);
   
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    } 
    
    if(mm<10) {
        mm = '0'+mm
    } 

    today2 =  dd + ' '+ checkMonth(mm)  + ' ' +  yyyy;
    today =   yyyy+ '' + mm+ '' + dd;
    
    today = '{"numbers":"'+today+'","date":"'+today2+'"}';
    today = JSON.parse(today);

    return today;
}//close getDate (current) function


/*
 * Listener for enter button on login
 * 
 */

function enterListener(){
    document.querySelector('#username').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { 
            document.getElementById("btn_login").click();
        }
    });
    document.querySelector('#password').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { 
            document.getElementById("btn_login").click();
        }
    });
}

/*------------------------------------------------------ End Helping functions --------------------------------------------------*/

// $('#delsel').click(function(){
    
//     var id = $('.checkitem:checked').map(function(){
//         return $(this).val();
//     }).get().join(' ');

//     var ids = [];

//     $('#login_loader4').fadeIn(200);

//     $('.checkitem:checked').each(function(i){
//         ids[i] = $(this).val();
//     });

//     if(ids[0] == null){
//         document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/Error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
//         document.getElementById('message_alert').innerHTML = '<span style="color:#a53131"> <h4>Select atleast one record to update</h4> </span> ';
//         document.getElementById('btn_alert').innerHTML = '<button onclick="closeModal()" class="btn btn_btn">OK</button>';
//         showConfirmAlert();
//         $('#login_loader4').hide();
//     }else{
//         var arr = new Array("main_id","account","tran_serv_date","main_date","sgl_acc");
//         var json = "";
//         var oneJson = [];
//             for(i=0;i<ids.length;i++){
//                 // var txt = '{'+ids[i]+'}',                           // accepts feedback
//                 // obj = JSON.parse(txt);
//                 //console.log("["+ids[i]+"]");
//                 var idd = ids[i];

//                 var rec = {};

//                 var obj = ids[i];
//                 for(j=0;j<5;j++){
//                     json += '"'+arr[j]+'":"'+obj.split(",")[j]+'",';
//                 }

//                 oneJson.push("{"+json.substring(0,json.length-1)+"}");
//                 json = "";
//             }

//             addNote(localStorage.id,'Updated Back Dated Payments','Files id: '+ids);

//         var sqlUpdate = "";

//        console.log(oneJson.length);

//         for(l=0;l<oneJson.length;l++){
//             var selected = (JSON.parse(oneJson[l]));
//             var to = selected.main_id.substring(4,12);

//             sqlUpdate = "UPDATE dwdev.dev_accr_record15 SET tran_serv_date = '"+to+"',comments = 'Updated tran_serv_date from "+selected.tran_serv_date+" to "+to+" (day data received),this is a back dated payment received in "+selected.main_id.substring(4,10)+"' WHERE accountno = '"+selected.account+"' AND main_id = '"+selected.main_id+"' AND seq_gl_accno = "+selected.sgl_acc+";";

//             updateRec(sqlUpdate,ids);
//         }
//     }
// });


//call updated back dated payments procedure
function updateBackdatedPayments(){

        var id = $('.checkitem:checked').map(function(){
                    return $(this).val();
                }).get().join(' ');

        var ids = [];
        $('#login_loader4').fadeIn(200);
        $('.checkitem:checked').each(function(i){
            ids[i] = $(this).val();
        });

        if(ids[0] == null){
                document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/Error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
                document.getElementById('message_alert').innerHTML = '<span style="color:#a53131"> <h4>Select atleast one record to update</h4> </span> ';
                document.getElementById('btn_alert').innerHTML = '<button onclick="closeModal()" class="btn btn_btn">OK</button>';
                showConfirmAlert();
                $('#login_loader4').hide();
        }else{
            for(i=0;i<ids.length;i++){

                var arr = JSON.stringify(ids[i]).split(/,/);
                var obj = '{"main_id":'+arr[0]+'","sgl":"'+arr[2]+',"accountno":"'+arr[1]+'"}';
                // var obj = '{"main_id":"BAR-20181127-1-342127","accountno":"AL0000014808","sgl":"1"}';
                console.log(obj);
               
                $.ajax({
                    url : "assets/includes/apis/record15/updatedAllBackdatedPayments.php",
                    method : "POST",
                    data: obj,
                    dataType : 'json',
                    success : function(data){
                        console.log(data);
                        if(data.status == 1){
                            addNote(localStorage.id,'Updated Back Dated Payments','Files id: '+ids[i]);
                            document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/success.png" alt="" width="100px" style="margin-bottom:10px;"/>';
                            document.getElementById('message_alert').innerHTML = '<span style="color:#a53131"> <h4>Successfully Updated</h4> </span> ';
                            document.getElementById('btn_alert').innerHTML = '<button onclick="closeModal()" class="btn btn_btn">OK</button>';
                            showConfirmAlert();
                            setTimeout(function(){$('#tbody').text('');                               //eraise table content
                            $('#tbody').hide();                                 //populate table content
                            $('#loadFiles').hide();
                            $('#table').hide();
                            $('#login_loader').show(); 
                            console.log("Test");
                            console.log(localStorage.wordsDate);
                            var date = localStorage.wordsDate.replaceAll('-',' ');
                            console.log(date);
                            var date = decrementDate(date,1);
                            date = parseDate(date); 
                            date = date.numbers;     
                            getBackdatedPayments(date);},1000);
                        }
                        else{
                            console.log("error");
                        }
                        
                    },
                    error :function(){
                        console.log("what");
                    }
                });
            }
       }
    }

//store number of returned data from DB
function setRows(number){
    rowCount = number;
}

function getRows(){
    return rowCount;
}

//function to updated backdated payemnt dates
function updateRec(dataa,obj){
    $.ajax({
        url : "assets/includes/apis/record15/updateSelected.php?p=del",
        method : "POST",
        data : '{"data" : "'+dataa+'"}',
        success : function(ress){
            
            //check backdated payments
            var j = 0;

            for(j =0;j<obj.length;j++){
                $('tr#'+obj[j]+'').addClass('deleRow');
                $('tr#'+obj[j]+'').fadeOut(800);
            }

            document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/success.png" alt="" width="100px" style="margin-bottom:10px;"/>';
            document.getElementById('message_alert').innerHTML = '<span style="color:#a53131"> <h4>Successfully Updated</h4> </span> ';
            document.getElementById('btn_alert').innerHTML = '<button onclick="closeModal()" class="btn btn_btn">OK</button>';
            showConfirmAlert();
            setTimeout(function(){$('#tbody').text('');                               //eraise table content
            $('#tbody').hide();                                 //populate table content
            $('#loadFiles').hide();
            $('#table').hide();
            $('#login_loader').show(); 
            console.log("Test");
            console.log(localStorage.wordsDate);
            var date = localStorage.wordsDate.replaceAll('-',' ');
            console.log(date);
            var date = decrementDate(date,1);
            date = parseDate(date); 
            date = date.numbers;     
            getBackdatedPayments(date);},1000);
        },
        error :function(){
            console.log({data:"error"});
        }
    });
}

//function to clear all localstorage and logout the user
$('#btn_logout').click(function(){
    localStorage.clear();
    window.location.href = "assets/includes/apis/logout.php";
});

/*function updateRec(accNo,date1,date2,sglAcc){
    $.ajax({
        url : "assets/includes/apis/record15/updateSelected.php?p=del",
        method : "POST",
        data : {accountNo:accNo,date:date1,date2:date2,sglAcc:sglAcc},
        success : function(data){
            console.log(data);
            var j = 0;
            for(j =0;j<ids.length;j++){
                $('tr#'+ids[j]+'').addClass('deleRow');
                $('tr#'+ids[j]+'').fadeOut(800);
            }
        },
        error :function(){
            console.log({data:"error"});
        }
    });
}*/

//chacnge to File Manager page when back btn is pressed
$('#back_btn').click(function(){
    window.location.href = "fileManagement.html";
});

//function to generate date format (dd-mm-yyyy)
function makeDateSelected(value){
    var fullDate = value,
        year2 = fullDate.substring(9,11),                     //get the full year (format # 2018 #)
        month = fullDate.substring(3,6),                    //get the month (format # 07 #)
        day = fullDate.substring(0,2)                     //get the day (format # 01 #)
        newDate2 = day+"-"+month+"-"+year2; 
    
        return newDate2;
}

//function to generate date format (dd mm yyyy)
function makeDAte(dateNumber){
    var year = dateNumber.substring(0,4),
            month = dateNumber.substring(4,6),
            day = dateNumber.substring(6,8),
            newDate = day+" "+checkMonth(month)+" "+year;

            return newDate
}

//gets the last file  uploaded and displays the next files to be uploaded
function getLastUploaded(){
    $.ajax({
        url : "assets/includes/apis/checks/checkLastUploaded.php",
        method : "POST",
        success : function(data){
            var txt = '['+data+']',     
            obj = JSON.parse(txt),
            lastDateAddOne = obj[0].data[0].MAIN_DATE;
            newDate = makeDAte(lastDateAddOne);
            console.log(newDate);
            console.log(lastDateAddOne + " : lastDateAddOne");
            
            localStorage.lastUploadDate = parseDate(incrementDate(new Date(newDate),1)).numbers;
            console.log(localStorage.lastUploadDate);

            var today = getDate();
            checkCurr = today.numbers;
            console.log(checkCurr);

            if(parseInt(localStorage.lastUploadDate) < parseInt(checkCurr)){
                var datee = parseDate(incrementDate(new Date(makeDAte(localStorage.lastUploadDate)),1));
                console.log("inHere : 1");
                console.log(datee);
                localStorage.number = datee.numbers;
                localStorage.wordsDate = makeDateSelected(parseDate(makeDAte(datee.numbers)).date);
            }else if(parseInt(localStorage.lastUploadDate) > parseInt(checkCurr)){
                console.log("inHere : 2");
            }
            else{
                console.log("inHere : 3");
                localStorage.number = checkCurr;
                localStorage.wordsDate = (today.date).substring(0,7)+(today.date).substring(((today.date).length)-2,(today.date).length);
            }
            console.log("Test");
            console.log(localStorage.wordsDate);
            var date = localStorage.wordsDate.replaceAll('-',' ');
            console.log(date);
            var date = decrementDate(date,1);
            date = parseDate(date); 
            date = date.numbers;     
            getBackdatedPayments(date);
        },
        error :function(){
            console.log({data:"error"});
        }
    });
}

//increments date by parsed in value (date,number of increments)
function incrementDate(dateInput,increment) {
    var dateFormatTotime = new Date(dateInput);
    var increasedDate = new Date(dateFormatTotime.getTime() + (increment *86400000));
    return increasedDate;
}

//decrements date by parsed in value (date,number of decrements)
function decrementDate(dateInput,decrement) {
    var dateFormatTotime = new Date(dateInput);
    var decreasedDate = new Date(dateFormatTotime.getTime() - (decrement *86400000));
    return decreasedDate;
}

//runs checks for SAP activities if are done or not
function runChecks(){
    checkGeneratedFiles();          //check if files already generated
    checkInternalSapLoad();         //check if files already uploaded to Internal SAP
    
}

//check if JSON is store (if not go back to file management)
function checkJson(){
    var json = getJsonFiles();          //get json to check
    if(json == "" || json == null || json == " "){
        $('#errorSAP').show();
        //window.location.href = "fileManagement.html";
    }else{
        runChecks();
        runCheckBalances();
        $('#wrapper').show();
    }
}

//get JSON String and converting it to JSON OBJECT
function getJsonFiles(){
    var file_ids = localStorage.jsonFiles;
    //return JSON.parse(file_ids);
   return file_ids;
}

//check files if are generated
function checkGeneratedFiles(){
            
    var files = getJsonFiles(),
    fileid = JSON.parse(files).bar;             //get bar id from JSON

    //request to check if files are generate
    $.ajax({
        url:"assets/includes/apis/checks/checkGenerated.php",
        method:"POST",
        data: '{"file_id":"'+fileid+'"}',
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt); //converting feedback to javascript object (JSON)

            if(obj[0].rows == 1){                       //if TRUE
                $('#gen').prop("checked",true);         //Tick the Checkbox        
                $('#generateContent').hide();           //hide the conent for generating files
            }
        },
        error  : function(err){
        }
    });
}

//check if files are uploaded to internal SAP
function checkInternalSapLoad(){
            
    var files = getJsonFiles(),                     //get JSON OBJECT
    fileid = JSON.parse(files).mc;                  //get misc cash MAIN_ID

    //request to check if files are uploaded to MINI SAP
    $.ajax({
        url:"assets/includes/apis/checks/checkInternalSapLoad.php",
        method:"POST",
        data: '{"file_id":"'+fileid+'"}',
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt); //converting feedback to javascript object (JSON)
            
            if(obj[0].rows == 1){                              //if TRUE                       
                $('#preUpload').prop("checked",true);          //Tick the Checkbox                                       
                $('#viewBalancess').prop("checked",true);      //Tick the Checkbox   
                $( "#viewBalancess" ).prop( "disabled", true); //Disable                                     
                $('#preUploadConent').hide();                  //hide the conent for Pre Upload SAP    
                checkMainSapLoad();                            //check if files already uploaded to Main SAP                                          
            }
        },
        error  : function(err){
        }
    });
}

function checkMainSapLoad(){
            
    var files = getJsonFiles(),                     //get JSON OBJECT
    fileid = JSON.parse(files).mc;                  //get misc cash MAIN_ID

    //request to check if files are uploaded to MINI SAP
    $.ajax({
        url:"assets/includes/apis/checks/checkMainSapUploaded.php",
        method:"POST",
        data: '{"file_id":"'+fileid+'"}',
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt); //converting feedback to javascript object (JSON)
            
            if(obj[0].rows == 1){                            //if TRUE          
                $('#mainSapUpload').hide();                //hide the content for Uploading to SAP    
                $( "#confirmAggreBalancesss" ).prop("disabled", true ); //Disable                                             
                $( "#confirmAggreBalancesss" ).prop( "checked", true ); //Disable                                             
            }else{
                               //hide the content for Uploading to SAP    
            }
        },
        error  : function(err){
        }
    });
}

//function to run all the checkBalance functions
function runCheckBalances(){
    checkBalanceBar();
    checkBalanceHBBar();
    checkBalanceHBMc();
    checkBalanceMc();
    checkBalanceAggregate();
}

//check if files are uploaded to internal SAP
function checkBalanceBar(){
            
    var files = getJsonFiles(),                     //get JSON OBJECT
    fileid = JSON.parse(files).bar;                  //get misc cash MAIN_ID
    var tbody = "",
        count = 1;

    //request to check if files are uploaded to MINI SAP
    $.ajax({
        url:"assets/includes/apis/checks/balances/balanceForBar.php",
        method:"POST",
        data: '{"file_id":"'+fileid+'"}',
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt), //converting feedback to javascript object (JSON)
            lengthh = Object.keys(obj[0].data).length;  
            var creditTot = 0,debitTot = 0;

            if(obj[0].rows > 0){
                for(i=0;i<lengthh;i++){
                    tbody += '<tr><td>'+(count++)+'</td><td>'+obj[0].data[i].PERIOD+'</td><td>'+obj[0].data[i].GL_ACCOUNTNO+'</td><td>'+obj[0].data[i].DEBITS+'</td><td>'+obj[0].data[i].CREDITS+'</td></tr>';
                    creditTot += parseFloat(obj[0].data[i].CREDITS);
                    debitTot += parseFloat(obj[0].data[i].DEBITS);
                }
                tbody += '<tr><th colspan="3" style="text-align:center">Total</th><td class="total">'+debitTot.toFixed(2)+'</td><td class="total">'+creditTot.toFixed(2)+'</td></tr>';
                $('#xportxlsx_BL_IAL').show();
            }else{
                tbody = '<tr><td colspan="5"><h3>No Balances on BAR-IAL file</h3></td></tr>';
                $('#xportxlsx_BL_IAL').hide();
            }
            document.getElementById("balancesViewBar").innerHTML = tbody;
        },
        error  : function(err){
        }
    });
}

//check aggregate
function checkBalanceAggregate(){
            
    var files = getJsonFiles(),                     //get JSON OBJECT
    file_id = JSON.parse(files).bar,                         //get JSON OBJECT
     fileid = file_id.substring(4,12);                  //get cash-date
    // fileid = "20190111";                  //get cash-date

    var tbody = "",
        count = 1;

        console.log(fileid);

    //request to check if files are uploaded to MINI SAP
    $.ajax({
        url:"assets/includes/apis/checks/balances/cashAggregate.php",
        method:"POST",
        data: '{"file_id" : "'+fileid+'"}',
        success : function(data){
            console.log(data);
            var txt = '['+data+']',
            obj = JSON.parse(txt), //converting feedback to javascript object (JSON)
            lengthh = Object.keys(obj[0].data).length;  
            var creditTot = 0,debitTot = 0;
            $("#cash_date").text("CASH-"+fileid);
            if(obj[0].rows > 0){
                for(i=0;i<lengthh;i++){
                    tbody += '<tr><td>'+(count++)+'</td><td>'+obj[0].data[i].MAIN_ID+'</td><td>'+obj[0].data[i].GL_ACCOUNTNO+'</td><td>'+obj[0].data[i].DEBITS+'</td><td>'+obj[0].data[i].CREDITS+'</td></tr>';
                    creditTot += parseFloat(obj[0].data[i].CREDITS);
                    debitTot += parseFloat(obj[0].data[i].DEBITS);
                }
                tbody += '<tr><th colspan="3" style="text-align:center">Total</th><td class="total">'+debitTot.toFixed(2)+'</td><td class="total">'+creditTot.toFixed(2)+'</td></tr>';
                $('#xportxlsx_cash_date').show();
            }else{
                tbody = '<tr><td colspan="5"><h3>No Balances for Aggregate</h3></td></tr>';
                $('#xportxlsx_cash_date').hide();
            }
            document.getElementById("balancesViewAggr").innerHTML = tbody;
        },
        error  : function(err){
        }
    });
}

//check if files are uploaded to internal SAP
function checkBalanceHBBar(){
            
    var files = getJsonFiles(),                     //get JSON OBJECT
    fileid = JSON.parse(files).hbbar;                  //get misc cash MAIN_ID
    var tbody = "",
        count = 1;
        
    //request to check if files are uploaded to MINI SAP
    $.ajax({
        url:"assets/includes/apis/checks/balances/balanceForHBBar.php",
        method:"POST",
        data: '{"file_id":"'+fileid+'"}',
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt), //converting feedback to javascript object (JSON)
            lengthh = Object.keys(obj[0].data).length; 
            var creditTot = 0,debitTot = 0;

            if(obj[0].rows > 0){
                for(i=0;i<lengthh;i++){
                    tbody += '<tr><td>'+(count++)+'</td><td>'+obj[0].data[i].PERIOD+'</td><td>'+obj[0].data[i].GL_ACCOUNTNO+'</td><td>'+obj[0].data[i].DEBITS+'</td><td>'+obj[0].data[i].CREDITS+'</td></tr>';
                    creditTot += parseFloat(obj[0].data[i].CREDITS);
                    debitTot += parseFloat(obj[0].data[i].DEBITS);
                }
                tbody += '<tr><th colspan="3" style="text-align:center">Total</th><td class="total">'+debitTot.toFixed(2)+'</td><td class="total">'+creditTot.toFixed(2)+'</td></tr>';
                
                $('#xportxlsx_BL_HBIAL').show();
            }else{
                tbody = '<tr><td colspan="5"><h3>No Balances on BAR-HBIAL file</h3></td></tr>';
                $('#xportxlsx_BL_HBIAL').hide();
            }
            document.getElementById("balancesViewHbBar").innerHTML = tbody;
        },
        error  : function(err){
        }
    });
}

//check if files are uploaded to internal SAP
function checkBalanceHBMc(){
            
    var files = getJsonFiles(),                     //get JSON OBJECT
    fileid = JSON.parse(files).hbmc;                  //get misc cash MAIN_ID
    var tbody = "",
        count = 1;

    //request to check if files are uploaded to MINI SAP
    $.ajax({
        url:"assets/includes/apis/checks/balances/balanceForHBMC.php",
        method:"POST",
        data: '{"file_id":"'+fileid+'"}',
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt), //converting feedback to javascript object (JSON)
            lengthh = Object.keys(obj[0].data).length; 
            var creditTot = 0,debitTot = 0;

            if(obj[0].rows > 0){
                for(i=0;i<lengthh;i++){
                    tbody += '<tr><td>'+(count++)+'</td><td>'+obj[0].data[i].PERIOD+'</td><td>'+obj[0].data[i].GL_ACCOUNTNO+'</td><td>'+obj[0].data[i].DEBITS+'</td><td>'+obj[0].data[i].CREDITS+'</td></tr>';
                    creditTot += parseFloat(obj[0].data[i].CREDITS);
                    debitTot += parseFloat(obj[0].data[i].DEBITS);
                }
                tbody += '<tr><th colspan="3" style="text-align:center">Total</th><td class="total">'+debitTot.toFixed(2)+'</td><td class="total">'+creditTot.toFixed(2)+'</td></tr>';
                $('#xportxlsx_MC_HBIAL').show();
            }else{
                tbody = '<tr><td colspan="5"><h3>No Balances on MC-HBIAL file</h3></td></tr>';
                $('#xportxlsx_MC_HBIAL').hide();
            }
            document.getElementById("balancesViewHbMc").innerHTML = tbody;
        },
        error  : function(err){
        }
    });
}
//check if files are uploaded to internal SAP
function checkBalanceMc(){
            
    var files = getJsonFiles(),                     //get JSON OBJECT
    fileid = JSON.parse(files).mc;                  //get misc cash MAIN_ID
    var tbody = "",
        count = 1;

    //request to check if files are uploaded to MINI SAP
    $.ajax({
        url:"assets/includes/apis/checks/balances/balanceForMC.php",
        method:"POST",
        data: '{"file_id":"'+fileid+'"}',
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt), //converting feedback to javascript object (JSON)
            lengthh = Object.keys(obj[0].data).length; 
            var creditTot = 0,debitTot = 0;

            if(obj[0].rows > 0){
                for(i=0;i<lengthh;i++){
                    tbody += '<tr><td>'+(count++)+'</td><td>'+obj[0].data[i].PERIOD+'</td><td>'+obj[0].data[i].GL_ACCOUNTNO+'</td><td>'+obj[0].data[i].DEBITS+'</td><td>'+obj[0].data[i].CREDITS+'</td></tr>';
                    creditTot += parseFloat(obj[0].data[i].CREDITS);
                    debitTot += parseFloat(obj[0].data[i].DEBITS);
                }
                tbody += '<tr><th colspan="3" style="text-align:center">Total</th><td class="total">'+debitTot.toFixed(2)+'</td><td class="total">'+creditTot.toFixed(2)+'</td></tr>';
                $('#xportxlsx_MC_IAL').show();
            }else{
                tbody = '<tr><td colspan="5"><h3>No Balances on MC-IAL file</h3></td></tr>';
                $('#xportxlsx_MC_IAL').hide();
            }
            document.getElementById("balancesViewMc").innerHTML = tbody;
        },
        error  : function(err){
        }
    });
}

//determain number of checked checkboxes (Used for enabling the upload to MAIN SAP btn)
// $('.checkitem').change(function() {
//     showSapUpload();
// });

//function for confirm balance button
$('#viewBalancess').change(function() {
    var selectedCheckboxes = checkboxSelectedLength();

    if(selectedCheckboxes < 2){
        document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/Error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
        document.getElementById('message_alert').innerHTML = '<span style="color:#a53131"> <h4>You need to complete Step 1</h4> </span> ';
        document.getElementById('btn_alert').innerHTML = '<button onclick="closeModal()" class="btn btn_btn">OK</button>';
        showConfirmAlert();
        $('#viewBalancess').prop("checked",false);
    }else{
        $('#viewBalancess').prop("checked",true);
        $('#step3Content').slideToggle();       
        $('#step2Content').slideToggle();
        var files = JSON.parse(getJsonFiles());
        addNote(localStorage.id,'Confirmed Balances','Files ID : ,MC-IAL : '+files.mc+',MC-HBIAL : '+files.hbmc+',BAR-IAL : '+files.bar+',BAR-HBIAL : '+files.hbbar);
   }
});

$('#confirmAggreBalancesss').change(function() {
    var selectedCheckboxes = checkboxSelectedLength();
    if(selectedCheckboxes < 3){
        document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/Error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
        document.getElementById('message_alert').innerHTML = '<span style="color:#a53131"> <h4>You need to complete Steps 1,2 & 3</h4> </span> ';
        document.getElementById('btn_alert').innerHTML = '<button onclick="closeModal()" class="btn btn_btn">OK</button>';
        showConfirmAlert();
        $('#confirmAggreBalancesss').prop("checked",false);
    }else{
        showSapUpload();
        $( "#mainSapUpload").show(); //Enable
        $('#confirmAggreBalancesss').prop("checked",true);
        $('#step4Content').slideToggle();       
        $('#step3Content').slideToggle();
        var files = JSON.parse(getJsonFiles());
        addNote(localStorage.id,'Confirmed Aggregate Balances','Files ID : ,MC-IAL : '+files.mc+',MC-HBIAL : '+files.hbmc+',BAR-IAL : '+files.bar+',BAR-HBIAL : '+files.hbbar);
   }
});

//check number of selected check boxes
function checkboxSelectedLength(){
    var lengthh = $(":checkbox:checked").length;
    return lengthh;
}

//function to show UPLOAD TO MAIN SAP button
function showSapUpload(){
    var selectedCheckboxes = checkboxSelectedLength();  //get number of checked including the current checked
    console.log(selectedCheckboxes);
    if(selectedCheckboxes == 4){
        $( "#mainSapUpload" ).show(); //Enable
    }else{
        $( "#mainSapUpload" ).hide();; //Disable
    }
}

//function for MAIN SAP 
$("#mainSapUpload").click(function(){
         var filess = getJsonFiles();
        var files = JSON.parse(getJsonFiles());
            date = files.bar.substring(4,12);
        var obj = '{"date":"'+ date +'"}';
        console.log(obj);
        $.ajax({
            url:"assets/includes/apis/mainSapUpload.php",
            method:"POST",
            data: obj,
            success:function(data){
                console.log(data);
                var txt = '['+data+']',
                obj = JSON.parse(txt); //converting feedback to javascript object (JSON)
                
                if(obj[0].data == 1){
                    addNote(localStorage.id,'Uploaded to MAIN SAP','Files ID : ,MC-IAL : '+files.mc+',MC-HBIAL : '+files.hbmc+',BAR-IAL : '+files.bar+',BAR-HBIAL : '+files.hbbar);
                    document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/success.png" alt="" width="100px" style="margin-bottom:10px;"/>';
                    document.getElementById('message_alert').innerHTML = '<span style="color:green"> <h4>Successfully Uploaded to MAIN SAP</h4> </span> ';
                    document.getElementById('btn_alert').innerHTML = '<button onclick="closeConfirmAlert()" class="btn btn_btn">Continue</button>';
                    showConfirmAlert();
                    var data = getDate();
                    localStorage.number = data.numbers;
                    localStorage.wordsDate = data.date;
                }else{
                    document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
                    document.getElementById('message_alert').innerHTML = '<span style="color:green"> <h4>Failed to upload to MAIN SAP. <br/>Please Contant Guy / Melusi</h4> </span> ';
                    document.getElementById('btn_alert').innerHTML = '<button onclick="closeConfirmAlert()" class="btn btn_btn">OK</button>';
                }
            },
            error:function(){
                document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
                document.getElementById('message_alert').innerHTML = '<span style="color:green"> <h4>Please check your Network connection !!!</h4> </span> ';
                document.getElementById('btn_alert').innerHTML = '<button onclick="closeConfirmAlert()" class="btn btn_btn">OK</button>';
            }
        });
      
});

//moving Billing files to MC files
function generate(){
    
    var filess = getJsonFiles();
    var files = JSON.parse(getJsonFiles());
   
    addNote(localStorage.id,'Generated Files','Files ID : ,MC-IAL : '+files.mc+',MC-HBIAL : '+files.hbmc+',BAR-IAL : '+files.bar+',BAR-HBIAL : '+files.hbbar);
    $.ajax({
        url:"assets/includes/apis/generateFiles.php",
        method:"POST",
        data: filess,
        success : function(data){
            var txt = '['+data+']',
            obj = JSON.parse(txt); //converting feedback to javascript object (JSON)
            if(obj[0].data == 1){
                $('#gen').prop("checked",true);
                $('#step1Content').slideToggle();       
                $('#step2Content').slideToggle();
                $('#generateContent').hide();
                runCheckBalances();
            }else{
                    $('#genFiles').css("background","rgba(230, 76, 76, 0.95)");
                    $('#generateContent').html("<p style='font-weight: bolder;color: white;'>Failed to generate Files. Please contact Oracle Team !!!.</p>");
             }
        },
        error  : function(err){
            document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
            document.getElementById('message_alert').innerHTML = '<span style="color:green"> <h4>Please check your Network connection !!!</h4> </span> ';
            document.getElementById('btn_alert').innerHTML = '<button onclick="closeConfirmAlert()" class="btn btn_btn">OK</button>';
        }
    });
}

//function to add notifications
function addNote(i,s,d){
    var obj = '{"id" : "'+i+'","subject" : "'+s+'","description" : "'+d+'"}';

    $.ajax({
        url:"assets/includes/apis/addNotification.php",
        method:"POST",
        data: obj,
        success : function(data){
            getUnreadNotifications();
        },
        error  : function(err){
            console.log("error");
        }
    });
}

//setting date in header
$('#fileDate').text(localStorage.FileDate);

//function to load on MINI SAP
function preUpload(){
    var selectedCheckboxes = checkboxSelectedLength();

    if(selectedCheckboxes != 2){
        document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/Error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
        document.getElementById('message_alert').innerHTML = '<span style="color:#a53131"> <h4>You need to Complete Steps 1 & 2</h4> </span> ';
        document.getElementById('btn_alert').innerHTML = '<button onclick="closeModal()" class="btn btn_btn">OK</button>';
        showConfirmAlert();
        $('#viewBalancess').prop("checked",false);

    }else{
        var filess = getJsonFiles();
        var files = JSON.parse(getJsonFiles());
        
        console.log(filess);
        console.log(files);
       
        $.ajax({
            url:"assets/includes/apis/preUpload.php",
            method:"POST",
            data: filess,
            success : function(data){
                var txt = '['+data+']',
                obj = JSON.parse(txt); //converting feedback to javascript object (JSON)

                console.log(obj);
                if(obj[0].data == 1){
                    $('#preUpload').prop("checked",true);
                    $('#step4Content').slideToggle();
                    $('#preUploadConent').hide();
                    addNote(localStorage.id,'Uploaded to Internal SAP','Files ID : ,MC-IAL : '+files.mc+',MC-HBIAL : '+files.hbmc+',BAR-IAL : '+files.bar+',BAR-HBIAL : '+files.hbbar);
                    checkBalanceAggregate();
                }else{
                    $('#preCard').css("background","rgba(230, 76, 76, 0.95)");
                    $('#preUploadConent').html("<p style='font-weight: bolder;color: white;'>Failed to Upload to Internal SAP Files. Please contact Oracle Team !!!.</p>");
                }
            },
            error  : function(err){
                document.getElementById('image_alert').innerHTML = '<img src="assets/images/icons/error.png" alt="" width="100px" style="margin-bottom:10px;"/>';
                document.getElementById('message_alert').innerHTML = '<span style="color:green"> <h4>Please check your Network connection !!!</h4> </span> ';
                document.getElementById('btn_alert').innerHTML = '<button onclick="closeConfirmAlert()" class="btn btn_btn">OK</button>';
            }
        });
    }
}
 
//function for loading to main SAP alert test
$('#uploadtomainsap').click(function(){
    alert('uploadtomainsap');
});

//functions to show panels
$('#step1').click(function(){
    $('#step1Content').slideToggle();
    $('#step2Content').hide();
    $('#step3Content').hide();
    $('#step4Content').hide();
});

$('#step2').click(function(){
    $('#step1Content').hide();
    $('#step2Content').slideToggle();
    $('#step3Content').hide();
    $('#step4Content').hide();
});

$('#step3').click(function(){
    $('#step1Content').hide();
    $('#step2Content').hide();
    $('#step3Content').slideToggle();
    $('#step4Content').hide();
});

$('#step4').click(function(){
    $('#step1Content').hide();
    $('#step2Content').hide();
    $('#step3Content').hide();
    $('#step4Content').slideToggle();
});
//functions for panels ended

function splitDate(value){
    var year = value.substring(0,4);
    var month = value.substring(4,6);
    var day = value.substring(6,8);

    return (year+"/"+month+"/"+day);
}

//function to load the file ids for SAP
function loadtoSap(){
   
    var datee = splitDate(localStorage.lastUploadDate);
    var lastUploadDate = parseDate(incrementDate(new Date(datee),1)).numbers;
    console.log("A : "+lastUploadDate+" B: "+localStorage.number+" C: "+localStorage.lastUploadDate+" D: "+incrementDate(new Date(parseInt(localStorage.lastUploadDate)),1))+" E: "+parseInt(localStorage.lastUploadDate);
    if(lastUploadDate < localStorage.number){
        $('#overlayRec').fadeIn(500);
        $('#confirm_alert_previous').show(500);
        document.getElementById('alertContent').innerHTML = "Files for this date <span style='color:black;'><i>("+makeDAte(lastUploadDate.toString())+")</i></span> are not done. <br/>Please finish them first";
    }else{
        window.location.href = 'upload.html';
        localStorage.jsonFiles = localStorage.jsonFilesTemp;
        localStorage.FileDate = localStorage.FileDateTemp;
    }
}

//back button to main notifications
function backToNotification(){
    window.location.href = 'notifications.html';
}

//function to update notification to read
function runAddNotification(){
    var param = getParams(window.location.href); 
    var id = param.id;
    
    $.ajax({
        url:"assets/includes/apis/updateNotification.php",
        method:"POST",
        data:'{"id":"'+id+'"}',
        success:function(){
            getUnreadNotifications();
        },
        error:function(){
            console.log("error");
        }
    });
}

//function to check all checkboxes
$('#checkall').change(function(){
    $('.checkitem').prop("checked",$(this).prop("checked"));
});


//function for viewing menu
$('#menu-slide').click(function(){
    $('.menu-list').slideToggle();
});

//checking number of unread notifications
getUnreadNotifications();

//function for checking unread Notifications
function getUnreadNotifications(){
    $.ajax({
        url:"assets/includes/apis/getUnreadNotifications.php",
        method:"POST",
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt), //converting feedback to javascript object (JSON)
                ans =  obj[0].data[0].ANS;

            if(ans > 0){
                document.getElementById('bardge').innerHTML = ans;
                $('#bardge').show();
            }else{
                $('#bardge').hide();
            }
        },
        error  : function(err){
        }
    });
}

function runPopulateNotifiactionDetails(){
    var param = getParams(window.location.href); 
    populateNotificationDetails(param);
}

function populateNotificationDetails(obj){
            
    $("#UserFname").text(obj.fname);
    $("#UserLname").text(obj.lname);
    $("#header-subject").text(obj.subject);
    $("#subjectNote").text(obj.subject);
    $("#descriptionNote").html((obj.description).split(',').join('<br/>'));
    $("#dateNote").text(obj.date);
}

//function for displaying all notifications
function loadNotifications(){
    
    var rows = "";

    $.ajax({
        url:"assets/includes/apis/getNotifications.php",
        method:"POST",
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt); //converting feedback to javascript object (JSON)
                
            if(obj[0].rows > 0){
              for(i=0;i<obj[0].rows;i++){


                if(obj[0].data[i].STATUS == 1){
                    rows += '  <a href="viewNotification.html?key=ecdsvsdIAUScbiUBASCOBAicubaicobOASbcASc564aSCASchCEIU09w0cbowceEWcwcwecvarbtywnyjsj6dhBSvregVERCercfERcfRecfRefCreFcERfcreFrEcfcvreGvERGVergVergvrGVcrGewCWCWEcBICEWCWCiGVUYVCwECEcwe896c1EcwecWvbiascASc6ascikabSCas6c95ascasc&status='+obj[0].data[i].STATUS+'&id='+obj[0].data[i].ID+'&fname='+obj[0].data[i].FIRST_NAME+'&lname='+obj[0].data[i].LAST_NAME+'&subject='+obj[0].data[i].SUBJECT+'&description='+obj[0].data[i].DESCRIPTION_NOTE+'&date='+(obj[0].data[i].ADDED_DATE).split('/').join('-')+'">'+
                                '<li class="notification-item unread">'+
                                    '<div class="notification-container">'+
                                        '<div class="subject">'+obj[0].data[i].SUBJECT+'</div>'+
                                        '<div class="description">'+(obj[0].data[i].DESCRIPTION_NOTE).substring(0,90)+'...'+
                                        '<span class="datetime" style="font-weight:bolder;">'+
                                             ((obj[0].data[i].ADDED_DATE).substring(0,10)).split('/').join('-')+'<br/>'+
                                             (obj[0].data[i].ADDED_DATE).substring(11,24)+
                                        '</span>'+
                                    '</div>'+
                                '</li>'+
                            '</a>';
                }else{
                    rows += '  <a href="viewNotification.html?key=ecdsvsdIAUScbiUBASCOBAicubaicobOASbcASc564aSCASchCEIU09w0cbowceEWcwcwecvarbtywnyjsj6dhBSvregVERCercfERcfRecfRefCreFcERfcreFrEcfcvreGvERGVergVergvrGVcrGewCWCWEcBICEWCWCiGVUYVCwECEcwe896c1EcwecWvbiascASc6ascikabSCas6c95ascasc&status='+obj[0].data[i].STATUS+'&id='+obj[0].data[i].ID+'&fname='+obj[0].data[i].FIRST_NAME+'&lname='+obj[0].data[i].LAST_NAME+'&subject='+obj[0].data[i].SUBJECT+'&description='+obj[0].data[i].DESCRIPTION_NOTE+'&date='+(obj[0].data[i].ADDED_DATE).split('/').join('-')+'">'+
                                '<li class="notification-item">'+
                                    '<div class="notification-container">'+
                                        '<div class="subject">'+obj[0].data[i].SUBJECT+'</div>'+
                                        '<div class="description">'+(obj[0].data[i].DESCRIPTION_NOTE).substring(0,90)+'...'+
                                        '<span class="datetime" style="font-weight:bolder;">'+
                                             ((obj[0].data[i].ADDED_DATE).substring(0,10)).split('/').join('-')+'<br/>'+
                                             (obj[0].data[i].ADDED_DATE).substring(11,24)+
                                        '</span>'+
                                    '</div>'+
                                '</li>'+
                            '</a>';
                }

              }
            }else{
                rows = '  '+
                                '<li class="">'+
                                    '<div class="notification-container">'+
                                        '<center><h2>No notifications</h2></center>'+
                                    '</div>'+
                                '</li>'+
                            '';
            }

            document.getElementById('notiList').innerHTML = rows;
        },
        error  : function(err){
        }
    });
}

//view check balance Tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

//get url data
function getParams(url) {
	 var params = {};
	 var parser = document.createElement('a');
	     parser.href = url;
	 var query = parser.search.substring(1);
	 var vars = query.split('&');
	 for (var i = 0; i < vars.length; i++) {
	 	var pair = vars[i].split('=');
	 	params[pair[0]] = decodeURIComponent(pair[1]);
	 }
    return params;
}

//table export
function doit(type, fn, dl) {
    var data = getDate();
    var elt = document.getElementById(fn);
    var wb = XLSX.utils.table_to_book(elt, {sheet:fn});
    var date1 = localStorage.FileDate.replaceAll('-',' ');
    var date2 = decrementDate(date1,1);
    console.log(date2);
    date3 = parseDate(date2); 
    console.log(date3);
    words = date3.date; 
    return dl ?
        XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
        XLSX.writeFile(wb, 'Balance Check for '+fn+' ('+words+') made in ('+data.date+').'+ (type || 'xlsx')  || ('test.' + (type || 'xlsx')));
}

function doitAll(type,fn, dl) {
    var data = getDate();
    var arrSheets = ["MC_HBIAL","BL_IAL","BL_HBIAL"];
    var elt = document.getElementById(fn);
    var wb = XLSX.utils.table_to_book(elt, {sheet:fn});
    var date1 = localStorage.FileDate.replaceAll('-',' ');
    var date2 = decrementDate(date1,1);
    console.log(date2);
    date3 = parseDate(date2); 
    console.log(date3);
    words = date3.date;     

    for(i=0;i<arrSheets.length;i++){
        addSheet(arrSheets[i],wb);
    }
    return dl ?
        XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
        XLSX.writeFile(wb, 'Balance Check for All ('+words+') made in ('+data.date+').'+ (type || 'xlsx')  || ('test.' + (type || 'xlsx')));
}

function addSheet(id,wb){
    var ws = XLSX.utils.table_to_sheet(document.getElementById(id));
    wb.SheetNames.push(id);
    wb.Sheets[id] = ws;
}

function tableau(pid, iid, fmt, ofile) {
    if(typeof Downloadify !== 'undefined') Downloadify.create(pid,{
            swf: 'downloadify.swf',
            downloadImage: 'download.png',
            width: 100,
            height: 30,
            filename: ofile, data: function() { return doit(fmt, ofile, true); },
            transparent: false,
            append: false,
            dataType: 'base64',
            onComplete: function(){ alert('Your File Has Been Saved!'); },
            onCancel: function(){ alert('You have cancelled the saving of this file.'); },
            onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); }
    });
}
// tableau('biff8btn', 'xportbiff8', 'biff8', 'test.xls');
// tableau('odsbtn',   'xportods',   'ods',   'test.ods');
// tableau('fodsbtn',  'xportfods',  'fods',  'test.fods');
// tableau('xlsbbtn',  'xportxlsb',  'xlsb',  'test.xlsb');
tableau('xlsxbtn',  'xportxlsx',  'xlsx',  'test.xlsx');

var _gaq = _gaq || [];
          _gaq.push(['_setAccount', 'UA-36810333-1']);
          _gaq.push(['_setDomainName', 'sheetjs.com']);
          _gaq.push(['_setAllowLinker', true]);
          _gaq.push(['_trackPageview']);
        
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function userProfilee(){
    $.ajax({
        url: "assets/includes/apis/getUserSessions.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                if(obj[0].rows > 0){
                    $('body').fadeIn(500);
                    $('#username').text(obj[0].data[0].FIRST_NAME);
                    $('#firstName').val(obj[0].data[0].FIRST_NAME);
                    $('#lastName').val(obj[0].data[0].LAST_NAME);
                    localStorage.fname = (obj[0].data[0].FIRST_NAME);
                    localStorage.lname = (obj[0].data[0].LAST_NAME);
                    localStorage.password = (obj[0].data[0].PASSWORD);
                    $('#userName').val(obj[0].data[0].USERNAME);
                }else{
                    window.location.href = "index.html";
                }
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}//close checkloginUser Function

function changePersonalDetails(){
    var fName = $('#firstName').val(),
        lName = $('#lastName').val(),
        id = localStorage.id;

        console.log("Name : "+fName+", Surname :"+lName+", id : "+id);
        localStorage.fname = fName;
        localStorage.lname = lName;

        var obj = '{"id":'+ id +',"fname" : "'+ fName +'","lname" : "'+ lName +'"}';
        updatedInfoo(fName,lName);
        $.ajax({
            url: "assets/includes/apis/updateUser/updateuserInfoo.php", 
            method: "POST",
            data : obj,
            success : function(data){
                var txt = '['+data+']',
                    obj = JSON.parse(txt);
                    if(obj[0].status > 0){
                        $('#updatedPassword').slideToggle();
                        setTimeout(function(){
                            $('#updatedPassword').slideToggle();
                            $( "#updatedPass" ).prop( "disabled", true ); //Disable 
                        },2000);
                    }else{
                        console.log("error");
                    }
            },//close success function
            error:function(){
            }//close error function
        });//close ajax function
}

function changePassword(){
    var old = $('#oldPass').val(),
        newPass = $('#newPass').val(),
        cPass = $('#cPass').val(),
        id = localStorage.id;
        localStorage.password = newPass;

    var obj = '{"id":'+ id +',"password" : "'+ newPass +'"}';
    updatedPassword(newPass);
    $.ajax({
        url: "assets/includes/apis/updateUser/updatePassword.php", 
        method: "POST",
        data : obj,
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);
                if(obj[0].status > 0){
                    $('#updatedPassword').slideToggle();
                    setTimeout(function(){
                        $('#updatedPassword').slideToggle();
                        $('#oldPass').val("");
                        $('#newPass').val("");
                        $('#cPass').val("");
                        $("#succNewPass" ).hide();
                        $("#succcPass" ).hide();
                        $("#oldPass" ).css("background-color" , "transparent");
                        $("#newPass" ).css("background-color" , "transparent");
                        $("#cPass" ).css("background-color" , "transparent");
                        $("#succOldPass" ).hide();
                        $( "#updatedPass" ).prop( "disabled", true ); //Disable 
                    },2000);
                }else{
                    console.log("error");
                }
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}

function updatedPassword(password){
    $.ajax({
        url: "assets/includes/apis/checks/checkSession.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);

            obj[0].data[0].PASSWORD = password;
            var newObj = (JSON.stringify(obj)).substring(1,(JSON.stringify(obj)).length-1);
            $.ajax({
                url: "assets/includes/apis/updateUser/updateuserSession.php",
                method:"POST",
                data : newObj,
                success : function(newData){
                        userProfilee();
                },//close success function
                error:function(){
                }//close error function
            });//close ajax function
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}

function updatedInfoo(fname,lname){
    $.ajax({
        url: "assets/includes/apis/checks/checkSession.php", 
        success : function(data){
            var txt = '['+data+']',
                obj = JSON.parse(txt);

            obj[0].data[0].FIRST_NAME = fname;
            obj[0].data[0].LAST_NAME = lname;

            var newObj = (JSON.stringify(obj)).substring(1,(JSON.stringify(obj)).length-1);
            $.ajax({
                url: "assets/includes/apis/updateUser/updateuserSession.php",
                method:"POST",
                data : newObj,
                success : function(newData){
                        userProfilee();
                },//close success function
                error:function(){
                }//close error function
            });//close ajax function
        },//close success function
        error:function(){
        }//close error function
    });//close ajax function
}

$("#firstName,#lastName").keyup(function(){
    var fName = $('#firstName').val(),
        lName = $('#lastName').val(),  
        id = localStorage.id;

    if(fName == localStorage.fname && lName == localStorage.lname){
        $( "#updatePersonalD" ).prop( "disabled", true ); //Disable 
    }else{
        $( "#updatePersonalD" ).prop( "disabled", false ); //Disable 
    }
});

$("#oldPass,#newPass,#cPass").keyup(function(){
    var old = $('#oldPass').val(),
        newPass = $('#newPass').val(),
        cPass = $('#cPass').val(),
        id = localStorage.id;

    if((old != localStorage.password)){
        $( "#updatedPass" ).prop( "disabled", true ); //Disable 
    }else{
        if(newPass == cPass && cPass.length != 0){
            $( "#newPass" ).css("background-color" , "#0080006b");
            $( "#cPass" ).css("background-color" , "#0080006b");
            $("#errorNewPass" ).hide();
            $("#succNewPass" ).show();
            $("#errorcPass" ).hide();
            $("#succcPass" ).show();
            $( "#updatedPass" ).prop( "disabled", false ); //Disable 
        }else{
            if(cPass.length != 0){
                $("#errorNewPass" ).show();
                $("#succNewPass" ).hide();
                $("#errorcPass" ).show();
                $("#succcPass" ).hide();
                $( "#newPass" ).css("background-color" , "#ff000040");
                $( "#cPass" ).css("background-color" , "transparent");
                $( "#updatedPass" ).prop( "disabled", true ); //Disable 
            }
        }
    }

    if(old.length == (localStorage.password).length){
        if(old != localStorage.password){
            
                $("#oldPass" ).css("background-color" , "#ff000040");
                $("#errorOldPass" ).show();
                $("#succOldPass" ).hide();
                $( "#newPass" ).prop( "disabled", true ); //Disable 
                $( "#cPass" ).prop( "disabled", true ); //Disable 
        }else{
            
            $("#errorOldPass" ).hide();
            $("#succOldPass" ).show();
            $( "#oldPass" ).css("background-color" , "#0080006b");
            $( "#newPass" ).prop( "disabled", false ); //Disable 
            $( "#cPass" ).prop( "disabled", false ); //Disable 
        }
    }else{
        
        $("#errorOldPass" ).show();
        $("#succOldPass" ).hide();
        $( "#oldPass" ).css("background-color" , "#ff000040");
        $( "#newPass" ).prop( "disabled", true ); //Disable 
        $( "#cPass" ).prop( "disabled", true ); //Disable 
    }
});

/* tooltip  */

$('[data-toggle="tooltip"]').tooltip();   

/* end tooltip script */
