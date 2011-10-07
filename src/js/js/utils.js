/* Utilities for the FlashNotes JS routines */

/* Merge an array */
function Merge (dest, src){
	for (var property in src)
	{
		dest[property] = src[property];
	}
	return dest;
}

/* return a random position */
function randomPos (range){
	return Math.floor(Math.random() * range);
}

/* Save data to local storage */
function saveData (key, val){
	if(Modernizr.localstorage){
		localStorage.setItem(key, val);
	}
}

/* Retrieve data from local storage */
function getData (key){
	if(Modernizr.localstorage){
		return localStorage.getItem(key);
	}
}