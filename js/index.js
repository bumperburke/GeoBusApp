/*
*   Summary: This class is used to handle the login and register functionality
*/

//Initially hide the alert popups
$('#failAlert').hide();
$('#registerSuccessAlert').hide();
$('#registerFailAlert').hide();
//disable the page load error message as it was causing a problem
$.mobile.pageLoadErrorMessage = "";

//Onclick function to handle login button click
$('#loginButton').click(function () {
    var passwordStrengthRegex = /((?=.*d)(?=.*[a-z])(?=.*[A-Z]).{6,12})/gm; //the regex for passwords to match
    var email = $("#email").val(); //assign the email to a variable
    var pword = $("#password").val(); //assign the password to a variable
        
    if(!pword.match(passwordStrengthRegex) && pword.length !== 0){ //if the pass does not match regex and password is not empty
        //set alert popup text and call hideShowAlert
        $('#failAlert').html("<center>Password Rules: 6-12 Characters & At Least 1 Uppercase, 1 Lowercase, 1 Number.</center>");
        hideShowAlert($('#failAlert'));
    }
    else if (email.length !== 0 && pword.length !== 0) { //else if email and password are not empty
        var data = {email: email, password: pword}; //create an array containing the email and password

        $.ajax({ //begin ajax request
            type: "POST", //it is a POST request
            data: JSON.stringify(data), //convert the data array to a JSON array
            url: "https://www.geobus.co.uk/api/v1/login", //Server URL
            success: function (data) { //if ajax request is successful
                if (data.error === false) { //if the server error flag is false
                    sessionStorage.user = data.user; //store the user email is session storage
                    sessionStorage.token = data.token; //store the users token in session storage
                    window.location.assign("home.html"); //change to the home.html page
                    
                } else if (data.error === true) { //else if the servers error flag is true
                    $('#failAlert').html("<center>Invalid Login Credentials!</center>"); //then notify user login failed in alert popup
                    hideShowAlert($('#failAlert')); //call hideShowAlert function
                    return false; //return false so page does not redirect
                }
            },
            error: function (data) { //if ajax request fails
                //set the text in the alert popup and call hideShowAlert
                $('#failAlert').html("<center>Whoops Something Has Gone Wrong! Check Internet Connection & Try Again.</center>");
                hideShowAlert($('#failAlert'));
            }
        });
            
        return false; //return false so the page does not redirect
    }
});

//Onclick to handle the register button clicks
$("#registerButton").click(function () {
    var passwordStrengthRegex = /((?=.*d)(?=.*[a-z])(?=.*[A-Z]).{6,12})/gm; //password regex
    //Assign all register form entries to variables
    var name = $("#name").val();
    var age = $("#age").val();
    var sex = $("#sex").val();
    var email = $("#emailNew").val();
    var pass = $("#passwordNew").val();
    var passMatch = $("#passMatch").val();

    //if the password does not match the regex
    if (!pass.match(passwordStrengthRegex)) {
        //set the text of the alert popup
        $('#registerFailAlert').html("<center>Password Rules: 6-12 Characters & At Least 1 Uppercase, 1 Lowercase, 1 Number.</center>");
    }
    //else if the password and the password re enter fields do not match
    else if (pass !== passMatch) {
        //set the text of the alert popup
        $('#registerFailAlert').html("<center>Passwords Do Not Match!</center>");
    }
    //else if the form entries are not all empty
    else if (name !== null &&  sex !== null && email !== null && pass !== null && passMatch !== null) {
        var data = {name: name, age: age, sex: sex, emailNew: email, pass: pass}; //create an array containing all of the form entries
        
        $.ajax({ //begin ajax request
            type: "POST", //it is a post request
            data: JSON.stringify(data), //convert data array to a JSON array
            url: "https://www.geobus.co.uk/api/v1/register", //Server URL
            success: function (data) { //if ajax request is successful
                if (data.error === false) { //if server error flag is false
                    //set the text of the alert popup and call hideShowAlert
                    $('#registerSuccessAlert').html("<center>Successfully Registered! You May Login.</center>");
                    hideShowAlert($('#registerSuccessAlert'));
                    $.mobile.changePage('#loginPage'); //change page back to login page
                } else if (data.error === true) { //else if the server error flag is true
                    if(data.message == "duplicate"){ //if the server message is "duplicate"
                        $('#registerFailAlert').html("<center>Sorry, Email already in use.</center>"); //set text of alert popup
                    }
                    else{ //else
                            $('#registerFailAlert').html("<center>Whoops Something Has Gone Wrong!</center>"); //set the text of alert popup
                        }
                    hideShowAlert($('#registerFailAlert')); //call hideShowAlert
                }
        },
        error: function (data) { //if the jax request fails
                //Set the text of the alert popup and call hideShowAlert
                $('#failAlert').html("<center>Whoops Something Has Gone Wrong! Check Internet Connection & Try Again.</center>");
                hideShowAlert($('#registerFailAlert'));
            }
        });
    }
        
    hideShowAlert($('#registerFailAlert')); //call hideShowAlert for password failures
    return false; //return false to onclick method so page does not redirect
});

/*
*   Summary: hideShowAlert is used to show a popup alert on screen and then automatically close it after a few seconds
*   Parameters: alertId - the ID of the alert so it knows which alert to show.
*/
function hideShowAlert(alertId) {
    $(alertId).show('slow', function () {
        $(alertId).fadeTo(4000, 500).slideUp(500, function () {
            $(alertId).hide();
        });
    });
}