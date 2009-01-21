window.addEvent('domready', function(){
	$$('input','textarea').each(function(i){ i.set('value','test'); new GrowingInput(i); })
});