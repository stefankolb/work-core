(function() 
{
	var global = core.Main.getGlobal();
	
	/**
	 * Holds basic informations about the environment the script is running in.
	 */
	core.Module("core.detect.Runtime", {
		VALUE :	core.Main.isHostType(global, 'document') && core.Main.isHostType(global, 'navigator') ? "browser" : "native"
	});

})();
