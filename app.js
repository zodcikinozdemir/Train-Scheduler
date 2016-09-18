 var config = {
    apiKey: "AIzaSyBPBZtL8X22S_C-M9R-fxUt3FTR3VWZXw0",
    authDomain: "trainscheduler-8b076.firebaseapp.com",
    databaseURL: "https://trainscheduler-8b076.firebaseio.com",
    storageBucket: "trainscheduler-8b076.appspot.com",
    messagingSenderId: "617211062705"
  };
  firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

// Initial value
var train = {
	name: "",
	destination: "",
	frequecy: "",
	startTime:"",
	dateAdded: firebase.database.ServerValue.TIMESTAMP
}
var monthsWorked = 0;
var totalBilled = 0;

// Submit Button Click
$("#submitbtn").on("click", function() {

	// Code in the logic for storing and retrieving the most recent employee.
	train.name = $("#train-name").val().trim();
	train.destination = $("#train-destination").val().trim();
	train.startTime = $("#first_train-time").val().trim();
	train.frequecy = $("#train-frequency").val().trim();

	//console.log("train: " + JSON.stringify(train));
	
    // Save new value to Firebase
	database.ref().push(train);

	// Don't refresh the page!
	return false;
});

database.ref().on("child_added", function(childSnapshot) {
	
	var train = childSnapshot.val();
	var row = $("<tr>");
	var colName = $("<td>").html(train.name);
	var colDestination = $("<td>").html(train.destination);
	var colFrequency = $("<td>").html(train.frequecy);

	// Assumptions
		var tFrequency = train.frequecy;
		var firstTime = train.startTime; // Time is 3:30 AM
        console.log("tf " + tFrequency+ " ft " + firstTime);
		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTimeConverted = moment(firstTime,"hh:mm").subtract(1, "years");
		console.log(firstTimeConverted);

		// Current Time
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

		// Difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);

		// Time apart (remainder)
		var tRemainder = diffTime % tFrequency;
		console.log(tRemainder);

		// Minute Until Train
		var tMinutesTillTrain = tFrequency - tRemainder;
		console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

		// Next Train
		var nextTrain = moment().add(tMinutesTillTrain, "minutes")
		console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


	var colNextTrain = $("<td>").html(moment(nextTrain).format("hh:mm"));
	var colMinutesTillTrain = $("<td>").html(tMinutesTillTrain);

	row.append(colName).append(colDestination).append(colFrequency)
	    .append(colNextTrain).append(colMinutesTillTrain);
	$("#train-table").append(row);
});
