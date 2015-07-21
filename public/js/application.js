$(document).ready(function(){

  $('.subtab-div').hide();
  $('.content').hide();
  $('.additional-stats').hide();

  // Tab functions

  $('.tab').click(function(){
      // Undoes changes from possible previous clicks
      $('.tab').removeClass('active');
      $('.subtab-list').hide();
      $('.subtab-link').css('color', '#b2b2b2')
      $('.content').hide();

      // Creates changes on click
      $(this).addClass('active');
      $('.subtab-div').show();

      if (this.innerText.indexOf("Dashboard") != -1){
        $('#dashboard').show();
      }
      else if (this.innerText.indexOf("Sign In") != -1){
        $('#sign-in').show();
      };
      // Additional tabs would continue here
  });

  // Subtab functions

  $('.subtab-link').click(function(){
    // Undoes changes from possible previous clicks
    $('.subtab-link').css('color', '#b2b2b2')
    $('.content').hide();

    // Changes active tab color
    $(this).css('color', '#808080')

    // Displays content associated with subtab
    if (this.innerText.indexOf("Business Overview") != -1){
        $('#business-overview').show();
      }
      // Additional subtabs would continue here
  });

  // Button/link functions

  // Changes pencil button color on hover
  $('.pencil').hover(
    function(){
      $(this).css('background-color', '#fff')
    },

    function(){
      $(this).css('background-color', '#f4f4ee')
    }
  );

  // Shows and hides additional-stats
  $('.more').click(function(){
    var id = $(this).data("id")

    $('.additional-stats[data-id='+id+']').show();
    $(this).css('visibility', 'hidden');
  });

  $('.less').click(function(){
    var id = $(this).data("id")

    $('.additional-stats[data-id='+id+']').hide();
    $('.more').css('visibility', 'visible');
  });

});
