// Function to get valid items (attachments) for an array of weapon classnames using compatibleItems
getValidItems = {
	private["_weaponArray", "_validItems"];

	// Retrieve the weapon classnames from the function arguments
	_weaponArray = _this;

	// Initialize an empty array to store valid items (attachments)
	_validItems = [];

	// Loop through each weapon className in the array
	{
		// get the compatible items for the current weapon className
		_items = compatibleItems _x;

		// Filter out invalid items (e.g., empty or null classnames)
		_validItems = _validItems + _items - [""];
	} forEach _weaponArray;

	// Remove duplicate entries from the resulting array
	_validItems = _validItems arrayIntersect _validItems;

	// Return the array of valid items (attachments)
	_validItems;
};

// Example usage:
_weaponArray = [
	"ACE_Flashlight_Maglite_ML300L",
	"ACE_VMH3",
	"ACE_VMM3",
	"UK3CB_BAF_AT4_CS_AP_Launcher",
	"UK3CB_BAF_AT4_CS_AT_Launcher",
	"UK3CB_BAF_Javelin_Slung_Tube",
	"UK3CB_BAF_L105A1",
	"UK3CB_BAF_L105A2",
	"UK3CB_BAF_L107A1",
	"UK3CB_BAF_L110A1",
	"UK3CB_BAF_L110A2",
	"UK3CB_BAF_L110A2RIS",
	"UK3CB_BAF_L110A2_FIST",
	"UK3CB_BAF_L110A3",
	"UK3CB_BAF_L110_762",
	"UK3CB_BAF_L111A1",
	"UK3CB_BAF_L115A3",
	"UK3CB_BAF_L117A2",
	"UK3CB_BAF_L129A1",
	"UK3CB_BAF_L129A1_AFG",
	"UK3CB_BAF_L129A1_AFG_D",
	"UK3CB_BAF_L129A1_AFG_G",
	"UK3CB_BAF_L129A1_AFG_T",
	"UK3CB_BAF_L129A1_AFG_W",
	"UK3CB_BAF_L129A1_Bipod",
	"UK3CB_BAF_L129A1_FGrip",
	"UK3CB_BAF_L129A1_FGrip_Bipod",
	"UK3CB_BAF_L129A1_Grippod",
	"UK3CB_BAF_L129A1_Grippod_D",
	"UK3CB_BAF_L129A1_Grippod_G",
	"UK3CB_BAF_L129A1_Grippod_T",
	"UK3CB_BAF_L129A1_Grippod_W",
	"UK3CB_BAF_L131A1",
	"UK3CB_BAF_L134A1",
	"UK3CB_BAF_L134_A1",
	"UK3CB_BAF_L135A1",
	"UK3CB_BAF_L16",
	"UK3CB_BAF_L16_Tripod",
	"UK3CB_BAF_L22A2",
	"UK3CB_BAF_L7A2",
	"UK3CB_BAF_L85A3",
	"UK3CB_BAF_L85A3_AFG",
	"UK3CB_BAF_L85A3_AFG_D",
	"UK3CB_BAF_L85A3_AFG_G",
	"UK3CB_BAF_L85A3_AFG_T",
	"UK3CB_BAF_L85A3_AFG_W",
	"UK3CB_BAF_L85A3_Grippod",
	"UK3CB_BAF_L85A3_Grippod_D",
	"UK3CB_BAF_L85A3_Grippod_G",
	"UK3CB_BAF_L85A3_Grippod_T",
	"UK3CB_BAF_L85A3_Grippod_W",
	"UK3CB_BAF_L85A3_UGL",
	"UK3CB_BAF_L9A1",
	"UK3CB_BAF_M6",
	"UK3CB_BAF_NLAW_Launcher",
	"UK3CB_BAF_Tripod"
];

_validItemsArray = _weaponArray call getValidItems;

copyToClipboard str _validItemsArray;