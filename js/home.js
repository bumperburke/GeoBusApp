$(document).ready(function(){
    $('#successAlert').show();
    hideShowAlert($('#successAlert'));

    function hideShowAlert(alertId){
        $(alertId).fadeTo(4000, 500).slideUp(500, function(){
            $(alertId).hide();
        });
    }
});