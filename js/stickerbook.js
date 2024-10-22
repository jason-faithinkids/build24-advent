function initialiseStickerbook() {
	let draggingElement = null;
    let offsetX, offsetY;
    let startedDrag = false;
	var tapped=false;

    let startTouch = function(_this, e) {
    	draggingElement = _this;
        offsetX = e.clientX - $(_this).position().left;
        offsetY = e.clientY - $(_this).position().top;
        $(_this).css('cursor', 'grabbing');
        startedDrag = false;
    }
    let moveTouch = function(e) {
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

            if (!startedDrag) {
            	startedDrag = true;            	
            	document.getElementById('take-sticker1').play();
            }
        }
    }

    // Mouse down event to start dragging
    $('.sticker').on('mousedown', function(e) {
        startTouch(this, e);
    });
    $('.sticker').on('touchstart', function(e) {    	
        e.preventDefault();
        e.stopPropagation();
        startTouch(this, e.touches[0]);

        if(!tapped){ //if tap is not set, set up single tap
	      tapped=setTimeout(function(){
	          tapped=null
	          //insert things you want to do when single tapped
	      },300);   //wait 300ms then run single click code
	    } else {    //tapped within 300ms of last tap. double tap
	      clearTimeout(tapped); //stop single tap callback
	      tapped=null
	      //insert things you want to do when double tapped
	      $(this).toggleClass('flipped');
	    }
    });

    // Mouse move event to handle dragging
    $(document).on('mousemove', function(e) {    	
        moveTouch(e);
    });
    $(document).on('touchmove', function(e) {    	    	
        moveTouch(e.touches[0]);       
    });

    $('.sticker').on('dblclick', function(e) {    	
    	$(this).toggleClass('flipped');
    });    

    // Mouse up event to stop dragging
    $(document).on('mouseup touchend', function() {
    	$(draggingElement).css('cursor', 'move');
    	document.getElementById('drop-sticker').play();
        draggingElement = null;        
    });


    // Loop over all previously configured stickers
    $('.sticker').each(function(index, el) {
    	var savedStateX = window.localStorage.getItem(el.id + "-x");
    	var savedStateY = window.localStorage.getItem(el.id + "-y");
    	
    	if (savedStateX != null) {    		
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

