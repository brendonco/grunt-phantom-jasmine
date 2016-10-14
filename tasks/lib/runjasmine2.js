"use strict";

var system = require('system');

    /**
     * Wait until the test condition is true or a timeout occurs. Useful for waiting
     * on a server response or for a ui change (fadeIn, etc.) to occur.
     *
     * @param testFx javascript condition that evaluates to a boolean,
     * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
     * as a callback function.
     * @param onReady what to do when testFx condition is fulfilled,
     * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
     * as a callback function.
     * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.


    You can print colorful text to command when run nodejs application.

      console.log('\x1b[36m%s\x1b[0m', info);  //cyan
      console.log('\x1b[33m%s\x1b[0m: ', path);  //yellow
    Here is reference of colors and other characters:

        Reset = "\x1b[0m"
        Bright = "\x1b[1m"
        Dim = "\x1b[2m"
        Underscore = "\x1b[4m"
        Blink = "\x1b[5m"
        Reverse = "\x1b[7m"
        Hidden = "\x1b[8m"

        FgBlack = "\x1b[30m"
        FgRed = "\x1b[31m"
        FgGreen = "\x1b[32m"
        FgYellow = "\x1b[33m"
        FgBlue = "\x1b[34m"
        FgMagenta = "\x1b[35m"
        FgCyan = "\x1b[36m"
        FgWhite = "\x1b[37m"

        BgBlack = "\x1b[40m"
        BgRed = "\x1b[41m"
        BgGreen = "\x1b[42m"
        BgYellow = "\x1b[43m"
        BgBlue = "\x1b[44m"
        BgMagenta = "\x1b[45m"
        BgCyan = "\x1b[46m"
        BgWhite = "\x1b[47m"
    */

    function waitFor(testFx, onReady, timeOutMillis) {
        var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
            start = new Date().getTime(),
            condition = false,
            interval = setInterval(function() {
                if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                    // If not time-out yet and condition not yet fulfilled
                    condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
                } else {
                    if(!condition) {
                        // If condition still not fulfilled (timeout but condition is 'false')
                        console.log("'waitFor()' timeout");
                        phantom.exit(1);
                    } else {
                        // Condition fulfilled (timeout and/or condition is 'true')
                        console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                        typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                        clearInterval(interval); //< Stop this interval
                    }
                }
            }, 100); //< repeat check every 100ms
    };


    if (system.args.length !== 2) {
        console.log('Usage: run-jasmine2.js URL');
        phantom.exit(1);
    }

    var page = require('webpage').create();

    // Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };

    console.log("running >> : " + system.args[1]);

    page.open(system.args[1], function(status){
        if (status !== "success") {
            console.log("Unable to access network");
            phantom.exit();
        } else {
            waitFor(function(){
                return page.evaluate(function(){
                    return document.body.querySelector('.jasmine-symbolSummary .jasmine-pending') === null &&
                        (document.body.querySelector('.jasmine-alert > .jasmine-bar.jasmine-passed') !== null || 
                         document.body.querySelector('.jasmine-alert > .jasmine-bar.jasmine-failed') !== null);
                });
            }, function(){
                var exitCode = page.evaluate(function(){
                    console.log('');

                    var title = 'Jasmine';
                    var currentSuite;
                    var successList = document.body.querySelectorAll('.jasmine-results > .jasmine-summary .jasmine-specs > .jasmine-passed');
                    var suites = {};
                    if (successList && successList.length > 0) {
                        for (var i = 0; i < successList.length; ++i) {
                            var el = successList[i],
                                name = el.children[0].innerText,
                                suite = el.parentElement.parentElement.querySelector('.jasmine-suite-detail').innerText;

                            suites[suite] = suites[suite] || [];
                            suites[suite].push({ status: 'success', name: name });
                        }
                    }

                    var failedList = document.body.querySelectorAll('.jasmine-results > .jasmine-failures > .jasmine-spec-detail.jasmine-failed');
                    if (failedList && failedList.length > 0) {
                        console.log('');
                        console.log(failedList.length + ' test(s) FAILED:');
                        for (var i = 0; i < failedList.length; ++i) {
                            var el = failedList[i],
                                name = el.querySelector('.jasmine-description').innerText,
                                msg = el.querySelector('.jasmine-result-message').innerText,
                                stackTrace = el.querySelector('.jasmine-stack-trace').innerText,
                                suite = name.substring(0, name.indexOf(' '));

                            // remove trailing period
                            name = name.substring(0, name.length - 1);

                            suites[suite] = suites[suite] || [];
                            suites[suite].push({ suite: suite, status: 'failed', name: name, message: name + ': ' + msg, stackTrace: stackTrace});
                        }
                    }

                    for (var suite in suites) {
                        var tests = suites[suite];
                        console.log('SUITES_STARTED:' + JSON.stringify({ suite: suite }));
                        for (var i in tests) {
                            var test = tests[i];
                            console.log('TEST_STARTED:' + JSON.stringify({ name: test.name }));
                            if (test.status === 'success') {
                            }
                            else if (test.status === 'failed') {
                                console.log('\x1b[31m', 'TEST_FAILED:' + JSON.stringify({ name: test.name, message: test.message }));
                                console.log('');
                                console.log(test.suite);
                                console.log(test.message);
                                console.log(test.stackTrace);
                            }

                            console.log('TEST_FINISHED:' + JSON.stringify({ name: test.name }));
                        }

                        console.log('SUITE_FINISHED:' + JSON.stringify({ suite: suite }));
                    }

                    if (failedList && failedList.length > 0) {
                        console.log('\x1b[31m', document.body.querySelector('.jasmine-alert > .jasmine-bar.jasmine-failed').innerText);
                        return 1;
                    } else {
                        console.log('\x1b[32m', document.body.querySelector('.jasmine-alert > .jasmine-bar.jasmine-passed').innerText);
                        return 0;
                    }
                });
                phantom.exit(exitCode);
            });
        }
    });