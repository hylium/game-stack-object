'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {

  });

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: './.jshintrc'
      },
      all: [
        './**/*.js',
        '!./node_modules/**/*'
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
          require: 'should'
        },
        src: ['test/**/*.spec.js']
      }
    },
  });

  grunt.registerTask('test', ['mochaTest']);
};
