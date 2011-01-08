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

    var chords = ['A','Am','C','D','Dm','D7','E','Em','F','G', 'H'],
        i = 0, old = 0;

    function showFlashCard(period) {
      period = period || 4000;
      
      // don't show the same one again
      while ( i==old ) {
        i =  Math.floor( Math.random() * chords.length );
      }
      old = i;
      
      $.ajax({
        url: '/chord/'+chords[i],
        dataType: 'json',
        context: $('#main'),
        success: function(json) {
          $(this).flashchord(json,true);
        }
      });
      setTimeout(showFlashCard,period);
    }
    showFlashCard();

})(jQuery);

});



















