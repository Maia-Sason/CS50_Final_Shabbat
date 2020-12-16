

$(function() {
    // url: https://stackoverflow.com/questions/52159649/jquery-validation-plugin-and-bootstrap-4
    // author: Josh Bernfeld
    jQuery.validator.setDefaults({
        errorElement: 'span',
        errorPlacement: function(error, element) {
            error.addClass("invalid-feedback");
            element.closest(".form-group").append(error);
        },
        highlight: function(element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function(element) {
            $(element).removeClass("is-invalid");
        }
    });

    $("#reg_form").validate({
        rules: {
            email: {
                required: true,
                email: true,
                nowhitespace: true,
                
                // url: https://stackoverflow.com/questions/15438524/object20object-validation-plugin-flask
                remote: {
                    url: "_check_email",
                    data: {
                        email: function() {
                            return $("#email").val();
                        }
                    }
                }
                
            
                
                
            },
            password: 'required',
            confirm_pass: {
                required: true,
                equalTo: "#password"
            },
            display_name: {
                required: true,
                nowhitespace: true

            }
        },
        
        messages: {
            email: {
                required: 'Please enter an email address.',
                email: 'Please enter a <em>valid</em> email address.',
                remote: 'Email already registered. Already an existing user? <a href="/login">Log in<a>'
            }
        }
    });

});