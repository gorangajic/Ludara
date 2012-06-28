(function() {
	
	var pageWidth,
		pagesWrap = $('.pages'),
		pages = $('.page');


	var recalculate = function() {
		pageWidth = $(window).width();
		pagesWrap.css({width: pageWidth*3 });
		pages.css({width: pageWidth });
	};
	recalculate();

	$links = $("nav a").on('click', function() {
		var $this = $(this),
			index = $(this).parent().index();

		$links.removeClass("active");
		$this.addClass("active");
		pagesWrap.animate({left: -(pageWidth * index)})
		return false;
	});

	$(window).on('resize', recalculate);

	var $slagalica = $("#slagalica");
	$slagalica.find(".btn-primary").on('click', function() {
		var error = false,
			letters = []; 
		$slagalica.find(".inputs input").each(function() {
			var val = $(this).val();
			if( val.length == 0 ) error = true;
			letters.push(val);
		});
		if(error) {
			displayError("Morate popuniti sva polja");
			return false;
		}

        var lettersUrl = letters.join(",");
        if( !/^[a-zA-ZšŠđĐžŽčČćĆ,]+$/.test(lettersUrl) ) {
          displayError("Polja moraju da sadrže samo slova");
          return false;
        }


		preparePopup();
		$.ajax({ url: "http://slagalica.herokuapp.com/search/" + letters.join(",") , dataType: "jsonp"}).done(function(data) {
			var result = [];
			for(i=0; i<data.length;i++) {
				result.push(data[i].join('') + " ("+data[i].length+")");	
			}
			showResults(result);
		});

		return false;
	});

	var $mojbroj = $("#moj-broj");
	$mojbroj.find(".btn-primary").on('click', function() {
		var error = false,
			numbers = [];
		
		$mojbroj.find('.brojevi input').each(function() {
			var val = $(this).val();
			if( val.length == 0 ) error = true;
			numbers.push(val);
		});
		var resenje = $mojbroj.find(".resenje input").val();
		if(resenje.length == 0) error = true;
		
		if(error) {
			displayError("Morate popuniti sva polja");
			return false;
		}
		numbers.push(resenje);

		preparePopup();
		
		$.ajax({ url: "http://mojbroj.herokuapp.com/search/" + numbers.join(",") , dataType: "jsonp"}).done(function(data) {
			showResults(data);
		});
	});

	var $asocijacije = $("#asocijacije");
	$asocijacije.find(".btn-primary").on('click', function() {
		var error = true,
			asocijacije = [];
		
		$asocijacije.find('.inputs input').each(function() {
			var val = $(this).val();
			if( val.length > 0 ) {
				error = false;
				asocijacije.push(val);
			}
		});
		
		if(error) {
			displayError("Morate popuniti barem jedno polje.");
			return false;
		}
		preparePopup();
		
		$.ajax({ url: "http://asocijacije.herokuapp.com/search/" + asocijacije.join(",") , dataType: "jsonp"}).done(function(data) {
			showResults(data);
		});
	});

	var preparePopup = function() {
		$("#results").fadeIn();
		$("#results").append("<div class='loading'>loading..</div>");
	}

	var showResults = function(results) {
		var html = "<ul>";
		for(i=0;i<results.length;i++) {
			html += "<li>" + results[i] + "</li>";
		}
		html += "</ul>";
		html += "<div class='close-results'>zatvori</div>"
		$("#results").html(html);
	}

	var displayError = function(msg) {
		$("body").append('<div class="error">' + msg + '</div>');
		setTimeout( function() {
			$('.error').fadeOut('slow',function() {
				$(this).remove();
			});
		}, 1000);
	}
	$("#results").on('click', '.close-results', function() {
		$("#results").html("").fadeOut();
	});

	$('.reset').on('click', function() {
		$("input[type=text]").val("");
	})
})();