// Multistep form functionality referenced from w3schools.com
// URL: https://www.w3schools.com/howto/howto_js_form_steps.asp

    // preview bless blocks
    $(document).ready(function () {
        $('.bless').on('click', function() {
            $('.tab').hide();
            let currentTab = 0;
        

            currentTab = 0;

            

            showTab(currentTab);

            function showTab(n) {
                let x = $('.tab');

                $('.tab:eq('+currentTab+')').show();

                console.log("this is show tab " + currentTab)

                if (n == 0) {
                    $("#back").hide();
                } else {
                    $('#back').show();
                }

                if (n == (x.length - 1)) {
                    $("#next").hide();
                } else {
                    $('#next').show();
                }
            }

            $('#next').on('click', function() {
                nextPrevClick(1);
                $('.tab').hide();
                showTab(currentTab);
                console.log("this is" + currentTab)      
            })

            $('#back').on('click', function() {
                nextPrevClick(-1);
                $('.tab').hide();
                showTab(currentTab);     
            })

            function nextPrevClick(n) {
            
                $('.tab:eq('+currentTab+')').hide();

                currentTab = currentTab + n;

                console.log(currentTab)

            }
        })

    })

    // create bless blocks
    $(document).ready(function () {
        
        $('#create-btn').on('click', function() {
            $('#create-create').unbind('click');
            $('#next-create').unbind('click');
            $('#back-create').unbind('click');

            console.log(currentTab_create)
            function nextPrevClick(n, currentTab) {
            
                let x = $('.tab2');

                if (n == 1 && !validateForm()) {
                    return false;
                    
                }

                console.log($('#next-create').val())

                $('.tab2:eq('+currentTab_create+')').hide();

                currentTab_create += n;

                console.log(currentTab_create)

            }

            $('.tab2').hide();
            
            var currentTab_create = 0;

            showTab(currentTab_create);

            function showTab(n) {
                let x = $('.tab2');

                $('.tab2:eq('+currentTab_create+')').show();

                if (n == 0) {
                    $("#back-create").hide();
                } else {
                    $('#back-create').show();
                }

                if (n == (x.length - 1)) {
                    $("#next-create").hide()
                    $("#create-create").show()
             
                } else {
                    $('#next-create').show()
                    $('#create-create').hide()
                }
            }

            $('#next-create').on('click', function() {
                let x = 1;
                nextPrevClick(x);
                $('.tab2').hide();
                showTab(currentTab_create);
            })

            $('#back-create').on('click', function() {
                let x = -1;
                nextPrevClick(x);
                $('.tab2').hide();
                showTab(currentTab_create);     
            })

            $('#create-create').on('click', function () {
                x = 1
                nextPrevClick(x)

                if ($('#meaning-create').val() != "") {
                    let blessdict = {
                        bname : $("#title-block").val(),
                        bheb : $("#heb-create").val(),
                        beng : $("#eng-create").val(),
                        beng_heb : $("#eng-heb-create").val(),
                        bmeaning : $("#meaning-create").val()
                    }

                    let js_data = JSON.stringify(blessdict)

                    $.ajax({
                        url : "/_create_bless",
                        type : 'post',
                        contentType : "application/json",
                        dataType : 'json',
                        data: js_data,
                        success: function (data) {
                            console.log(data.id);
                            location.reload();
                        }
                    })
                    

                    return false;

                }

            })

            function validateForm() {
                // By default valid is true
                let x, y, z, valid = true;
                
                // x is all elements by class tab, y is all elements by class input
                // in current tab
                x = document.getElementsByClassName('tab2');
                y = x[currentTab_create].getElementsByTagName('input');
                z = x[currentTab_create].getElementsByTagName('textarea')

                // While i is less than the length of the inputs
                for (let i = 0; i < y.length; i++) {

                    // If the ith input is nothing
                    if (y[i].value == "") {
                        // if not already class invalid
                        if (y[i].className != " invalid-box") {
                            // add class invalid
                            y[i].className += " invalid-box";
                        }
                        // Change valid to false
                        valid = false;
                        
                    }

                    if (y[i].value != "") {
                        y[i].classList.remove('invalid-box')

                    }
                }

                // While i is less than the length of the inputs
                for (let i = 0; i < z.length; i++) {

                    // If the ith input is nothing
                    if (z[i].value == "") {
                        // if not already class invalid
                        if (z[i].className != "invalid-box") {
                            // add class invalid
                            z[i].className += " invalid-box";
                        }
                        

                        console.log(z[i].classList)
                        // Change valid to false
                        valid = false;
                        
                    }

                    if (z[i].value != "") {
                        z[i].classList.remove('invalid-box')

                    }
                }

                return valid;
            }


        })

    })

    $(document).ready(function () {
        $('.item').removeClass('active')
        $('.blocks-item').addClass('active')
    })

    $(document).ready(function () {
        $('#preset-btn').on('click', function () {
            $('#custom').fadeOut(300).slideUp().delay(300);
            $('#preset').delay(300).fadeIn(300).slideDown();
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
        })
        $('#custom-btn').on('click', function () {
            $('#preset').fadeOut(300).slideUp().delay(300);
            $('#custom').delay(300).fadeIn(300).slideDown();
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
           

        })
    })

    $(document).ready(function () {
        
        $('.bless').on('click', function() {
            $('#delete').unbind();
            

            current_bless = $(this)
            let block_data = undefined
            block_data = {bless_id : $(this).attr('bless-value')};
            let json_data = JSON.stringify(block_data)

            console.log(block_data)

            if ($(this).hasClass('custom_bless')) {
                $("#delete").show()
            } else {
                $("#delete").hide()
            }
            
            $.ajax({
                url : '/_load_bless_settings',
                type : 'post',
                contentType : "application/json",

                dataType : 'json',
                data : json_data,
                success : function(data) {
                    // load all bless data into html
                    $('#title').html(data.name)
                    $('#heb').html(data.hebrew)
                    $('#eng').html(data.english)
                    $('#eng-heb').html(data.transliteration)
                    $('#meaning').html(data.meaning)
                    
                }
            })

            $('#delete').on('click', function() {
                if (current_bless.hasClass('custom_bless')) {
                $.ajax({
                    url : '/_delete_bless',
                    type : 'post',
                    contentType : "application/json",

                    dataType : 'json',
                    data : json_data,
                    success : function(data) {
                        console.log('deleted ' + data.id)
                        current_bless.slideUp()
                    }
                    
                })
                }
            })
        })
        
    })