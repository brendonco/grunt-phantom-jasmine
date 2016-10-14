/*
 * grunt-phantom-jasmine
 * https://github.com/brendonco/grunt-phantom-jasmine
 *
 * Copyright (c) 2016 Brendon Co
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    phantom_jasmine: {
      command: 'vendor/phantomjs-2.1.1-macosx/bin/phantomjs tasks/lib/runjasmine2.js http://localhost:8081/vendor/jasmine-standalone-2.5.2/SpecRunner.html'
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'phantom_jasmine']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};