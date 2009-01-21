/*
Script: GrowingInput.js
	GrowingInput is a class for MooTools that will add auto-expanding to any input
	or textarea element (as the user types the input grows to accommodate it).
	Options:
		keep_min_width: (bool) makes sure INPUT doesn't shrink in width beyond where it started
		max_width: 			(string) makes sure INPUT doesn't grow in width beyond this px value
*/

var GrowingInput = new Class({
	
	Implements: [Options, Events],
	
	options: {
		keep_min_width : true
	},
	
	initialize: function(elem, options){
		this.setOptions(options)
		this.element = elem		
		this.setup()
		return this
	},
	setup: function(){
		if 			(this.element.get('tag').toLowerCase() == "input") 		this.setup_input()
		else if (this.element.get('tag').toLowerCase() == "textarea") this.setup_textarea()
	},
	setup_input: function(){
		if (this.element.get('type') && this.element.get('type') != 'text') return
				
		this.min_width = this.element.getWidth();

		this.fake_div = new Element('div', {
			"id" : "fake_" + this.element.get('id')
		});

		this.fake_div.inject(this.element,'after').setStyles({
			'position': 			'absolute',
			'left': 					'-100000px',
			'top': 						'-100000px'
		});

		this.fake_div.copyStyles(this.element,[
			'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'height',
			'font-weight', 'font-size', 'font-family', 'border-width', 'border-style', 'line-height' 
		]);

		this.element.addEvent('keyup', this.input_keyup.bind(this))
	},
	input_keyup: function(){
		this.fake_div.set('html', this.element.get('value').replace_html_chars())
		var width = this.fake_div.getStyle('width').toInt() + 20
		
		if (this.options.max_width) 			width = Math.min(this.options.max_width, width)
		if (this.options.keep_min_width)	width = Math.max(this.min_width, width)
		
		this.element.setStyles({
			'width'		 : width,
			'overflow' : 'hidden'
		})
		
		this.fireEvent('onSized')
	},
	setup_textarea: function(){
		this.fake_div = new Element('div', {
			"id" : "fake_" + this.element.get('id')
		}).inject(this.element,'after').setStyles({
			'position': 			'absolute',
			'left': 					'-100000px',
			'top': 						'-100000px'
		}).copyStyles(this.element, [
			'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
			'width', 'font-size', 'font-weight', 'font-family', 'border-width', 'line-height', 'border-style' 
		]).setStyle('min-height', this.element.getStyle('height'))
		
		this.element.addEvent('keyup', this.textarea_keyup.bind(this))
	},
	textarea_keyup: function(){
		this.fake_div.set( 'html', this.element.get('value').replace_html_chars().replace(/[\n]/g, '<br />&nbsp;'))

		this.element.setStyles({
			'height': this.fake_div.getStyle('height').toInt(),
			'overflow':'hidden'
		})
		
		this.fireEvent('onSized')
	},
	refresh: function(){
		this.min_width = this.element.getWidth();
	}
});
