/* Author: Tiffany Conroy
*/

/* 
* Redirects all Ajax requests to static mocks as proxies
*/
$.mockjax(function(settings) {
  // settings.url == '/chord/<service>'
  var service = settings.url.match(/\/chord\/(.*)$/);
  if ( service ) {
    return {
      proxy: 'mock_chord/' + service[1] + '.json'
    };
  }
  return;
});

$(document).ready(function() {

(function($){

    var chords = ['A','Am','C','D','Dm','D7','E','Em','G'];
    var i = 0;

    function showFlashCard() {
      $.ajax({
        url: '/chord/'+chords[i],
        dataType: 'json',
        context: $('#main'),
        success: function(json) {
          $(this).flashchord(json);
          //$(this).flashchordReveal();
        }
      });
      i++;
      if (i>=chords.length) i = 0;
      setTimeout(showFlashCard,5000);
    }
    showFlashCard();

  

})(jQuery);

});



















