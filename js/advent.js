function zoomIn() {
	$('#content').animate({ 'zoom': 20 }, 400);
}

function zoomOut() {
	$('#content').animate({ 'zoom': 1 }, 400);
}

var hasTransitionEnded = false;

function loadTargetPageContent(targetPage, callback) {
	$('#page-content-body').html('');
	hasTransitionEnded = false;

	// Make an AJAX class to fetch the target page
	$.get('/posts/' + targetPage, function(data) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(data, 'text/html');
		var pageContent = doc.body.innerHTML;
		
		$('#page-content-body').html(pageContent);

		callback();
	});

	setTimeout(function() {
		hasTransitionEnded = true;
		callback();
	}, 1000);
}

function getEndTransition(targetPage, stencil) {	
	return function() {
		var toShow = null;		

        if (targetPage == '#content') {
        	toShow = $(targetPage);
        } else {
        	// Check if we have finished loading the content
        	if (($('#page-content-body').html() != '') && (hasTransitionEnded)) {
        		toShow = $('#page2');
        	}        	
        }

        if (toShow != null) {
        	$('.page-content').hide(); // Hide all pages
        	toShow.show();
        	$(stencil).removeClass('active'); // Reset the overlay

        	setTimeout(function() {
        		$(stencil).hide();
        	}, 1000);
        }        
	};
}

function initialiseAdvent() {
	// Get the current day of the month
	var today = new Date().getDate();
	// Select elements with IDs starting with "day-" and convert them to an array
	var dayElements = $("[id^=day-]").toArray();
	// Iterate through the array and add the class to elements with higher day numbers
	dayElements.forEach(function(element) {
		var dayNumber = parseInt(element.id.replace("day-", ""));
		var savedStateX = window.localStorage.getItem("sticker-" + dayNumber + "-x");
		if (dayNumber > today) {
			$(element).addClass("lego-brick-inactive").prop("disabled", true);
		} else if(savedStateX != null) {
			$(element).addClass("lego-brick-used");
		}
	});


	// $('#zoom-in').click(function() { zoomIn(); });
	// $('#zoom-out').click(function() { zoomOut(); });
	
	// $('.transition-button').on('click', function() {
    //     var targetPage = $(this).data('target');
    //     var button = $(this);

    //     var stencil = $(this).data('stencil');
    //     if (stencil == null) {
    //     	stencil = "#stencil-4x1";
    //     }

    //     $(stencil).show();

    //     if (targetPage != '#content') {
    //     	loadTargetPageContent(targetPage, getEndTransition(targetPage, stencil));
    //     }  else {
    //     	setTimeout(function() {				
	// 			getEndTransition(targetPage, stencil)();
	// 		}, 1000);
    //     }

    //     if (button.hasClass('day')) {
	//         var buttonOffset = button.offset(); // Get button position relative to the document

	//         var buttonWidth = button.outerWidth(); // Get button width
	//         var buttonHeight = button.outerHeight(); // Get button height

	//         // Calculate the center of the button
	//         var buttonCenterX = buttonOffset.left + buttonWidth / 2;
	//         var buttonCenterY = buttonOffset.top + buttonHeight / 2;

	//         // Position the stencil overlay at the center of the button
	//         // and activate the stencil overlay animation
	//         $(stencil).css({
	//             'top': buttonCenterY + 'px',
	//             'left': buttonCenterX + 'px'
	//         });
	//     }

	//     $(stencil).addClass('active');	            
    // });
}