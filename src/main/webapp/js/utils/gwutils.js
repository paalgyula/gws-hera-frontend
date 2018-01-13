/**
 * @author goofy
 * @since 2010
 */
function GWSUtils() {
	this.utils = new function() {
		/**
		 * Szam megadasaval vitezkoti a szamot (100000 -> 100.000)
		 * @param {Object} number
		 */
		this.formatNumber = function( number ) {
			var negativ = false;
			if (number < 0) {
				number = 0 - number;
				negativ = true;
			}
			
			number = Math.round( number );
			number += '';
			ret = '';
			for( i=number.length;i>=0;i-- ) {
				ret = number.charAt( i ) + ret;
				if ( ( ( number.length - i ) % 3 == 0 ) && ( i != number.length ) && ( i != 0 ) )
					ret = '.'+ret;
			}
			
			if ( negativ ) {
				ret = '-' + ret;
			}
			
			return ret;
		}
	}
}

GWS = new GWSUtils();
