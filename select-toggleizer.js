/**
* @version: 0.1
* @author: Kyle Conarro
* @date: 05-20-2013
* @copyright: Copyright (c) 2013 Kyle Conarro. All rights reserved.
* @license: Licensed under Apache License v2.0. See http://www.apache.org/licenses/LICENSE-2.0
* @website: http://rigor.com
*/

// utility
if ( typeof Object.create !== 'function' ) {
  Object.create = function(obj) {
    function F() {};
    F.prototype = obj;
    return new F();
  };
}

(function( $, window, document, undefined ) {
  var Toggleize = {
    init: function( options, elem ) {
      var self = this;
      self.elem = elem;
      self.$elem = $(elem);
      
      self.$selectOptions = self.$elem.find('option');
      
      self.options = $.extend({}, $.fn.toggleize.options, self.$elem.data(), typeof options == 'object' && options);
      
      self.options.toggleStyle = self.$elem.prop('multiple') ? 'checkbox' : 'radio';
      self.verbose = self.options.verbose;
      
      if (self.verbose) {
        console.log('verbose', self.verbose);
        console.log('options', self.options);
      } 

      if (this.$elem.siblings('.' + this.options.toggleClass).length == 0) {
        self.createToggles();
      } else {
        if (self.verbose) console.log('element already toggleized!', this.elem);
        return;
      }

    },

    createToggles: function() {
      var self = this;
      self.buildButtonGroup();
      self.render();
    },

    removeEmptyOptions: function(selectEl) {
      selectEl.find('option').filter(function() {
        return !this.value || $.trim(this.value).length == 0;
      }).remove();
      return selectEl.find('option');
    },

    createButtons: function() {
      var self = this;
      var selectOptions = self.options.includeEmptyValues == true ? this.$selectOptions : self.removeEmptyOptions(this.$elem)

      // create buttons from select options
      var buttons = $.map(selectOptions, function(option) {
        var btn = $("<button type='button' class='btn select-button-toggle'></button>").attr('data-value', option.value);
        if ($(option).data('icon')) {
          btn.append('<i class="' + $(option).data('icon') + '" </i> ');
          if ($(option).data('label')) btn.append($(option).data('label'));
        } else {
          $(option).data('label') ? btn.append($(option).data('label')) : btn.append(option.text);
        }
        
        if (option.value == '') $(option).addClass('.disabled')

        $(option).data('title') ? btn.attr('data-title', $(option).data('title')) : btn.attr('data-title', option.text) // set tooltip title

        if ($(option).prop('selected')) btn.addClass('active'); // set active button

        return btn;
      });

      var $buttons = $(buttons);
      self.attachButtonEvents($buttons);
      self.attachButtonAttributes($buttons);
      self.setButtonWidths($buttons);

      var rawButtons = $buttons.map(function() { return this[0]; })
      if (self.verbose) console.log('created buttons', $buttons, rawButtons);
      return rawButtons;
    },

    setButtonWidths: function($buttons) {
      var self = this;
      if (self.options.buttonWidth == 'smart') {
        var width = self.smartButtonWidth($buttons);
        $buttons.each(function() { $(this).width(width) });
      } else if (self.options.buttonWidth != 'auto') {
        $buttons.each(function() { $(this).width(self.options.buttonWidth) });
      }
    },

    smartButtonWidth: function($buttons) {
      var maxWidth = 0;
      $buttons.each(function(index) {
        var drawnButton = $(this).clone().appendTo('body');
        if (drawnButton.width() > maxWidth) {
          maxWidth = drawnButton.width();
          if ($(this).find('i') != null) maxWidth += 30; // add width if icon in label
        }
        drawnButton.remove();
      });
      return maxWidth;
    },

    attachButtonAttributes: function($buttons) {
      var self = this;
      $buttons.each(function(index, button) {
        var $button = $(button);
        $button.addClass(self.options.buttonClass);
        if (self.options.showTooltip == true) {
          $button.tooltip({
            placement: self.options.tooltipPlacement,
            container: 'body' // to fix bootstrap bug for tooltips on buttons
          })
        }
        button = $button[0];
      });
    },

    attachButtonEvents: function($buttons) {
      var self = this;
      $buttons.each(function(index, button) {
        var $button = $(button);
        self.options.toggleStyle == 'checkbox' ? self.attachMultiSelectEvent($button) : self.attachSingleSelectEvent($button);
      });
    },

    attachMultiSelectEvent: function($button) {
      var self = this;
      $button.click(function() {
        // get active toggle buttons
        var activeButtons = $button.siblings('button.active');
        if (!$button.hasClass('active')) {
          activeButtons.push($button);
        }
        
        // get active button values
        var values = $.map(activeButtons, function(obj) {
          return $(obj).data('value');
        })

        self.setSelectedOptions(values);
        self.triggerClickEvent(values);
      });
    },

    attachSingleSelectEvent: function($button) {
      var self = this;
      $button.click(function() {
        var value = $(this).data('value');
        self.setOption(value);
        self.triggerClickEvent(value);
      });
    },

    triggerClickEvent: function(data) {
      var self = this;
      self.$elem.trigger('toggle-click', [data]);
      self.$elem.trigger('change'); // trigger change event on original select
      if (typeof self.options.onToggleClick === 'function') {
        self.options.onToggleClick.apply(self.elem, data);
      }
      if (self.verbose) console.log('toggle-click data', data);
    },

    setOption: function(value) {
      this.$elem.val(value);
    },

    setSelectedOptions: function(values) {
      var self = this;
      self.$selectOptions.prop('selected', false);
      for (i=0; i < values.length; i++) {
        self.$selectOptions.filter('[value="' + values[i] + '"]').prop('selected', true);  
      }
    },

    getSelectedOptions: function() {
      var selected = self.$selectOptions.find(":selected");
      if (self.verbose) console.log('selected options', selected);
      return selected;
    },

    buildButtonGroup: function() {
      var self = this;
      var buttons = self.createButtons();
      var buttonGroup = $('<div class="' + self.options.toggleClass + ' btn-group">').append(buttons);
      var toggleType = 'buttons-' + self.options.toggleStyle;
      buttonGroup.attr('data-toggle', toggleType);
      if (self.options.vertical == true) buttonGroup.addClass('btn-group-vertical');
      if (self.verbose) console.log('button group', buttonGroup);
      self.buttonGroup = buttonGroup;
    },

    render: function() {
      if (this.options.toggleContainer) {
        $(this.options.toggleContainer).append(this.buttonGroup);
      } else {
        this.$elem.after(this.buttonGroup);
      }
      if (this.options.hideSelect) this.$elem.hide();
    }

  };

  $.fn.toggleize = function( options ) {
    return this.each(function() {
      var toggle = Object.create(Toggleize);
      toggle.init(options, this);
    });
  };

  $.fn.toggleize.options = {
    buttonClass: '', // additional classes for buttons
    buttonWidth: 'auto', // 'auto', someNumber(px or %)
    hideSelect: true, // hide original <select> element
    includeEmptyValues: false, // remove empty <option> elements before toggleize
    onToggleClick: null, // function(data) { console.log('toggle-click callback', data) }
    showTooltip: false, // uses data-title attribute if present
    toggleClass: 'select-toggleizer-container', // class for toggle parent
    toggleContainer: null, // defaults to append to <select>
    toggleStyle: 'radio', // or checkbox -- if multiselect, will use checkbox style toggles
    tooltipPlacement: 'bottom', // placement of tooltip
    verbose: false, // log stuff to console
    vertical: false // vertical group
  };

})( jQuery, window, document );