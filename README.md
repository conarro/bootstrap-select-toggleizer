bootstrap-select-toggleizer
===========================

![Toggleizer Example](https://www.evernote.com/shard/s39/sh/3e451347-593a-4b38-bcb5-716544b65505/2c5b26afe2bf2b9d1e791f6963b38a2f/deep/0/Screenshot%206/24/13%2012:54%20AM.jpg)

Convert select boxes into Bootstrap button group toggles

## Usage

Create a select element:

```html
<select class="select-toggleizer">
  <option>Setting A</option>
  <option>Setting B</option>
  <option>Setting C</option>
</select>
```

And toggleize it:

```javascript
$('.select-toggleizer').toggleize();
```

## Options

```javascript
$('.select-toggleizer').toggleize({
  buttonClass: '', // additional classes for buttons
  buttonWidth: 'auto', // explicitly set button width (px or %)
  hideSelect: true, // hide original <select> element
  includeEmptyValues: false, // remove empty <option> elements before toggleize
  onToggleClick: null, // click callback handler, e.g. function(data) { console.log('toggle-click callback', data) }
  showTooltip: false, // include a tooltip on the button. uses data-title attribute of original <option> if present
  toggleClass: 'select-toggleizer-container', // class for toggle parent
  toggleContainer: null, // defaults to append to <select>
  toggleStyle: 'radio', // radio or checkbox style toggling (single vs. multiple) -- if <select multiple> will use checkbox style toggles
  tooltipPlacement: 'bottom', // placement of tooltip
  verbose: false, // log stuff to console
  vertical: false // arrange buttons vertically
});
```

Options can be set in the initialization object (as above), or data-attributes can be used:
```html
<select class="select-toggleizer" data-button-class='myCustomClass' data-show-tooltip='true'>
  <option data-title='some tooltip text'>Setting A</option>
  <option>Setting B</option>
  <option>Setting C</option>
</select>
```

## Copyright and license

Copyright (C) 2013 bootstrap-select-toggleizer

Licensed under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
