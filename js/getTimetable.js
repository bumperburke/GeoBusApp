/*
*   Summary: This class is used anytime there is a timetable retrieval.
*   It gets the data from server and divides it so it can neatly be displayed for users.
*/

//hide the popup error
$('#tableSelectError').hide();

//Onclick function for the select button on timetable pages
$("#selectTimetable").click(function(){
    //if selected value is "Choose a Route"
    if($("#routeSelect").val() === "Choose a Route"){
        $('#tableSelectError').html("<center>Please Select a Route!</center>"); //Set the error popups text
        hideShowAlert('#tableSelectError'); //call hideShowAlert passing in popup errors ID
        return false; //return false to onclick so page does not redirect
    }else{
        sessionStorage.selectedTimetable = $("#routeSelect").val(); //store selected timetable in sessionstorage variable
        $.ajax({ //begin ajax request
            type: "GET", //it is a get request
            url: "https://www.geobus.co.uk/api/v1/getTimetable/"+sessionStorage.selectedTimetable, //Server URL with sessionStorage variable
            success: function (data) { //on ajax request success
                if (data.error === false) { //if error flag passed back by server is false
                    //array of available directions on each route
                    var directions = ["dundalk->dublin", "dublin->dundalk", "bettystown->laytown->dublin", "dublin->laytown->bettystown"];
                    var monFriResults = data.data.timetable.monFri; //monday-friday data from server
                    var satResults = data.data.timetable.sat; //saturday data from server
                    var sunResults = data.data.timetable.sun; //sunday data from server

                    var firstInStop = null; //variable to store the first stop on inbound route
                    var firstOutStop = null; //variable to store the first stop on outbound route
                    var inboundStops = []; //array to store the inbound stops
                    var outboundStops = []; //array to store the outbound stops
                    var count = 0; //count variable
                    var inNumCols = new Object(); //object to hold the number of columns to be printed in each table on inbound journey
                    var outNumCols = new Object(); //object to hold the number of columns to be printed in each table on outbound journey
                    var inbound = new Object(); //object to hold the inbound journeys
                    var outbound = new Object(); //object to hold the outbound journeys
                    var firstDirection = monFriResults[0].direction; //variable that stores the first direction

                    if(monFriResults !== null){ //if monday-friday results are not empty 
                        var res1 = inboundOutbound(monFriResults, firstDirection); //variable that stores the result of inboundOutbound function for trips on monday-friday
                        inbound["monFri"] = res1["inbound"]; //store inbound trips in inbound object with key monFri
                        outbound["monFri"] = res1["outbound"]; //store outbound trips in outbound object with key monFri
                    }

                    if(satResults !== null){ //if saturday results are not empty
                        var res2 = inboundOutbound(satResults, firstDirection); //variable that stores the result of inboundOutbound function for trips on staurday
                        inbound["sat"] = res2["inbound"]; //store inbound trips in inbound object with key sat
                        outbound["sat"] = res2["outbound"]; //store outbound trips in outbound object with key sat
                    }
                    
                    if(sunResults !== null){ //if sunday results are not empty
                        var res3 = inboundOutbound(sunResults, firstDirection); //variable that stores the result of inboundOutbound function for trips on sunday
                        inbound["sun"] = res3["inbound"]; //store inbound trips in inbound object with key sun
                        outbound["sun"] = res3["outbound"]; //store outbound trips in outbound object with key sun
                    }

                    firstInStop = inbound["monFri"][0].name; //get the first stop of the inbound monday-friday trips
                    inboundStops.push(firstInStop); //add stop to inbound stops array
                    //For loop to get the stop names
                    for(i = 0; i < inbound["monFri"].length; i++){
                        if(inbound["monFri"][i].name !== inboundStops[count]){ //if the inbound trips monFri objects name is the same as inbound stops name
                            inboundStops.push(inbound["monFri"][i].name); //push the name to the inbound stops
                            count++; //increment count
                        }
                        else if(inboundStops[count] === inbound["monFri"][i].name){} //else if stop names are the same do nothing
                    }

                    count = 0; //set count back to 0
                    firstOutStop = outbound["monFri"][0].name; //get first stop on outbound trip
                    outboundStops.push(firstOutStop); //push the first stop the the outboundStops array
                    //For loop to get the stop names
                    for(i = 0; i < outbound["monFri"].length; i++){
                        if(outbound["monFri"][i].name !== outboundStops[count]){ //if the outbound trips monFri objects name is the same as outbound stops name
                            outboundStops.push(outbound["monFri"][i].name); //push the stop name to outbound stops
                            count++; //increment count
                        }
                        else if(outboundStops[count] === outbound["monFri"][i].name){} //else if the stop names are the same do nothing
                    }

                    //Get the number of columns for each timetable by calling getNum method and dividing by number of stops
                    inNumCols["monFri"] = getNum(inbound["monFri"])/inboundStops.length;
                    outNumCols["monFri"] = getNum(outbound["monFri"])/outboundStops.length;
                    inNumCols["sat"] = getNum(inbound["sat"])/inboundStops.length;
                    outNumCols["sat"] = getNum(outbound["sat"])/outboundStops.length;
                    
                    //change the page to displayTimetable page
                    $.mobile.changePage('#displayTimetable');

                    //append the direction to the first header on the page
                    $('#header1').append("<b>"+inbound["monFri"][0].direction+"</b>");
                    
                    //if the first direction on the inbound trips is equal to the first direction in the directions array
                    if(inbound["monFri"][0].direction === directions[0]){
                        inNumCols["sun"] = getNum(inbound["sun"])/inboundStops.length; //get number of colums for sunday table as only this timetable has sunday times
                        
                        //Call generateTables to dynamically create a table for each day group using the data we have collected and split up above
                        generateTables("Monday to Friday", '#inbound', inbound["monFri"], inboundStops, inNumCols["monFri"]);
                        generateTables("Saturday", '#inbound', inbound["sat"], inboundStops, inNumCols["sat"]);
                        generateTables("Sunday/Bank Holidays", '#inbound', inbound["sun"], inboundStops, inNumCols["sun"]);
                    }
                    //if the first direction on the inbound trips is equal to the third direction in the directions array
                    else if(inbound["monFri"][0].direction === directions[2]){
                        //Call generateTables to dynamically create a table for each day group using the data we have collected and split up above
                        generateTables("Monday to Friday", '#inbound', inbound["monFri"], inboundStops, inNumCols["monFri"]);
                        generateTables("Saturday, Sunday & Bank Holiday", '#inbound', inbound["sat"], inboundStops, inNumCols["sat"]);
                    }
                    
                    //append the direction to the second header on the page
                    $('#header2').append("<b>"+outbound["monFri"][0].direction+"</b>");
                    
                    //if the first direction on the outbound trips is equal to the second direction in the directions array
                    if(outbound["monFri"][0].direction === directions[1]){
                        outNumCols["sun"] = getNum(outbound["sun"])/outboundStops.length; //get number of colums for sunday table as only this timetable has sunday times
                        
                        //Call generateTables to dynamically create a table for each day group using the data we have collected and split up above
                        generateTables("Monday to Friday", '#outbound', outbound["monFri"], outboundStops, outNumCols["monFri"]);
                        generateTables("Saturday", '#outbound', outbound["sat"], outboundStops, outNumCols["sat"]);
                        generateTables("Sunday/Bank Holidays", '#outbound', outbound["sun"], outboundStops, outNumCols["sun"]);
                    }
                    //if the first direction on the outbound trips is equal to the fourth direction in the directions array
                    else if(outbound["monFri"][0].direction === directions[3]){
                        //Call generateTables to dynamically create a table for each day group using the data we have collected and split up above
                        generateTables("Monday to Friday", '#outbound', outbound["monFri"], outboundStops, outNumCols["monFri"]);
                        generateTables("Saturday, Sunday & Bank Holiday", '#outbound', outbound["sat"], outboundStops, outNumCols["sat"]);
                    }
                }
            },
            error: function (data) { //if ajax request fails
                //set the popup errors text and call hideShowAlert
                $('#tableSelectError').html("<center>Whoops! Something has gone wrong. Check Internet Connection and Try Again!</center>");
                hideShowAlert('#tableSelectError');
            }
        });

        return false; //return false to onclick method so page does not redirect
    }
});
    

/*
*   Summary: This function takes in an object and returns the count of the items in the object
*   Parameters: obj - javascript array of trips
*   Returns: count - the number of items in object
*/
function getNum(obj){
    var count = 0; //count variable
    for(i = 0; i < obj.length; i++){ //for ever item in the object
        count++; //increment count
    }
    return count; //return count
}

/*
*   Summary: This function splits up the returned data from the server into seperate groups(inbound, outbound).
*   Parameters: results - the data retrieved by the server. firstDirection - the first direction of the results
*   Returns: returns - an object containing the two groups
*/
function inboundOutbound(results, firstDirection){
    var inbound = []; //inbound trips array
    var outbound = []; //outbound trips array
    var returns = new Object(); //returns object
    
    //For loop to differentiate between journey direction
    for(j = 0; j < results.length; j++){
        if(results[j].direction === firstDirection){ //if direction of results at j is the same as first direction
            inbound.push(results[j]); //push that item to the inbound array
        }
        else{ //else if it is not the same as the first direction
            outbound.push(results[j]); //push to the outbound array
        }
    }
    
    returns["inbound"] = inbound; //returns key inbound contains inbound array
    returns["outbound"] = outbound; //returns key outbound contains outbound array
    return returns; //return returns object
}

/*
*   Summary: This function dynamically creates a table for each day of the timetable
*   Parameters: catp - the caption of the table, divId - the id of the html div, trips - the array of trips,
*   stops - the stops array, numCols - the number of columns for a table
*/
function generateTables(capt, divId, trips, stops, numCols){
    var html = '<table data-role="table" class="ui-responsive">'; //htm variable that holds the html code. here I create a table
    html += '<caption><b>'+capt+'</b></caption>'; //Add the caption to the table
    var count = 0; //count variable
    var multiplier = 2; //multiplier
    var colsHolder = numCols; //variable to hold number of columns as we will be changing the numCols variable as we progress
    
    for (i = 0; i < stops.length; i++) { //for loop to iterate throught the number of stops
        html += '<tr><th id="stops">' + stops[i] + '</th>'; //add a row where first element is the stop name
        
        for (; count < colsHolder; count++) { //for loop to create a certain number of row elements
            if(trips[count].time === null){ //if the time data of the trips array at position count is null
                html += '<td id="times"><center><b><font color="red">No Service</font></b></center></td>'; //create html code that will print no service on the timetable
            }else{ //else
                html += '<td id="times"><b>' + trips[count].time.slice(0, 5) + '</b></td>'; //create the next column item with the time spliced to exclude the :00 at the end
            }
        }
        html += '</tr>'; //close the row
        colsHolder = numCols*multiplier; //set the colsHolder variable to numCols multiplied by the multiplier as if it is not we will not print complete timetable
        multiplier++; //increment the multiplier
    }

        html += '</table>'; //close the table
    
    $(divId).append(html); //append the table to the divId
}

/*
*   Summary: hideShowAlert is used to show a popup alert on screen and then automatically close it after a few seconds
*   Parameters: alertId - the ID of the alert so it knows which alert to show.
*/
function hideShowAlert(alertId){
    $(alertId).fadeTo(4000, 500).slideUp(500, function(){
        $(alertId).hide();
    });
}