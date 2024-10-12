function initialiseStickerbook() {
	let draggingElement = null;
    let offsetX, offsetY;

    // Mouse down event to start dragging
    $('.sticker').on('mousedown', function(e) {
        draggingElement = this;
        offsetX = e.clientX - $(this).position().left;
        offsetY = e.clientY - $(this).position().top;
        $(this).css('cursor', 'grabbing');
    });

    // Mouse move event to handle dragging
    $(document).on('mousemove', function(e) {
        if (draggingElement != null) {
        	var newX = e.clientX - offsetX;
        	var newY = e.clientY - offsetY;

            $(draggingElement).css({
                left: newX + 'px',
                top: newY + 'px'
            });

            // Store this
            window.localStorage.setItem(draggingElement.id + "-x", newX);
            window.localStorage.setItem(draggingElement.id + "-y", newY)            
        }
    });

    // Mouse up event to stop dragging
    $(document).on('mouseup', function() {
    	$(draggingElement).css('cursor', 'move');
        draggingElement = null;        
    });


    // Loop over all previously configured stickers
    $('.sticker').each(function(index, el) {
    	var savedStateX = window.localStorage.getItem(el.id + "-x");
    	var savedStateY = window.localStorage.getItem(el.id + "-y");
    	
    	if (savedStateX != null) {
    		console.log(el.id);
    		console.log(savedStateX);
    		$(el).css({
                left: savedStateX + 'px',
                top: savedStateY + 'px'
            }).show();
    	} else {

    	}
    });

    // See if we have a new sticker specified by the URL anchor
    if (window.top.location.hash.length > 0) {
    	// Get everything except the hash
    	var anchor = window.top.location.hash.split('#')[1];
    	if ($('#sticker-' + anchor).hasClass('sticker')) {    	
    		$('#sticker-' + anchor).show();
    	}
    }
}