var stackMachine = function(){
	this.stack       = [];
	this.paramStack  = [];
	this.memmory     = {};
	this.cutPattern = new RegExp(/[\s]/g);
	
	//this.preCompile = function( str ) { return str; }
	this.cut        = function( str ) { return str.split( this.cutPattern ); }
	this.tos        = function( stackName ) { return _.last( this[stackName] ); }
	
	this.strToStack = function( str, append ) {
		str = this.preCompile( str );
        this.listToStack( this.cut( str ), append );
	}
	
	this.listToStack = function( list, append ) {
		if ( append == false )
			this.stack = list.reverse();
		else
			list.forEach( function( element ) { this.stack.push( element ) } )
	}
	
	this.executeAll = function( endStr ) {
		var element = this.stack.pop();
		while ( this.stack.length > 0 || ( endStr !== false && ( $element == endStr ) ) ) {
			this.executeOne( element );
			element = this.stack.pop();
		}
	}
	
	this.executeOne = function( element ) {
		if ( ( typeof( this[element] ) == 'undefined' ) || this[element] == '' )
			return;
		
		if ( typeof( this[element] ) == 'function' )
			this[element]();
		else
			this.paramStack.push( element );		
	}
	
	this.iterate = function( context, condFunction, bodyFunction, elementFunction ) {
		var el = elementFunction.call( context );
		while ( condFunction.call( context, el ) ) {
			bodyFunction.call( context, el );
			el = elementFunction.call( context );
		}
	}
	
	return this;
}


/*
sm = new stackMachine();
stackMachine.prototype['>>'] = function() { toprint = this.stack.pop(); console.log( 'print:' + toprint ); }
sm.strToStack('>> Alfredo SEGUNDO TERCERO', false);
console.log( sm.stack );
sm.executeAll( false );
*/