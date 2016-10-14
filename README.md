# grunt-phantom-jasmine

> Run jasmine specs headlessly through PhantomJS.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-phantom-jasmine --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-phantom-jasmine');
```

## The "phantom_jasmine" task

### Overview
In your project's Gruntfile, add a section named `phantom_jasmine` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  phantom_jasmine: {
    command: 'vendor/phantomjs-2.1.1-macosx/bin/phantomjs tasks/lib/runjasmine2.js remote url'
  }
});
```

Run this task with the `grunt phantom_jasmine` command.

#### Options
* command/cmd: command to execute phantomjs.
* runjasmine2.js: redirect the output to console.
* remote url: e.g. http://localhost:8080/test/SpecRunner.html

#### Howto
How to use grunt-phantom-jasmine can be found at [testing-grunt-phantom-jasmine](https://github.com/brendonco/testing-grunt-phantom-jasmine).

## Release History
* 2016-10-14   v0.1.5   Include how to use grunt-phantom-jasmine in readme.
* 2016-10-14   v0.1.2   Official Release.
* 2016-10-14   v0.1.1   Fixed grunt configuration for finding phantomjs.
* 2016-09-25   v0.1.0   Work in progress, not yet officially released.