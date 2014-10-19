// TextTile Kernel
stackMachine.prototype.preCompile = function( str ) {
	this.memmory.output = '';
	this.stack      = [];
	this.paramStack = [];

	str = str.replace( /[\n\r]/g, " <CARRY_RETURN> " );
	str = str.replace( /[\n\r]/g, " <CARRY_RETURN> " );
	
	linkRegexp = new RegExp( /"([\w\s]+?)"\:([^\s]+)/g );
	matches    = str.match( linkRegexp );
	
	while ( match = linkRegexp.exec( str ) ) {
		htmlLink = '<a href="' + match[2] + '">' + match[1] + '</a>';
		str = str.replace( match[0], htmlLink );
	}
	
	return str;
}

stackMachine.prototype.closeListIfNeeded = function( currentTag ) {
	if ( this.tos( 'paramStack' ) == '<UL>' && currentTag != 'li' )
		this.memmory.output += '</ul>';
}

stackMachine.prototype.tag = function( tag, properties ) {
	properties = properties || '';
	this.closeListIfNeeded( tag );
	
	this.memmory.output += '<' + tag + properties + '>';
	
	this.iterate( 
		this,
		function( el ) { return  ( el != '<CARRY_RETURN>' ); },
		function( el ) { this.memmory.output += ' ' + this.style( el ); },
		function()     { return this.stack.pop(); }
	);
	
	this.memmory.output += '</' + tag + '>';
}

stackMachine.prototype.acc = function( el ) {
	this.memmory.accumulate += ' ' + el;
}

stackMachine.prototype.htmlInput = function() {
	this.memmory.accumulate = '';
	this.closeListIfNeeded( false );
	
	this.iterate( 
		this,
		function( el ) { return  ( el != '<CARRY_RETURN>' ); },
		function( el ) { this.acc( el ); },
		function()     { return this.stack.pop(); }
	);
	
	acc = this.memmory.accumulate;
	this.memmory.output += '<input type="' + acc + '" placeholder="' + acc + '"/>';
}

stackMachine.prototype.button = function( type ) {
	this.tag( 'button', ' class="' + type + '"' );
}

stackMachine.prototype.style = function( element ) {
	var styles = {
		 '*' : 'strong',
         '+' : 'ins',
         '-' : 'del',
         '_' : 'em'
	}
	
	if ( typeof( element.length ) == 'undefined' )
		return '';
	
	if ( element.length < 2 )
		return element;
	
	first = element.substring( 0, 1 );
	last  = element.substring( element.length-1, element.length );
	
	
	if ( _.has( styles, first ) ) {
		element = element.substring( 1, element.length );
		element = '<' + styles[first] + '>' + element;		
	}
	
	if ( _.has( styles, last ) ) {
		element = element.substring( 0, element.length-1 );
		element += '</' + styles[last] + '>';
	}
	
	return element;
}

stackMachine.prototype.open_centered_div = function() {
	this.closeListIfNeeded( false );
	this.memmory.output += '<div class="centered">';
}

stackMachine.prototype.close_centered_div = function() {
	this.closeListIfNeeded( false );
	this.memmory.output += '</div>';
	console.log( this.memmory.output );
}

stackMachine.prototype['h1.'] = function() { this.tag( 'h1' ); }
stackMachine.prototype['h2.'] = function() { this.tag( 'h2' ); }
stackMachine.prototype['h3.'] = function() { this.tag( 'h3' ); }
stackMachine.prototype['h4.'] = function() { this.tag( 'h4' ); }
stackMachine.prototype['p.']  = function() { this.tag( 'p' );  }
stackMachine.prototype['bq.'] = function() { this.tag( 'blockquote' );  }

stackMachine.prototype['btn.'] = function() { this.tag( 'button' );  }
stackMachine.prototype['btn-s.'] = function() { this.button( 'success' );  }
stackMachine.prototype['btn-w.'] = function() { this.button( 'warning' );  }
stackMachine.prototype['btn-e.'] = function() { this.button( 'error' );  }
stackMachine.prototype['btn-d.'] = function() { this.button( 'dull' );  }

stackMachine.prototype['>>']  = function() { this.open_centered_div();  }
stackMachine.prototype['<<']  = function() { this.close_centered_div();  }
stackMachine.prototype['br.'] = function() { this.memmory.output += '<BR>';  }
stackMachine.prototype['?']   = function() { this.htmlInput();  }


stackMachine.prototype['*']   = function() { 
	if ( this.tos( 'paramStack' ) != '<UL>' ) {
		this.memmory.output += '<ul>';		
		this.paramStack.push( '<UL>' );
	}
	this.tag( 'li' ); 
}

stackMachine.prototype['<CARRY_RETURN>'] = function() { return; }

stackMachine.cutPattern = /[\s]+/;

sm = new stackMachine();
sm.strToStack( document.getElementById('code').value, false );
sm.executeAll( false );

document.getElementById('result').innerHTML = sm.memmory.output;

document.getElementById('code').addEventListener('keyup', function (e){
    sm.strToStack( document.getElementById('code').value, false );
	sm.executeAll( false );
	
	document.getElementById('result').innerHTML = sm.memmory.output;
}, false);

