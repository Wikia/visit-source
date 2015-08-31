var testrunner = require('qunit');

testrunner.setup({
	log: {
		// log assertions overview
		assertions: true,
		// log expected and actual values for failed tests
		errors: true,
		// log tests overview
		tests: true,
		// log summary
		summary: true,
		// log global summary (all files)
		globalSummary: false,
		// log currently testing code file
		testing: true
	}
});

testrunner.run({
	code: {
		path: __dirname + '/../dist/visit-source.cjs.js',
		namespace: 'VisitSource'
	},
	tests: __dirname + '/visit-source.js'
}, function (err, report) {
	if (err) {
		console.error(err)
		process.exit(1);
	} else {
		console.log('Done');
	}
});
