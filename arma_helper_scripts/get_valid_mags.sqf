// Function to get valid magazines for an array of weapon classnames using compatibleMagazines
getValidMagazines = {
	private["_weaponArray", "_validMagazines"];
	// Retrieve the weapon classnames from the function arguments
	_weaponArray = _this;
	// Initialize an empty array to store valid magazines
	_validMagazines = [];
	// Loop through each weapon className in the array
	{
		// get the compatible magazines for the current weapon className
		_magazines = compatibleMagazines _x;
		// Filter out invalid magazines (e.g., empty or null classnames)
		_validMagazines = _validMagazines + _magazines - [""];
	} forEach _weaponArray;
	// Remove duplicate entries from the resulting array
	_validMagazines = _validMagazines arrayIntersect _validMagazines;
	// Return the array of valid magazines
	_validMagazines;
};

// Example usage:
_weaponArray = [
	"UK3CB_BAF_L85A3",
];

_validMagazinesArray = _weaponArray call getValidMagazines;

copyToClipboard str _validMagazinesArray;
