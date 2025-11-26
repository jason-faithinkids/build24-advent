function initialiseStickerbook() {
	let draggingElement = null;
    let offsetX, offsetY;
    let startedDrag = false;
	var tapped=false;
    const OFFSCREEN_BUFFER = 100;

    const getCanvas = () => $('.stickerbook-canvas');

    function centerSticker(el) {
        const $canvas = getCanvas();
        if (!$canvas.length) {
            $(el).css({ left: 0, top: 0 });
            window.localStorage.setItem(el.id + "-x", 0);
            window.localStorage.setItem(el.id + "-y", 0);
            return;
        }

        const canvasWidth = $canvas.width();
        const canvasHeight = $canvas.height();
        const stickerWidth = $(el).outerWidth();
        const stickerHeight = $(el).outerHeight();

        const centerX = (canvasWidth - stickerWidth) / 2;
        const centerY = (canvasHeight - stickerHeight) / 2;

        $(el).css({
            left: centerX + 'px',
            top: centerY + 'px'
        });

        window.localStorage.setItem(el.id + "-x", centerX);
        window.localStorage.setItem(el.id + "-y", centerY);
    }

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
            	document.getElementById('take-sticker1').play().catch(e => console.warn(`couldnt play sound ${e.message}`));
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
    $(document).on('mouseup touchend', function(e) {
        if(draggingElement) {
            $(draggingElement).css('cursor', 'move');
            document.getElementById('drop-sticker').play().catch(e => console.warn(`couldnt play sound ${e}`));
            const { top, left } = $(draggingElement).position();
            const $canvas = getCanvas();
            const boundsHeight = $canvas.length ? $canvas.height() : $(window).height();
            const boundsWidth = $canvas.length ? $canvas.width() : $(window).width();
            
            if(top < -OFFSCREEN_BUFFER  || left < -OFFSCREEN_BUFFER || top > boundsHeight - OFFSCREEN_BUFFER || left > boundsWidth - OFFSCREEN_BUFFER) {
                centerSticker(draggingElement);
            }
        }
        draggingElement = null;
    });


    // Loop over all previously configured stickers
    $('.sticker').each(function(index, el) {
    	var savedStateX = window.localStorage.getItem(el.id + "-x");
    	var savedStateY = window.localStorage.getItem(el.id + "-y");
    	
    	if (savedStateX != null && savedStateY != null) {    		
    		$(el).css({
                left: savedStateX + 'px',
                top: savedStateY + 'px'
            }).show();
    	} else {
            $(el).hide();
    	}
    });

    // See if we have a new sticker specified by the URL anchor
    if (window.top.location.hash.length > 0) {
    	var anchor = window.top.location.hash.split('#')[1];
        var $target = $('#sticker-' + anchor);
    	if ($target.hasClass('sticker')) {    	
            var savedStateX = window.localStorage.getItem($target.attr('id') + "-x");
            var savedStateY = window.localStorage.getItem($target.attr('id') + "-y");
            if (savedStateX == null || savedStateY == null) {
                centerSticker($target[0]);
            }
    		$target.show();
    	}
    }
}