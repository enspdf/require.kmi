// Require JS
	var parrot = require('./parrot');

	parrot.sayHello(); // Hello Niggas!

	console.log(require('./parrot') === require('./parrot')); // True, so the modules are cached
// Require Module (Folder), Throws little exception (Ignore it)
	var Animal = require('./animal');

	Animal.Dog.Scream(); // Guau guau!
	Animal.Cat.Scream(); // Meeooow!

	console.log(require('./animal') === require('./animal')); // True, so the modules are cached

// Require CSS File
	require('./css/styles.css'); // Turns background red

	console.log(require('./css/styles.css') === require('./css/styles.css')); // True, so the modules are cached

// Require HTML Data
	var ann = require('./announcement.html');

	console.log(ann);

	$('body').append(ann);

	console.log(require('./announcement.html') === require('./announcement.html')); // False, we need every html to be a different DOM element

// Require Image
	var img = require('./dice.png');

	console.log(img);

	$('body').append(img);

	console.log(require('./dice.png') === require('./dice.png')); // False, we need every image to be a different DOM element

// Require JSON
	var config = require('./config.json');

	console.log(config);

	console.log(require('./config.json') === require('./config.json')); // False