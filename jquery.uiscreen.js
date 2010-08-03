// UIscreen v0.1.0
// http://github.com/sinefunc/jquery.uiscreen
//
// Basic usage:
//
//   $("#element").screen();
//   $("#element").unscreen();
//   $.unscreen(); // remove all screens
//
;(function($) {
  $.uiscreen = $.extend(function(el) {
    $.uiscreen.activate(el);
  }, {
    // State
    $screens: [],

    // Options
    background: '#555555',
    opacity: 0.5,
    screen_template: "<div class='uiscreen'><div class='uiscreen-spinner'></div></div>",
    z_index: 10010,
    fadein_time: 250,
    fadeout_time: 0,

    // Methods
    activate: function(el) {
      var $el = $(el);
      if ($(el).length === 0) { return false; }

      var id = "uiscreen-for-" + ($el.attr('id') ? $el.attr('id') : 'noid');

      var $screen = this.$screen($el);
      $screen
        .css({
          'top':    $el.offset().top,
          'left':   $el.offset().left,
          'width':  $el.outerWidth(),
          'height': $el.outerHeight(),
          'opacity': this.opacity
        })
        .data('parent', $el)
        .attr('id', id)
        .addClass('fadein')
        .show()
        .animate(
          { 'opacity': this.opacity },
          this.fadein_time,
          function() {
            $(this).removeClass('fadein');
          });
    },

    kill: function(el) {
      var $el     = $(el);

      if (!$el.data('$screen')) {
        return;
      }

      $el.data('$screen')
        .addClass('fadeout')
        .animate(
          { 'opacity': 0 },
          this.fadeout_time,
          function() {
            $(this).remove();
          });

      $el.data('$screen', null);
    },

    // Return the screen for a certain element
    $screen: function($el) {
      if ($el.data('$screen')) { return $el.data('$screen'); }

      // Construct the screen.
      var $screen =
        $(this.screen_template).
          css({
            'position': 'absolute',
            'margin': 0,
            'padding':0,
            'border': 0,
            'top':    0,
            'left':   0,
            'width':  1,
            'height': 1,
            'z-index': this.z_index
          })
          .hide();

      if (this.background)
        { $screen.css({ 'background': this.background }); }

      $(document.body).append($screen);
      this.$screens.push($screen);

      $el.data('$screen', $screen);
      return $screen;
    }
  });

  $.unscreen = function() {
    var $parents = $('');
    for (i in $.uiscreen.$screens) {
      var screen = $.uiscreen.$screens[i];
      var $parent = screen.data('parent');
      if ($parent.unscreen) { $parent.unscreen(); }
    }
  };

  $.fn.screen = function() {
    this.each(function() {
      $.uiscreen.activate($(this));
    });
    return this;
  };

  $.fn.unscreen = function() {
    this.each(function() {
      $.uiscreen.kill($(this));
    });
    return this;
  };
})(jQuery);
