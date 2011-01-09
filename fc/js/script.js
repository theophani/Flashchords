/*jslint browser: true */
/*global jQuery : false */

/*
 * Author: Tiffany Conroy
 */

/*
 * Flashchords!
 * Displays a chord
 */

(function($){

  var buildStringElement = function (options) {
    var s = options.s || { "tuning": "" };
    var hidden = options.hidden;
    var s_output = $('<div class="string s_'+s.tuning+'" />');
    if (s.fret !== null) {
      s_output.append(
        $('<div class="fret fr_'+s.fret+'" />').append(
          function() {
            return (s.finger ? '<span class="finger fi_'+s.finger+'">'+s.finger+'</span>' : null );
          }));
    } else {
      s_output.addClass('quiet');
    }
    if (hidden) { s_output.addClass('hidden'); }
    return s_output;
  };

  $.fn.extend({
    flashchord : function (options) {
      var json = options.json;
      var hidden = options.hidden || false;
      var s;
      this.addClass('flashchord');
      this.html('<h1>'+json.chord+'</h1>');
      for ( s in json.strings ) {
        this.append(buildStringElement({ s: json.strings[s], hidden : hidden }));
      }
      if (hidden) { $(this).flashchordReveal(options); }
    },
    flashchordReveal : function (options) {
      var delay = options.delay || 1000;
      var duration = options.duration || 1000;
      var that = this;
      setTimeout( function(){
        $(that).find('.string').fadeIn(duration);
      }, delay);
    }
  });
  
}(jQuery));

(function($){

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

  var chords = ['A','Am','C','D','Dm','D7','E','Em','F','G', 'H'],
      i = 0, old = 0;
  var default_period = 4000;

  var showFlashCard = function (period) {
    period = period || default_period;
    
    // don't show the same one again
    while ( i === old ) {
      i =  Math.floor( Math.random() * chords.length );
    }
    old = i;
    
    $.ajax({
      url: '/chord/'+chords[i],
      dataType: 'json',
      context: $('#main'),
      success: function(json) {
        $(this).flashchord({json : json, hidden: true});
      }
    });
    setTimeout(showFlashCard,period);
  };
  
  showFlashCard();

}(jQuery));



















