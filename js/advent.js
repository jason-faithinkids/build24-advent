
function initialiseAdvent() {
	  // Get the current day of the month
		var today = new Date().getDate();

		// Select elements with IDs starting with "day-" and convert them to an array
		var dayElements = $("[id^=day-]").toArray();
	
		// Iterate through the array and add the class to elements with higher day numbers
		dayElements.forEach(function(element) {
			var dayNumber = parseInt(element.id.replace("day-", ""));
			console.log("sticker-" + dayNumber + "-x")
			var savedStateX = window.localStorage.getItem("sticker-" + dayNumber + "-x");
			console.log(savedStateX)
			if (dayNumber > today) {
				$(element).addClass("lego-brick-inactive").prop("disabled", true);
			} else if(savedStateX != null) {
				$(element).addClass("lego-brick-used");
			}
		});
}