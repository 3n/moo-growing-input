var GrowingInput = new Class({
	
	Implements: Options,
	
	options: {
		max_width: 600
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
		if (this.element.get('type') && this.element.get('type') != 'text') {return null;}
		
		this.refresh()

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
		this.fake_div.set( 'html', this.htmlspecialchars(this.element.get('value')) )
		this.element.setStyles({
			'width': Math.min( this.options.max_width, Math.max(this.fake_div.getStyle('width').toInt()+10, this.min_width)),
			'overflow':'hidden'
		})
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
		this.fake_div.set( 'html', this.htmlspecialchars(this.element.get('value')).replace(/[\n]/g, '<br />&nbsp;') )
		this.element.setStyles({
			'height': this.fake_div.getStyle('height'),
			'overflow':'hidden'
		})
	},
	htmlspecialchars: function(text) {
	  if (typeof(text) == 'undefined' || !text.toString) { return ''; }
	  if(text === false) {
	      return '0';
	  } else if (text === true) {
	      return '1';
	  }
	  return text.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	},
	refresh: function(){
		this.min_width = this.element.getWidth();
	}
});

Element.implement({
	copyStyles: function(elem, styles){
		styles.each(function(s){
			try {
				this.setStyle(s,elem.getStyle(s))
			}catch(e){}
		},this)
		return this
	}
});