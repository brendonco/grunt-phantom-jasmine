/*
 * grunt-phantom-jasmine
 * https://github.com/brendonco/grunt-phantom-jasmine
 *
 * Copyright (c) 2016 Brendon Co
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var cp = require('child_process'),
         _ = grunt.util._,
         f = require('util').format;

  grunt.registerMultiTask('phantom_jasmine', 'Run jasmine specs headlessly through PhantomJS.', function() {
    var defaultCallback = function(err, stdout, stderr) {
      if (err) {
        callbackErrors = true;
        grunt.log.error('Error executing child process: ' + err.toString());
      }
    };
    var callbackErrors = false;
    var data = this.data,
            options = data.options !== undefined ? data.options : {},
            stdout = data.stdout !== undefined ? data.stdout : true,
            stderr = data.stderr !== undefined ? data.stderr : true,
            stdin = data.stdin !== undefined ? data.stdin : false,
            callback = _.isFunction(data.callback) ? data.callback : defaultCallback,
            childProcess,
            args = [].slice.call(arguments, 0),
            exitCodes = data.exitCode || data.exitCodes || 0,
            command,
            done = this.async();

        exitCodes = _.isArray(exitCodes) ? exitCodes : [exitCodes];

        // allow for command to be specified in either
        // 'command' or 'cmd' property, or as a string.
        command = data.command || data.cmd || (_.isString(data) && data);

        if (!command) {
          grunt.log.error('Missing command property.');
          return done(false);
        }

        if (_.isFunction(command)) {
          command = command.apply(grunt, args);
        }

        if (!_.isString(command)) {
          grunt.log.error('Command property must be a string.');
          return done(false);
        }

        childProcess = cp.exec(command, options, callback.bind(grunt));

        childProcess.stdout.on('data', function (d) { grunt.log.write(d); });
        childProcess.stderr.on('data', function (d) { grunt.log.error(d); });

        // redirect stdin to childProcess
        if(stdin){
          process.stdin.on('readable', function() {
            var chunk = process.stdin.read();
            if (chunk !== null) {
              childProcess.stdin.write(chunk);
            }
          });
        }

        // Catches failing to execute the command at all (eg spawn ENOENT),
        // since in that case an 'exit' event will not be emitted.
        childProcess.on('error', function (err) {
            grunt.log.error(f('Failed with: %s', err));
            done(false);
        });

        childProcess.on('exit', function(code) {
            if (callbackErrors) {
                grunt.log.error("Node returned an error for this child process");
                return done(false);
            }

            if (exitCodes.indexOf(code) < 0) {
                grunt.log.error(f('Exited with code: %d.', code));
                return done(false);
            }

            grunt.verbose.ok(f('Exited with code: %d.', code));
            done();
        });
  });
};
