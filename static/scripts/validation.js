

$(function() {
    // Url: https://stackoverflow.com/questions/52159649/jquery-validation-plugin-and-bootstrap-4
    // Author: Josh Bernfeld
    jQuery.validator.setDefaults({
        // Change default error element from <label> to <span>
        errorElement: 'span',
        
        errorPlacement: function(error, element) {
        
            // Check for parent element and add the class 'invalid-feedback' from bootstrap,
            // then append the error

            error.addClass("invalid-feedback");
            element.closest(".form-group").append(error);
        },
        highlight: function(element) {
            // On highlight, add the class 'is-invalid'
            $(element).addClass("is-invalid invalid-box");
        },
        unhighlight: function(element) {
            // On unhighlight, remove the class 'is-invalid'
            $(element).removeClass("is-invalid invalid-box");
        }
    });

    // Set up a bunch of validation rules for registration form
    $("#reg_form").validate({
        rules: {
            email: {
                // Set required to true, type to email, white space not allowed
                required: true,
                email: true,
                nowhitespace: true,
                
                // Url: https://stackoverflow.com/questions/15438524/object20object-validation-plugin-flask
                remote: {
                    // Check if email exists with route @_check_email and look in db
                    url: "_check_email",
                    data: {
                        email: function() {
                            // Returns true or false
                            return $("#email").val();
                        }
                    }
                }
            },
            // Password rules
            password: 'required',
            confirm_pass: {
                required: true,
                // Make sure confirm_pass == password
                equalTo: "#password"
            },
            // display_name rules
            display_name: {
                required: true,
                nowhitespace: true
            }
        },
        
        // Error messages that will be displayed
        messages: {
            // Replacement error for email.
            email: {
                required: 'Please enter an email address.',
                email: 'Please enter a <em>valid</em> email address.',
                remote: 'Email already registered. Already an existing user? <a href="/login">Log in<a>'
            }
        }
    });

    $('#join_form').validate({
        rules: {
            guestName: {
                required: true,
                nowhitespace: true
            },
            code: {
                required: true,
                nowhitespace: true,
                maxlength: 6,
                minlength: 6
            }
        }
    });

});