SC_fnc_sortConfig = {
	params[ "_config", "_type", [ "_subType", "" ], ["_excludeSubTypes", ""] ];

	("getNumber( _x >> 'scope' ) isEqualTo 2"configClasses( configFile >> _config) select {
		configName _x call BIS_fnc_itemType params[ "_itemType", "_itemSubType" ];
		_type == _itemType && {
			( count _subType == 0 || {
				_itemSubType in _subType
			} ) &&
			!(_itemSubType in _excludeSubTypes)
		}
	}) apply {
		configName _x
	};
};

{
	_x params[ "_var", "_parameters" ];

	missionNamespace setVariable [ _var, _parameters call SC_fnc_sortConfig ];
	} forEach [
		// [ Global Var, [ Config, type, SubType/s, ExcludeSubType/s ] ]

		[ "SC_backpacks", [ "CfgVehicles", "Equipment", "Backpack", "" ] ],
		[ "SC_glasses", [ "CfgGlasses", "Equipment", "Glasses", "" ] ],
		[ "SC_helmets", [ "CfgWeapons", "Equipment", "Headgear", "" ] ],
		[ "SC_uniforms", [ "CfgWeapons", "Equipment", "Uniform", "" ] ],
		[ "SC_vests", [ "CfgWeapons", "Equipment", "Vest", "" ] ],

		[ "SC_items",
			[ "CfgWeapons", "Item", "",
				["AccessoryMuzzle", "AccessoryPointer", "AccessorySights", "Binocular", "Compass", "FirstAidKit", "GPS", "LaserDesignator", "Map", "Medikit", "MineDetector", "NVGoggles", "Radio", "Toolkit", "Watch"]
			]
		],
		[ "SC_equipment",
			[ "CfgWeapons", "Item",
				["Binocular", "Compass", "FirstAidKit", "GPS", "LaserDesignator", "Map", "Medikit", "MineDetector", "NVGoggles", "Radio", "Toolkit", "Watch"],
				["AccessoryMuzzle", "AccessoryPointer", "AccessorySights"]
			]
		],

		[ "SC_weapon_accessories", [ "CfgWeapons", "Item", [ "AccessoryMuzzle", "AccessoryPointer", "AccessorySights" ], "" ] ],
		[ "SC_weapons_primary", [ "CfgWeapons", "Weapon", [ "AssaultRifle", "MachineGun", "Rifle", "SubmachineGun", "SniperRifle" ], "" ] ],
		[ "SC_weapons_secondary", [ "CfgWeapons", "Weapon", [ "Launcher", "MissileLauncher", "RocketLauncher", "Mortar" ], "" ] ],
		[ "SC_weapons_handguns", [ "CfgWeapons", "Weapon", "Handgun", "" ] ],
		[ "SC_magazine_misc", [ "CfgMagazines", "Magazine", ["Grenade", "SmokeShell", "UnknownMagazine"], "" ] ],
		[ "SC_all_mags", ["CfgMagazines", "Magazine", "", "" ] ]
		// [ "SC_mines", [ "CfgWeapons", "Mine", "", "" ] ],
	];

	copyToClipboard str SC_all_mags;