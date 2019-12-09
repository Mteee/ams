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

    var tabs = {
        prev: -1,
        current: 0,
        next: 1
    };

    function nextTab(curr, next) {
        if (curr < next) {
            return true;
        }
        return false;
    }

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
            asset_serial_no: {
                required: true,
            },
            room_no_new: {
                required: true
            },
            classification_name: {
                required: true
            },
            purchase_date: {
                required: true
            },
            warranty_date: {
                required: true
            },
            disposal_date: {
                required: true
            },
            service_date: {
                required: true
            },
            service_due_date: {
                required: true
            },
            serviced_by: {
                required: true
            }

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

        onNext: function (tab, navigation, index, next) {
            console.log("================[onNext]=======================");
            console.log(tab);
            console.log(navigation);
            console.log(index);



            var input_arr = $('#asset_group input');
            var input_date_fields = $('#date input');
            var input_date_service = $('#service input');

            if (index == 1) {
                var $valid = $('#basic input').valid();

                if (!$valid) {
                    $validator.focusInvalid();
                    $('#text-error').addClass("btn-outline-danger");
                    check_error(index);
                    Toast();
                    return false;
                } else {
                    $('#text-error').removeClass("btn-outline-danger");
                    $("#room_no_new").addClass("btn-outline-info").removeClass("btn-outline-danger");
                }
            }

            if (index == 2) {
                var res = validateInputChildren(input_date_fields);
                console.log("res");
                console.log(res);
                if (res.bool) {
                    input_arr[res.index].focus();
                    $('#text-error').addClass("btn-outline-danger");
                    check_error(index);
                    Toast();
                    return false;
                }
                else {
                    $("#date_group_1").removeClass("border-danger").addClass("border-secondary");
                    $("#date_group_2").removeClass("border-danger").addClass("border-secondary");
                }
            }

            if (index == 3) {
                var res = validateInputChildren(input_date_service);
                console.log("res");
                console.log(res);
                console.log("index");
                // console.log();
                $("#add_room_group").removeClass("is-empty")
                $("#add_room").val($("#room_new_filter").val());

                if (res.bool) {
                    input_arr[res.index].focus();
                    $('#text-error').addClass("btn-outline-danger");
                    check_error(index);
                    Toast();
                    return false;
                }

                else {
                    $('#text-error').addClass("btn-outline-danger");
                    $("#date_group_3").removeClass("border-danger").addClass("border-secondary");
                    $("#date_group_4").removeClass("border-danger").addClass("border-secondary");
                }
            }

            if (index == 4) {

                var res = validateInputChildren(input_arr);
                var model_validate = isEmpty($("#model_input").val())
                var asset_type = isEmpty($("#asset_type option:selected").val());
                console.log($("#model_input").val());
                console.log($("#asset_type option:selected").val());
                console.log("res");
                console.log(res);
                console.log(model_validate);
                console.log("asset_type");
                console.log(asset_type);
                if (res.bool || model_validate || asset_type) {
                    input_arr[res.index].focus();
                    $('#text-error').addClass("btn-outline-danger");
                    Toast();
                    return false;
                }
            }


            // else if (index == 2) {
            //     var res = validateInputChildren(input_date_fields);
            //     console.log("res");
            //     console.log(res);
            //     if (res.bool) {
            //         // input_arr[res.index].focus();
            //         // $("#text-error").text("Please choose room");
            //         $('#text-error').addClass( "text-danger" );
            //         $( "#date_group_1" ).removeClass( "border-secondary" ).addClass( "border-danger" );
            //         $( "#date_group_2" ).removeClass( "border-secondary" ).addClass( "border-danger" );
            //         return false;
            //     }
            // }

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

        onTabClick: function (tab, navigation, index, next) {

            console.log("==============[onTabClick]==============");
            console.log(tab);
            console.log(navigation);
            console.log("current " + index);

            if (index !== 4) {
                console.log("next " + next);

                if (next > index) {
                    console.log("forward");
                }
                else if (next < index) {
                    console.log("backwards");
                    // return true;
                }

                if (next > index + 1) {
                    return false;
                }

                if (nextTab(index, next)) {
                    console.log("getTabId(index)");
                    console.log(getTabId(index));
                    var $valid = $('#' + getTabId(index) + ' input').valid();
                    console.log($valid);
                    if (!$valid) {
                        console.log(index);
                        console.log("here");
                        console.log(next);
                        check_error(next);
                        return false;
                    }
                }
            }

        },

        onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;


            console.log("=============[onTabShow]==============");
            console.log(tab);
            console.log(navigation);
            console.log(index);

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

    function getTabId(value) {
        var arrTabs = [
            "basic",        // 0
            "date",         // 1
            "service",      // 2
            "serail",       // 3
            "commissioning" // 4
        ];

        return arrTabs[value];

    }


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

    function check_error(value) {
        switch (value) {
            case 1:
                $("#room_no_new").removeClass("btn-outline-info").addClass("btn-outline-danger");
                break;
            case 2:
                $("#date_group_1").removeClass("border-secondary").addClass("border-danger");
                $("#date_group_2").removeClass("border-secondary").addClass("border-danger");
                break;
            case 3:
                $("#date_group_3").removeClass("border-secondary").addClass("border-danger");
                $("#date_group_4").removeClass("border-secondary").addClass("border-danger");
                break;
        }
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

function Toast() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Toast.fire({
        type: 'error',
        title: 'Every field is required!',
        // html: "<strong><p class='py-2 text-muted' style='text-size:16px;'>Please double check if your fields are valid and not empty</p></strong>"
    })
}


