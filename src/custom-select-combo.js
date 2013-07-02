/**
* @author: Kyle Conarro
* @copyright: Copyright (c) 2013 Kyle Conarro. All rights reserved.
* @website: https://github.com/kconarro14
*/

;(function ( $, window, document, undefined ) {

  var customSelectCombo = "customSelectCombo",
    defaults = {
      alwaysShowInput: false, // show input regardless of selection
      customInputTarget: null, // id of element to attach the custom input to
      hideSelectOnTrigger: false, // if true, hides original select box when trigger options are selected
      inputDimensions: 'auto', // dimensions of the custom input. [width, height], 'default' or 'auto'
      setInputValueOnTrigger: true, // set the value of the input when triggered
      triggerValues: ['custom'], // option values on which to trigger the custom input
      verbose: false // output stuff to console
    };

  function CustomSelectCombo( element, options ) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend( {}, defaults, this.$element.data(), options );

    this._defaults = defaults;
    this._name = customSelectCombo;

    this.init();
  }

  CustomSelectCombo.prototype = {

    init: function() {
      if (this.options.verbose) console.log('customSelectCombo', this.$element);
      if (this.options.verbose) console.log('options', this.options);
      this.createCustomInput(this.$element);
      this.attachSelectEvents(this.$element);
    },

    createCustomInput: function($el) {
      var self = this;
      var input = $("<input type='text' class='custom-select-combo-input' style='display:none;'>")
      var placeholder = $el.find('option').filter(function() {
        return !this.value || $.trim(this.value).length == 0;
      }).text()
      input.attr('placeholder', placeholder);
      input.val($el.val()); // set initial value to selection
      self.addInputAttributes($el, input);
      self.attachInputEvents($el, input);
      $el.parent().append(input)
      self.customInput = input;
    },

    addInputAttributes: function($el, input) {
      var self = this;
      var width, height = null;
      if ($el.prop('id')) {
        input.prop('id', $el.prop('id'));
        $el.removeAttr('id');
      } 
      if ($el.prop('name')) {
        input.prop('name', $el.prop('name'));
        $el.removeAttr('name');
      }
      $el.addClass('custom-select-comboized');
      if (self.options.inputDimensions == 'auto') {
        width = $el.width();
        height = $el.height() + 2;
      } else if (self.options.inputDimensions != 'default') {
        width = self.options.inputDimensions[0];
        height = self.options.inputDimensions[1];
      }
      if (self.options.inputDimensions != 'default') {
        input.css({
          'width': width,
          'height': height
        });
      }
      if (self.options.alwaysShowInput) {
        input.show();
      }
    },

    attachInputEvents: function($el, input) {
      if (!this.options.alwaysShowInput) {
        input.change(function() {
          if ($(this).val() == '') {
            $el.show();
          }
        })  
      }
    },

    attachSelectEvents: function($el) {
      var self = this;
      var input = self.customInput;
      $el.change(function() {
        var currentOption = $el.find(":selected");
        var optionVal = $(currentOption).data('input-value') || $el.val();
        var selectVal = $el.val();
        input.val(optionVal);
        if (self.options.verbose) console.log(currentOption, optionVal, selectVal);
        if (self.options.alwaysShowInput == false) {
          if ($.inArray(selectVal, self.options.triggerValues) > -1) {
            input.show();
            if (self.options.setInputValueOnTrigger) {
              input.val(optionVal);
            } else {
              input.val('');
            }
            if (self.options.hideSelectOnTrigger) $el.hide();
          } else {
            input.hide();
          }
        }
      });
    }
  };

  $.fn[customSelectCombo] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "customSelectCombo")) {
        $.data(this, "customSelectCombo", new CustomSelectCombo( this, options ));
      } else {
        console.log('Already initialized a customSelectCombo on this element!', this);
      }
    });
  };

})( jQuery, window, document );
