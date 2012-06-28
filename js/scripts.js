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
	var $inputs = $slagalica.find('.inputs input');
	$inputs.on('keyup', function(e) {
	    if(e.keyCode == 13) {
	      $slagalica.find(".btn-primary").trigger('click');
	      return false;
	    }
	    if(e.keyCode < 65 || e.keyCode > 90 && e.keyCode != 220 && e.keyCode != 221 && e.keyCode != 219 && e.keyCode != 186 && e.keyCode != 222) {
	      return false;
	    };
	    if(e.keyCode == 9) return false;
	    if(e.keyCode == 78 || e.keyCode === 76) return false;
	    var current = $(this).index();
	    if(current == 11) {
	      $slagalica.find(".btn-primary").trigger('click');
	      return false;
	    }
	    $inputs.eq(current+1).focus();
	});

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

	$mojbroj.find('input').on('keyup', function(e) {
        if(e.keyCode == 13) {
          $mojbroj.find(".btn-primary").trigger('click');
          return false;
        }
        var $this = $(this);

        if($this.val().length >= parseInt($this.attr("maxlength"),10) ) {
          var index = $this.index();
          if(index == 0 && $this.attr("id") == "resenje") {
            $('.brojevi').find('input').eq(0).focus();
          } else {
            $('.brojevi').find('input').eq(index+1).focus();
          }
        }
      });

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
	$asocijacije.find('.inputs input').on('keyup', function(e) {
		if(e.keyCode == 13) {
          $asocijacije.find(".btn-primary").trigger('click');
          return false;
        }
	});
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
		$("input[type=number]").val("");
	})
})();