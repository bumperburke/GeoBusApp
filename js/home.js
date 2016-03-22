/*
*   Summary: This class ensures the external panel menu is added when you login and provides the functionality for the logout button
*/

//Function that is called to enable the sliding panel menu
$(function () {
    $("[data-role='panel']").panel().enhanceWithin(); //ensures the external jquery panel if created correctly
});

//Logout function which is called by clicking logout on the menu
function logout(){
    //set all sessionStorage tp false and redirect to login page
    sessionStorage.token = false;
    sessionStorage.user = false;
    sessionStorage.busToTrack = false;
    sessionStorage.selectedTimetable = false;
    window.location.assign("index.html#loginPage");
}