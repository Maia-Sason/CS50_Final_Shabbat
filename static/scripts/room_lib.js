
$("#roomDate").flatpickr({
    enableTime: true,
    minDate: "today",
    dateFormat: "Z",
   
    
});




// Multistep form functionality referenced from w3schools.com
// URL: https://www.w3schools.com/howto/howto_js_form_steps.asp
var currentTab_create = 0

var selectedBless = []

showTab(currentTab_create);

function showTab(n) {

    // sets up var to set the display mode to block
    var x = document.getElementsByClassName("tab2");
    // The nth 'tab' is displayed
    x[n].style.display = "block";

    if (n==0) {
        $('#back-create').hide();
    } else {
        $('#back-create').show();
    }

    if (n == (x.length - 1)) {
        $('#next-create').html('Create')
    } else {
        $('#next-create').html('Next')
    }
}

function nextPrev(n) {
    var x = document.getElementsByClassName("tab2");

    // If n == 1 and form is not validated, return false
    if (n == 1 && !validateForm()) {
        return false;
    }

    x[currentTab_create].style.display = 'none';

    currentTab_create = currentTab_create + n;

    if (currentTab_create >= x.length) {
        var roomDict = {
            rname : $("#roomName").val(),
            rdate : $("#roomDate").val(),
            rlist: selectedBless
        }

        // ajax call in here
        let js_data = JSON.stringify(roomDict)

        $.ajax({
            url : "/_create_room",
            type : 'post',
            contentType : "application/json",
            dataType : 'json',
            data: js_data,
            success: function (data) {
                location.reload();
            }
        })
        
    }
    
    showTab(currentTab_create)
    console.log(currentTab_create)
}

function validateForm() {
    var x, y, valid = true;
    // validate

    // x is all elements by class tab, y is all elements by class input
    // in current tab
    x = document.getElementsByClassName('tab2');
    y = x[currentTab_create].getElementsByTagName('input');

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

        // If tab is where the bless blocks are
        if ($('.tab2:eq('+currentTab_create+')').hasClass('bless_selection')) {
            // If selectedBless list is empty, set valid to false
            if (selectedBless.length == 0 ) {
                valid = false;
                // Add red outline to show that it needs to be selected
                $('.btn-bless').addClass(" outline-red")
                
            }
        }
    
    return valid;


}

$("#modalCreate").on("hidden.bs.modal", function () {
    location.reload();
});

$(document).ready(function () {

    $('.room_selected').on('click', function() {
        let current_room = $(this)
        
        let room_data = {'room_id' : $(this).attr('room-value')};
        console.log(room_data)

        let json_data = JSON.stringify(room_data)
        
        $.ajax({
            url : '/_load_room_settings',
            type : 'post',
            contentType : "application/json",

            dataType : 'json',
            data : json_data,
            success : function(data) {

                $('#room-title').html('Room Name: ' + data.name),
                $('#room-code').html('Room Code: ' + data.code),
                // $('#room-date').html('Room Date: ' + data.date),
                $('#_hidden-code').val("https://shareshabbat.herokuapp.com/ code " + data.code),
                $("#room-id").val(data.id)
            }
        })

        $('#delete').on('click', function() {
            

            $.ajax({
                url : '/_delete_room',
                type : 'post',
                contentType : "application/json",

                dataType : 'json',
                data : json_data,
                
            })

            current_room.slideUp()
        })
    })
    
})


$(document).ready( ()=> {
    $.ajax({
                url : '/_load_bless_list',
                type : 'get',
                contentType : "application/json",

                dataType : 'json',
                success : function(data) {
                    // figure this out
                    for (let i = 0; i < data.length; i++) {
                        console.log('id ' + data[i].id + ', name ' + data[i].name)
                        $('.bless_list').append("<li><div id=' " +(data[i].id)+ "' bless-value='" + (data[i].id) + "' class='btn-bless bless bless_normal'><marquee behavior='scroll' scrolldelay='300' direction='left' class='bless_title'>"+ (data[i].name) +"</marquee></div></li")
                    }

                    console.log(data)
                }
            })
})


function copy() {
    let copyText = document.querySelector('#_hidden-code')
    copyText.select()
    document.execCommand('copy');
    alert('Room code copied!')
}
document.querySelector("#copy").addEventListener("click", copy);

$(document).ready(function() {
    // Set up the confirmation page
    // On nextbtn click list = ""
    $("#next-create").on("click", function () {
        var  list = "";
        // add these to list as they are updated
        list += "<li>" + "Name: " + $("#roomName").val() + "</li>";
        list += "<li>" + "Date and time: " + $("#roomDate").val() + "</li>";
        list += "<li>" + "Number of Bless Blocks: " + selectedBless.length + "</li>";
        
        // Display list to html where tab id== "confirmation"
        $("#confirmation").html(list);
        console.log(selectedBless)
    })
})

// On btnbless click set blessVal to the value of this button
$(".bless_list").on('click', 'div', function() {
    let blessVal = ($(this).attr('bless-value'));
    // If this btnbless has the class 'selected'
    let blessthis = $(this)
    if ($(this).hasClass("selected")) {
        // replace the color to outline color and remove 'selected'
        $(this).removeClass('selected');
        $(this).find('div').fadeOut(300, function () {
            blessthis.find('div').remove()
        })
        
        
        // remove blessings from list in correct order
        selectedBless.splice(selectedBless.indexOf(blessVal), 1 );
    
    } else {
        // Else, add bless to back of the list (it must not be in the list if it doesn't have selected)
        $(this).addClass('selected').append('<div class="order"><p style="display:none" class="num"></p></div>');
        selectedBless.push($(this).attr('bless-value'));
    }
    console.log(selectedBless)
    
    // Go through each of the .btnbless buttons and if they have the class 'selected'...
    $(".btn-bless").each(function() {
        if ($(this).hasClass("selected")) {
            // Set the button to display the index of the value when it entered the list
            $(this).find(".num").html(selectedBless.indexOf($(this).attr('bless-value')) + 1).fadeIn(300);
        } 
        // else {
        //     // Else set the button to display the valueid which is the name of the blessing
        //     $(this).find(".num").html($(this).attr("valueid"));
        // }
    });


});

$(document).ready(function () {
    let number = $(".shabbat").length
    $("#amount_rooms").html(number + "/10")

    if (number >= 10) {
        $('#room_create_new').css('visibility','hidden')
    } else {
        $('#room_create_new').show()
    }
})

// nav bar
$(document).ready(function () {
    $('.item').removeClass('active')
    $('.rooms-item').addClass('active')
})
