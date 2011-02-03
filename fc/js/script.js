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
    if (s.fret !== undefined) {
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
      // unimplemented option to not show the chord
      var hidden = options.hidden || false;
      var s;
      this.addClass('flashchord');
      this.html('<h1>'+json.chord+'</h1>');
      if (hidden) {
        for ( s in json.strings ) {
          this.append(buildStringElement({ s: json.strings[s], hidden : hidden }));
        }
        $(this).flashchordReveal(options);
      }
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

  var chords = [{n:'A'},{n:'Am'},{n:'C'},{n:'D'},{n:'Dm'},{n:'D7'},{n:'E'},{n:'Em'},{n:'F'},{n:'G'},{n:'H'}],
      i = 0, old = 0;
  var default_period = 4000;

  var showFlashCard = function (options) {
    options = options || {};
    var period = options.period || default_period;
    
    // don't show the same one twice in a row
    while ( i === old ) {
      i =  Math.floor( Math.random() * chords.length );
    }
    old = i;
    
    if (chords[i].json) {
      // just use the stored copy
      $('#main').flashchord({json : chords[i].json, hidden: true});
    } else {
      // else fetch and store the json
      $.ajax({
        url: '/chord/'+chords[i].n,
        dataType: 'json',
        context: $('#main'),
        success: function(json) {
          chords[i].json = json;
          $(this).flashchord({json : json, hidden: true});
        }
      });  
    }
    
    setTimeout(function () { showFlashCard(options); }, period);
  };
  
  showFlashCard();

}(jQuery));



















