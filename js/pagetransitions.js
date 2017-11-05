var PageTransitions = (function() {

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		$nextPageButton = $( '#next-page' ),
		$prevPageButton = $( '#prev-page' ),
		$firstPageButton = $( '#first-page' ),
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations,
        animations = {
            max: 67
        },
        keys = {
            BACKSPACE: 8,
            DOWN: 40,
            ENTER: 13,
            LEFT: 37,
            RIGHT: 39,
            SPACE: 32,
            PAGE_DOWN: 34,
            PAGE_UP: 33
        };

	function init() {

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );

    var animcursorCheck = function() {
        if( isAnimating ) {
            return false;
        }
        if( animcursor > animations.max ) {
            animcursor = 1;
        }
        else if (animcursor < 1) {
            animcursor = animations.max
        }
        return animcursor;
    };

    // Keyboard binding
    $( "body" ).keyup(function(event) {
        var key = event.which;

        if ( key == keys.RIGHT || key == keys.SPACE) {
            nextPage( animcursorCheck() );
            ++animcursor;
        }
        if ( key == keys.LEFT) {
            --animcursor;
            prevPage( animcursorCheck() );
        }
    });

    $nextPageButton.on( 'click', function() {
        nextPage( animcursorCheck() );
        ++animcursor;
    } );

    $prevPageButton.on( 'click', function() {
        prevPage( animcursorCheck() );
        --animcursor;
    } );

    $firstPageButton.on( 'click', function() {
    	animcursor = 1;
    	firstPage()
    })

	}

	function firstPage(options) {
		if( isAnimating ) {
			return false;
		}

		if (current == 0 ) {
			// Do nothing if already at begining
			return;
		}

		isAnimating = true;


		var $currPage = $pages.eq( current );
		// Current now should be 0, so that $nextPage is actual first page
		current = 0;
		
		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' );
		var outClass = 'pt-page-rotatePushRight',
				inClass = 'pt-page-moveFromLeft';

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}
	}

	function prevPage(options) {
		if( isAnimating ) {
			return false;
		}

		if (current == 0 ) {
			//Do nothing
			return;
		}

		isAnimating = true;
		
		var $currPage = $pages.eq( current );

		if(typeof options.showPage != 'undefined'){
			if( options.showPage == 0 ) {
				current = options.showPage;
			}
		}
		else{
			if( current > 0 ) {
				--current;
			}
		}

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' );
		var outClass = 'pt-page-rotatePushRight',
				inClass = 'pt-page-moveFromLeft';

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}
	}

	function nextPage(options ) {
		if( isAnimating ) {
			return false;
		}

		if (current == pagesCount - 1) {
			// Do nothing if last page
			return;
		}

		isAnimating = true;

		var $currPage = $pages.eq( current );

		if(typeof options.showPage != 'undefined'){
			if( options.showPage < pagesCount - 1 ) {
				current = options.showPage;
			}
			else {
				current = 0;
			}
		}
		else{
			if( current < pagesCount - 1 ) {
				++current;
			}
			else {
				return;
			}
		}

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' );
		var outClass = 'pt-page-rotatePushLeft';
				inClass = 'pt-page-moveFromRight';


		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}

	init();

	return {
		init : init,
		nextPage : nextPage
	};

})();
