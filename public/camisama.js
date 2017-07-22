function require (path) {
	var ext = path.substring(path.lastIndexOf('/'));

	if(ext.indexOf(".") === -1){
		ext = "js";
		path = `${path}.js`;
	} else{
		ext = ext.substring(ext.lastIndexOf('.') + 1);
	}

	if(require.modules[path])
		return require.modules[path].exports;

	var handler = require.getHandler(ext);
	var module = { exports: {}, path: path };

	if(handler) {
		var res = handler(path, module);

		if(res === false)
			return;

		if(!module.disposable) require.modules[path] = module

		return module.exports;
	} else throw `Unknown Extension ${ext} for ${path}`;
}

require.modules = {};
/*
* `./module` -> Same dir
* `/module`  -> root
* `module`   -> $modules folder
* `../module`-> prev_root
*/

require.resolve = (path, base) => {
	if(path[0] === "." && path[1] === "." && path[2] === "/"){
		while(path[0] === "." && path[1] === "." && path[2] === "/"){
			base = base.substring(0, base.lastIndexOf('/'));
			path = path.substring(3);
		}

		return `${base}/${path}`;
	}

	if(path[0] === "." && path[1] === "/")
		return `${base}/${path.substr(2)}`;

	if(path[0] === "/")
		return path;

	return `kmi_modules/${path}`;
}

require.handlers = {
	js: (path, module) => {
		var request = $.ajax({ url: path, method: 'GET', async: false, dataType: 'text-plain' });
		if(request.status === 404){
			path =`${path.substring(0, path.length - 3)}/index.js`;
			request = $.ajax({ url: path, method: 'GET', async: false, dataType: 'text-plain' });
		}
		
		if(request.status === 404)
			throw "MODULE_NOT_FOUND";

		var content = request.responseText;

		var folder = path.substring(0, path.lastIndexOf('/'));
		try {
			var fn = new Function(['require', '__dirname', 'module', 'exports'], content);
			fn.name = path;
			fn((p) => require(require.resolve(p, folder)), folder, module, module.exports);	
		} catch (exc) {
			var caller_line = exc.stack.split("\n")[5];
			
			console.log(`${exc.name} on ${path} => ${exc.message} at line ${caller_line.substring(caller_line.indexOf("at ") + 3, caller_line.length)}`);
			console.log(exc.stack);
		}
	},

	css: (path, module) => {
		$('head').append(`<link rel="stylesheet" type="text/css" href="${path}">`);

		module.exports = { type: 'css', path: path };
	},

	html: (path, module) => {
		var request = $.ajax({ url: path, method: 'GET', async: false, dataType: 'text-plain' });
		var content = request.responseText;

		module.exports = $(content);
		module.disposable = true;
	},

	img: (path, module) => {
		module.exports = $(`<img src="${path}">`);
		module.disposable = true;
	}, 
	jpg: 'img', png: 'img', gif: 'img',

	json: (path, module) => {
		module.exports = JSON.parse($.ajax({ url: path, method: 'GET', async: false, dataType: 'text-plain' }).responseText);
		module.disposable = true;
	}
};

require.addHandler = (ext, fn) => require.handlers[ext.toLowerCase()] = fn;
require.getHandler = (ext) => {
	var handler = require.handlers[ext.toLowerCase()];
	if(typeof handler === 'string')
		return require.getHandler(handler);

	return handler;
}

$(function () {
	var entry = $('meta[kmi-init]').attr('kmi-init');

	if(entry)
		require(entry);
});
