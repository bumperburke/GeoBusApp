//$(document).ready(function(){
    $('#failAlert').hide();
    $('#registerSuccessAlert').hide();
    $('#registerFailAlert').hide();
    $.mobile.pageLoadErrorMessage = "";
    

    $('#loginButton').click(function () {
        var passwordStrengthRegex = /((?=.*d)(?=.*[a-z])(?=.*[A-Z]).{6,12})/gm;
        var email = $("#email").val();
        var pword = $("#password").val();
        
        if(!pword.match(passwordStrengthRegex) && pword.length != 0){
            $('#failAlert').html("<center>Password Rules: 6-12 Characters & At Least 1 Uppercase, 1 Lowercase, 1 Number.</center>");
            hideShowAlert($('#failAlert'));
        }
        else if (email.length != 0 && pword.length != 0) {
            var data = {
                email: email,
                password: pword
            };

            $.ajax({
                type: "POST",
                data: JSON.stringify(data),
                url: "https://www.geobus.co.uk/api/v1/login",
                success: function (data) {
                    if (data.error == false) {
                        sessionStorage.user = data.user;
                        sessionStorage.token = data.token;
                        $.mobile.pageContainer.pagecontainer("change", "home.html");
                        //$.mobile.changePage("home.html"); //,{reloadPage: true});
                    } else if (data.error == true) {
                        $('#failAlert').html("<center>Invalid Login Credentials!</center>");
                        hideShowAlert($('#failAlert'));
                    }
                },
                error: function (data) {
                    $('#failAlert').html("<center>Whoops Something Has Gone Wrong!</center>");
                }
            });
            
            return false;
        }
    });

    $("#registerButton").click(function () {
        var passwordStrengthRegex = /((?=.*d)(?=.*[a-z])(?=.*[A-Z]).{6,12})/gm;
        var name = $("#name").val();
        var dob = $("#dob").val();
        var sex = $("#sex").val();
        var email = $("#emailNew").val();
        var pass = $("#passwordNew").val();
        var passMatch = $("#passMatch").val();

        if (!pass.match(passwordStrengthRegex)) {
            $('#registerFailAlert').html("<center>Password Rules: 6-12 Characters & At Least 1 Uppercase, 1 Lowercase, 1 Number.</center>");
            hideShowAlert($('#registerFailAlert'));
        } else if (pass != passMatch) {
            $('#registerFailAlert').html("<center>Passwords Do Not Match!</center>");
            hideShowAlert($('#registerFailAlert'));
        } else if (name != null && dob != null && sex != null && email != null && pass != null && passMatch != null) {
            var data = {name: name, dob: dob, sex: sex, emailNew: email, pass: pass};
            $.ajax({
                type: "POST",
                data: JSON.stringify(data),
                url: "https://www.geobus.co.uk/api/v1/register",
                success: function (data) {
                    if (data.error == false) {
                        console.log(data);
                        $('#registerSuccessAlert').html("<center>Successfully Registered! You May Login.</center>");
                        hideShowAlert($('#registerSuccessAlert'));
                        $.mobile.changePage('#loginPage');
                    } else if (data.error == true) {
                        console.log(data);
                        $('#registerFailAlert').html("<center>Whoops Something Has Gone Wrong! Try Again Later.</center>");
                        hideShowAlert($('#registerFailAlert'));
                    }
                },
                error: function (data) {
                    console.log(data);
                    $('#failAlert').html("<center>Whoops Something Has Gone Wrong!</center>");
                    hideShowAlert($('#registerFailAlert'));
                }
            });
        }
        
        return false;
    });

    function hideShowAlert(alertId) {
        $(alertId).show('slow', function () {
            $(alertId).fadeTo(4000, 500).slideUp(500, function () {
                $(alertId).hide();
            });
        });
    }
//});