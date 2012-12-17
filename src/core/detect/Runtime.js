(function() 
{
	var global = (function(){ return this || (1,eval)('this') })();
	
	/**
	 * Holds basic informations about the environment the script is running in.
	 */
	core.Module("core.detect.Runtime", {
		VALUE :	core.Type.isHostType(global, 'document') && core.Type.isHostType(global, 'navigator') ? "browser" : "native"
	});

})();
