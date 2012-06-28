$(function() {

  if($('.content.slagalica').length > 0) {
    (function() {

      $("#search").on('click', function() {
        search();
      });

      var $inputs = $(".letters").find("input");
      $inputs.on('keyup', function(e) {
        if(e.keyCode == 13) {
          search();
          return false;
        }
        if(e.keyCode < 65 || e.keyCode > 90 && e.keyCode != 220 && e.keyCode != 221 && e.keyCode != 219 && e.keyCode != 186 && e.keyCode != 222) {
          return false;
        };
        if(e.keyCode == 9) return false;
        if(e.keyCode == 78 || e.keyCode === 76) return false;
        var current = $(this).index();
        if(current == 11) {
          search();
          return false;
        }
        $inputs.eq(current+1).focus();
      });

      var search = function() {
        $("#searches").html("");
        $("#message").hide();
        $(".manual").hide();
        var letters = [];
        $(".letters").find("input").each(function() {
          var len = $(this).val().toLowerCase();
          if(len && len.length > 0) {
            letters.push(len);
          }
        });
        if(letters.length < 12) {
          $("#message").text("Popunite sva polja").show();
          return false;
        }
        var lettersUrl = letters.join(",");
        if( !/^[a-zA-ZšŠđĐžŽčČćĆ,]+$/.test(lettersUrl) ) {
          $("#message").text("Polja moraju da sadrže samo slova").show();
          return false;
        }
        $("#loading").show();
        var apps = ['slagalica','strong-water-6141', 'sharp-sunrise-5457','blazing-mist-7599'];
        var rnd = Math.floor(Math.random()*4);
        $.ajax( { url: "http://"+apps[rnd]+".herokuapp.com/search/"+letters.join(",") + "?callback=?", dataType: "jsonp" }).done(function(data) {
            var i=0,
              len = data.length,
              html = "";
            if(data.length === 0) {
              $("#message").text("Nijedna reč nije pronđena").show("");
            }
            for( ; i < len; i++) {
              html += '<li><div class="num">' + data[i].length+ '</div>';
              html += '<div class="word">' + data[i].join('') + '</div></li>'
            }
            $("#loading").hide();
            $("#searches").show().html(html).find("li:nth-child(2n)").addClass("right");
            $("#refresh").show(); 
          });
      }

      $("#refresh").on('click', function() {
        $(".letters input").each(function() {
          $(this).val("");
        });
        $("#message").hide();
        $("#searches").hide();
        $(this).hide();
        $(".manual").show();
      });

    })();
    


  } else if($(".content.asociajcaije").length > 0) {

    (function(){
      $("#search").on('click', function() {
        search();
      });


      var $inputs = $(".asc").find("input");


      $inputs.on('keyup', function(e) {
        if(e.keyCode == 13) {
          search();
          return false;
        }
      });
      var search = function() {
        $("#searches").html("");
        $("#message").hide();
        $(".manual").hide();
        
        var searches = [];

        
        
        $inputs.each(function() {
          var len = $(this).val().toLowerCase();
          if(len && len.length > 0) {
            searches.push(len);
          }
        });

        if(searches.length < 1) {
          $("#message").text("Unesite barem jedno polje").show();
          return false;
        }
        $("#loading").show();
        $.getJSON('http://asocijacije.herokuapp.com/search/'+searches.join(",")+"?callback=?", function(data) {
          var i=0,
            len = data.length,
            html = "";

          $("#refresh").fadeIn();
          $("#loading").hide();
          $(".manual").slideUp();
          
          if(data.length === 0) {
            $("#message").text("Nijedna asocijacija nije pronđena :(").show("");
            return false;
          }
          for( ; i < len; i++) {
            html += '<li><div class="word">' + data[i] + '</div></li>'
          }
          

          $("#searches").show().html(html).find("li:nth-child(2n)").addClass("second");
          
          

        });
      }


      $("#refresh").on('click',function() {
        $("#refresh").slideUp();
        $inputs.each(function() {
          $(this).val("");
        });
        $("#searches").slideUp().html("");
        $(".manual").slideDown();
        $("#message").hide("");
      });

      $("#dodaj").on('click', function() {
        $("body").append($("#popup-template").html());
        $(".overlay").height($(window).height());
      });
      $(".unapredi").on('click', function() {
        $("body").append($("#popup-template").html());
        $(".overlay").height($(window).height());
      });

      $('body').on('click', "#zatvori", function() {
        $(".overlay").fadeOut('slow', function() {
          $(this).remove();
        });
      }).on('click', '.overlay', function() {
        $(this).fadeOut('slow', function() {
          $(this).remove();
        });
        return false;
      }).on('click', '.popup' , function(e) {
        e.stopPropagation();
        e.preventDefault();
      }).on('click', '#posalji', function() {
        var send = 0;
        var values = {};
        $(".popup").find('input').each(function() {
          if($(this).val().length != 0) {
            if( $(this).attr("name") != "resenje" ) {
              send++;
            }
            values['data[Asocijacije]['+$(this).attr("name")+']'] = $(this).val() ;
          }
        });
        
        if(send === 0) {
          $(".popup p").text("popunite barem jedno polje").css({ color: "red" });
          return false;
        } 
        if($("#resenje").val().length === 0) {
          $(".popup p").text("morate uneti rešenje").css({ color: "red" });
          return false;
        }
        $(".popup").find('input').each(function() {
              $(this).val("");
            });
         $(".popup p").text("loading..").css({ color: "green"});
        $.ajax({
        url: 'http://ludara.com/asocijacijes/add',
        type: 'POST',
        dataType: 'json',
        data: values
        }).done(function(data) {
                  if(data.writen == "true") {
                    $(".popup p").text("uspešno ste uneli novu asocijaciju, kad prođe proveru biće ubačena u bazu").css({ color: "green"});
                  } else {
                    $(".popup p").text("došlo je do greške prilikom upisa u bazu, pokušajte ponovo kasnije").css({ color: "red" });
             
               }
          });
      });
    })();


  } else if ($(".content.ludbroj").length > 0) {

    (function() {
     $("#search").on('click', function() {
        search();
      });


      var $inputs = $(".polja").find("input");
      var $rezultat = $(".lud-resenje");

      $('input').on('keyup', function(e) {
        if(e.keyCode == 13) {
          search();
          return false;
        }
        var $this = $(this);

        if($this.val().length >= parseInt($this.attr("maxlength"),10) ) {
          var index = $this.index();
          if(index == 0 && $this.hasClass("lud-resenje")) {
            $('.polja').find('input').eq(0).focus();
          } else {
            $('.polja').find('input').eq(index+1).focus();
          }
        }
      });

      var search = function() {
        $("#searches").html("");
        $("#message").hide();
        $(".manual").hide();
        
        var searches = [];

        
        $inputs.each(function() {
          var len = $(this).val();
          if(len && len.length > 0) {
            searches.push(len);
          }
        });

        if($rezultat.val() && $rezultat.length > 0) {
          searches.push($rezultat.val()); 
        }
        

        if(searches.length != 7) {
          $("#message").text("Morate popuniti sva polja").show();
          return false;
        }

        $("#loading").show();
        
        $.getJSON('http://mojbroj.herokuapp.com/search/'+searches.join(",") + "?callback=?", function(data) {
          var i=0,
            len = data.length,
            html = "";

          $("#refresh").fadeIn();
          $("#loading").hide();
          $(".manual").slideUp();
          
          if(data.error && data.error.length === 0) {
            $("#message").text("doslo je do greske: " + data.error).show("");
            return false;
          }
          for( i=len ; i >= 0 ; i--) {
            if(!/undefined/.test(data[i])) {
              html += '<li>' + data[i] + '</li>'  
            }
          }
          if(html.length === 0 ) {
            $("#message").text("zao nam je ali nismo pronasli ni jedno resenje.").show();
          }

          $("#searches").show().html(html).find("li:nth-child(2n)").addClass("second");
          
        });
      }


      $("#refresh").on('click',function() {
        $("#refresh").slideUp();
        $inputs.each(function() {
          $(this).val("");
        });
        $rezultat.val("");
        $("#searches").slideUp().html("");
        $(".manual").slideDown();
        $("#message").hide("");
      });
    })();
  }



});
