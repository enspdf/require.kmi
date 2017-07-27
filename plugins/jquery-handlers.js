$require.setHandler('css', (path, module) => {
	$('head').append(`<link rel="stylesheet" type="text/css" href="${path}">`);

	module.exports = { type: 'css', path: path };
});

$require.setHandler('html', (path, module) => {
	var request = GET(path);
	var content = request.responseText;

	if(request.status === 404) // If module not found
		throw { code: "MODULE_NOT_FOUND", message: `Module '${path}' not found.` };

	module.exports = $(content);
	module.disposable = true;
});

$require.setHandler('img', (path, module) => {
	module.exports = $(`<img src="${path}">`);
	module.disposable = true;
});

$require.setHandler('json', (path, module) => {
	var  request = GET(path);

	if(request.status === 404) // If module not found
		throw { code: "MODULE_NOT_FOUND", message: `Module '${path}' not found.` };

	module.exports = JSON.parse(request.responseText);
	module.disposable = true;
});