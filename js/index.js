$(document).ready(function(){
    $('#failAlert').hide();
    $('#registerSuccessAlert').hide();
    $.mobile.pageLoadErrorMessage = "";
    
    $('#loginButton').click(function(){
        var email = $("#email").val();
        var pword = $("#password").val();
        
        if(email.length != 0 && pword.length != 0){
            var data = {email: email, password: pword};

            $.ajax({
                type: "POST",
                data: JSON.stringify(data),
                url: "https://www.geobus.co.uk/api/v1/login",
                success: function(data){
                    if(data.error == false){
                        $.mobile.changePage('html/home.html');//,{reloadPage: true});
                    }else if(data.error == true){
                        $('#failAlert').html("<center>Invalid Login Credentials!</center>");
                        hideShowAlert($('#failAlert'));
                    }
                },
                error: function(data){
                    $('#failAlert').html("<center>Whoops Something Has Gone Wrong!</center>");
                    //window.location.assign
                    //console.log(data);
                    //console.log(result.error+"\n"+result.user+"\n"+result.token+"\n"+result.message);
                }
            });
        }
    });
    
    $("#registerButton").click(function(){
        var name = $("#name").val();
        var dob = $("#dob").val();
        var sex = $("#sex").val();
        var email = $("#email").val();
        var pass = $("#password").val();
        
        if(name != null && dob != null && sex != null && email != null && pass != null){
            var data = {name: name, dob: dob, sex: sex, email: email, pass: pass};
            
            $.ajax({
                type: "POST",
                data: JSON.stringify(data),
                url: "https://www.geobus.co.uk/api/v1/register",
                success: function(data){
                    if(data.error == false){
                        $('#registerSuccessAlert').html("<center>Successfully Registered! You May Login.</center>");
                        $.mobile.changePage('#loginPage');
                    }else if(data.error == true){
                        $('#registerFailAlert').html("<center>Whoops Something Has Gone Wrong! Try Again Later.</center>");
                        hideShowAlert($('#registerFailAlert'));
                    }
                },
                error: function(data){
                    $('#failAlert').html("<center>Whoops Something Has Gone Wrong!</center>");
                    hideShowAlert($('#failAlert'));
                }
            });
        }
    });
    
    function hideShowAlert(alertId){
        $(alertId).show('slow', function(){
            $(alertId).fadeTo(4000, 500).slideUp(500, function(){
                $(alertId).hide();
            });
        });
    }
});