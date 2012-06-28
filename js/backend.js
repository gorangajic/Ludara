$(function() {
  $('body').on('click', '.back', function() {
    window.history.back();
  });
});

$(function() {
  $(".arhive").on("click", function() { 
   var arhived = this.checked ? 1:0;
    $.ajax({ url: "/dildo.rs/backend/orders/arhive/"+$(this).attr("id"), method: "POST", data: { arhived: arhived }});
  }); 
});