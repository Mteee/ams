/*!

 =========================================================
 * Material Bootstrap Wizard - v1.0.2
 =========================================================
 
 * Product Page: https://www.creative-tim.com/product/material-bootstrap-wizard
 * Copyright 2017 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-bootstrap-wizard/blob/master/LICENSE.md)
 
 =========================================================
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// Material Bootstrap Wizard Functions

var searchVisible = 0;
var transparent = true;
var mobile_device = false;

$(document).ready(function () {

    $.material.init();

    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();

    // $('.my_required').each(function () {
    //     $(this).rules("add",{
    //         required: true 

    //     })
    // });



    // Code for the Validator
    var $validator = $('.wizard-card form').validate({
        rules: {
            "category[]": "required",

            asset_number: {
                required: true,
            },
            asset_description: {
                required: true,
            },
            // email: {
            //   required: true,
            //   minlength: 3,
            // },
            asset_class: {
                required: true,
            },
            room_no_dropdown: {
                required: true,
                minlength: 2,
            },
            classification_name:{
                required: true,
                minlength: 2,
            },
            purchase_date:{
                required: true,
            },
            warranty_date:{
                required: true,
            },
            disposal_date:{
                required: true,
            },
            service_date:{
                required: true,
            },
            service_due_date:{
                required: true,
            },
            serviced_by:{
                required: true,
            },

        },

        errorPlacement: function (error, element) {
            $(element).parent('div').addClass('has-error');
        }
    });

    // Wizard Initialization
    $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',
        'nextSelector': '.btn-next',
        'previousSelector': '.btn-previous',

        onNext: function (tab, navigation, index) {

            var $valid = $('.wizard-card form').valid();
            var input_arr = $('#asset_group input');
            var input_date_fields = $('#date input');
            var input_date_service = $('#service input');

            if (index == 4){
                var res = validateInputChildren(input_arr);
                console.log("res");
                console.log(res);
                if (res.bool) {
                    input_arr[res.index].focus();
                    $('#text-error').addClass( "btn-outline-danger" );
                    return false;
                }
            }else
            if (index == 2){
                var res = validateInputChildren(input_date_fields);
                console.log("res");
                console.log(res);
                if (res.bool) {
                    input_arr[res.index].focus();
                    $('#text-error').addClass( "btn-outline-danger" );
                    $( "#date_group_1" ).removeClass( "border-secondary" ).addClass( "border-danger" );
                    $( "#date_group_2" ).removeClass( "border-secondary" ).addClass( "border-danger" );
                    return false;
                }
                else{
                    $( "#date_group_1" ).removeClass( "border-danger" ).addClass( "border-secondary" );
                    $( "#date_group_2" ).removeClass( "border-danger" ).addClass( "border-secondary" );
                }
            }

            if (index == 3){
                var res = validateInputChildren(input_date_service);
                console.log("res");
                console.log(res);
                if (res.bool) {
                    input_arr[res.index].focus();
                    $('#text-error').addClass( "btn-outline-danger" );
                    $( "#date_group_3" ).removeClass( "border-secondary" ).addClass( "border-danger" );
                    $( "#date_group_4" ).removeClass( "border-secondary" ).addClass( "border-danger" );
                    return false;
                }
                
                else{
                    $( "#date_group_3" ).removeClass( "border-danger" ).addClass( "border-secondary" );
                    $( "#date_group_4" ).removeClass( "border-danger" ).addClass( "border-secondary" );
                }
            }
            else if (index == 1) {
                console.log(index);
                if (($('#room_new_filter').text()).indexOf("ROOM") > -1 ){
                    $( "#room_new_filter" ).removeClass( "btn-outline-info" ).addClass( "btn-outline-danger" );
                    return false;
                }
                var selectedValue = parseInt($('#asset_class').children("option:selected").val());
                if(selectedValue < 2){
                    $( "#room_new_filter" ).removeClass( "btn-outline-info" ).addClass( "btn-outline-danger" );
                    return false;
                }
            }

            else {
                if (!$valid) {
                    $validator.focusInvalid();
                    return false;
                }
            }
        },

        onInit: function (tab, navigation, index) {
            //check number of tabs and fill the entire row
            var $total = navigation.find('li').length;
            var $wizard = navigation.closest('.wizard-card');

            $first_li = navigation.find('li:first-child a').html();
            $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
            $('.wizard-card .wizard-navigation').append($moving_div);

            refreshAnimation($wizard, index);

            $('.moving-tab').css('transition', 'transform 0s');
        },

        onTabClick: function (tab, navigation, index) {
            var $valid = $('.wizard-card form').valid();

            if (!$valid) {
                return false;
            } else {
                return true;
            }
        },

        onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;

            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead
            if ($current >= $total) {
                $($wizard).find('.btn-next').hide();
                $($wizard).find('.btn-finish').show();
            } else {
                $($wizard).find('.btn-next').show();
                $($wizard).find('.btn-finish').hide();
            }

            button_text = navigation.find('li:nth-child(' + $current + ') a').html();

            setTimeout(function () {
                $('.moving-tab').text(button_text);
            }, 150);

            var checkbox = $('.footer-checkbox');

            if (!index == 0) {
                $(checkbox).css({
                    'opacity': '0',
                    'visibility': 'hidden',
                    'position': 'absolute'
                });
            } else {
                $(checkbox).css({
                    'opacity': '1',
                    'visibility': 'visible'
                });
            }

            refreshAnimation($wizard, index);
        }
    });


    function validateInputChildren(a) {
        var response = {
             "bool": false,
             "index": 0
        };



        for (i = 0; i < a.length; i++) {
            if (isEmpty(a[i].value)) {
                response.bool = true;
                response.index = i;
                break;
            }


              
        }

        console.log("response");
        console.log(response);

      
        return response;
      
       
    }

    function isEmpty(a) {
        if (a == undefined || a == ' ' || a == " " || a == "" || a == '' || a == null) {
            return true;
        }

        return false;
    }

    // Prepare the preview for profile picture
    $("#wizard-picture").change(function () {
        readURL(this);
    });

    $('[data-toggle="wizard-radio"]').click(function () {
        wizard = $(this).closest('.wizard-card');
        wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
        $(this).addClass('active');
        $(wizard).find('[type="radio"]').removeAttr('checked');
        $(this).find('[type="radio"]').attr('checked', 'true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).find('[type="checkbox"]').removeAttr('checked');
        } else {
            $(this).addClass('active');
            $(this).find('[type="checkbox"]').attr('checked', 'true');
        }
    });

    $('.set-full-height').css('height', 'auto');

});



//Function to show image before upload

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(window).resize(function () {
    $('.wizard-card').each(function () {
        $wizard = $(this);

        index = $wizard.bootstrapWizard('currentIndex');
        refreshAnimation($wizard, index);

        $('.moving-tab').css({
            'transition': 'transform 0s'
        });
    });
});

function refreshAnimation($wizard, index) {
    $total = $wizard.find('.nav li').length;
    $li_width = 100 / $total;

    total_steps = $wizard.find('.nav li').length;
    move_distance = $wizard.width() / total_steps;
    index_temp = index;
    vertical_level = 0;

    mobile_device = $(document).width() < 600 && $total > 3;

    if (mobile_device) {
        move_distance = $wizard.width() / 2;
        index_temp = index % 2;
        $li_width = 50;
    }

    $wizard.find('.nav li').css('width', $li_width + '%');

    step_width = move_distance;
    move_distance = move_distance * index_temp;

    $current = index + 1;

    if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
        move_distance -= 8;
    } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
        move_distance += 8;
    }

    if (mobile_device) {
        vertical_level = parseInt(index / 2);
        vertical_level = vertical_level * 38;
    }

    $wizard.find('.moving-tab').css('width', step_width);
    $('.moving-tab').css({
        'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

    });
}

materialDesign = {

    checkScrollForTransparentNavbar: debounce(function () {
        if ($(document).scrollTop() > 260) {
            if (transparent) {
                transparent = false;
                $('.navbar-color-on-scroll').removeClass('navbar-transparent');
            }
        } else {
            if (!transparent) {
                transparent = true;
                $('.navbar-color-on-scroll').addClass('navbar-transparent');
            }
        }
    }, 17)

}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};