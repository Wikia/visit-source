QUnit.module('Visit source tests');

QUnit.test('Test get()', function(assert) {
	var testCases = [
		{
			cookieString: 'wikiaReferrer=http://google.com',
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia.com',
			expected: 'http://google.com'
		},
		{
			cookieString: 'baz=foo; wikiaReferrer=http://google2.com; foo=bar',
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia.com',
			expected: 'http://google2.com'
		},
		{
			cookieString: 'baz=foo; otherCookieName=http://wikia.com; foo=bar',
			cookieName: 'otherCookieName',
			cookieDomain: 'wikia.com',
			expected: 'http://wikia.com'
		},
		{
			cookieString: '',
			cookieName: 'otherCookieName',
			cookieDomain: 'wikia.com',
			expected: undefined
		}
	];

	testCases.forEach(function(testCase) {
		var visitSource = new VisitSource(testCase.cookieName, testCase.cookieDomain);

		visitSource.getCookie = function() {
			return testCase.cookieString;
		};

		assert.equal(
			visitSource.get(),
			testCase.expected
		);
	});
});

QUnit.test('Test store()', function(assert) {
	var testCases = [
		{
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia.com',
			referrer: 'http://google.com',
			expected: 'wikiaReferrer=http%3A%2F%2Fgoogle.com; path=/; domain=wikia.com'
		},
		{
			cookieName: 'otherCookieName',
			cookieDomain: 'wikia-dev.com',
			referrer: 'http://wikia.com',
			expected: 'otherCookieName=http%3A%2F%2Fwikia.com; path=/; domain=wikia-dev.com'
		},
		{
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia-dev.com',
			referrer: 'http://wikia.com/somePage?foo=bar;',
			expected: 'wikiaReferrer=http%3A%2F%2Fwikia.com%2FsomePage%3Ffoo%3Dbar%3B; path=/; domain=wikia-dev.com'
		}

	];

	testCases.forEach(function(testCase) {
		var visitSource = new VisitSource(testCase.cookieName, testCase.cookieDomain);

		visitSource.getReferrer = function() {
			return testCase.referrer
		};

		visitSource.setCookie = function(cookieString) {
			assert.equal(cookieString, testCase.expected);
		};

		visitSource.store();
	});
});

QUnit.test('Test lifestime store()', function(assert) {
	var testCases = [
		{
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia.com',
			referrer: 'http://google.com',
			expected: 'wikiaReferrer=http%3A%2F%2Fgoogle.com; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/; domain=wikia.com'
		},
		{
			cookieName: 'otherCookieName',
			cookieDomain: 'wikia-dev.com',
			referrer: 'http://wikia.com',
			expected: 'otherCookieName=http%3A%2F%2Fwikia.com; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/; domain=wikia-dev.com'
		},
		{
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia-dev.com',
			referrer: 'http://wikia.com/somePage?foo=bar;',
			expected: 'wikiaReferrer=http%3A%2F%2Fwikia.com%2FsomePage%3Ffoo%3Dbar%3B; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/; domain=wikia-dev.com'
		}

	];

	testCases.forEach(function(testCase) {
		var visitSource = new VisitSource(testCase.cookieName, testCase.cookieDomain, false);

		visitSource.getReferrer = function() {
			return testCase.referrer
		};

		visitSource.setCookie = function(cookieString) {
			assert.equal(cookieString, testCase.expected);
		};

		visitSource.store();
	});
});

QUnit.test('Test checkAndStore()', function(assert) {
	var testCases = [
		{
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia.com',
			getCookieValueResult: 'http://www.wikia.com',
			storeExpectedToBeCalled: false
		},
		{
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia.com',
			getCookieValueResult: undefined,
			storeExpectedToBeCalled: true
		},
		{
			cookieName: 'wikiaReferrer',
			cookieDomain: 'wikia.com',
			getCookieValueResult: '',
			storeExpectedToBeCalled: false
		}
	];

	testCases.forEach(function(testCase) {
		var visitSource = new VisitSource(testCase.cookieName, testCase.cookieDomain, false);

		visitSource.getCookie = function() {
			return '';
		};

		visitSource.getCookieValue = function() {
			return testCase.getCookieValueResult
		};

		visitSource.store = function() {
			assert.ok(testCase.storeExpectedToBeCalled);
		};

		visitSource.checkAndStore();
		assert.ok(true);
	});
});
