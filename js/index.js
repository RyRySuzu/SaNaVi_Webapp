$(document).ready(function() {
  $('body').on('focusin','input, select', function() {      
    $(this).parent().addClass("focused").removeClass("error").removeClass("changed");
  });
  $('body').on('focusout','input, select', function() {
    $(this).parent().removeClass("focused");
    if($(this).val() != 0 || $(this).val().length > 0) {
      $(this).parent().addClass("changed");
    }
  });
});