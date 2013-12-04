'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var root = path.normalize(__dirname + "");
  var client = root + "/client";
  var client_templatesdir = client+"/templates";
  var client_jshbars = client+"/jshbars";

  //build directories
  var build_clientdir = root + "/build/client"
  var build_templatesdir = build_clientdir+"/templates";
  var build_jsdir = build_clientdir + "/js";

  //build configuration
  var buildEnv = grunt.option('buildEnv') || 'local';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    dirs: {

      server: root + "/server",
      client: root + "/client",
      client_js: client + "/js",
      templates: client+ "/templates",
      jssrc_common: client + '/js/src',

      build: root + '/build',
      build_server: root + '/build/server',
      build_client: build_clientdir,
      build_js: build_jsdir,
      build_templatesdir: build_templatesdir,
      build_jslib: build_jsdir + '/lib',
      build_jssrc: build_jsdir + '/src',
      build_jshbars: build_jsdir + '/templates',
      build_css: build_clientdir + '/css',
      build_testSpecs: build_clientdir + '/tests/spec',
      client_jshbars:client_jshbars,
      client_templatesdir:client_templatesdir

    },
    buildTimestamp: '<%= new Date().getTime() %>',
    copy: {
        tutorialComplete:{      
          files: [
            {expand: true, cwd: '<%=dirs.client%>', src: ['**'], dest: '<%=dirs.build_client%>'},
            {expand: true, cwd: '<%=dirs.server%>', src: ['**'], dest: '<%=dirs.build_server%>'},
          ]
        },
        tutorialJs:{      
          files: [
            {expand: true, cwd: '<%=dirs.client_js%>', src: ['**'], dest: '<%=dirs.build_jsdir%>'},
          ]
        }  
    },
    emberTemplates: {
        compile: {
          options: {
            templateName: function(name) {
              return name.replace(/.*[\\|\/]/, "").replace(".", "/");
            }
          },
          files: {
            "<%=dirs.client_jshbars%>/templates.js": ["<%=dirs.client_templatesdir%>/*.handlebars"]
          }
        }      
    },
    concat: {
      options: {
          separator: ';'
      },
      dist: {
          src: ['<%=dirs.build_jssrc%>/init.js', '<%=dirs.build_jssrc%>/emberconfig.js','<%=dirs.build_jshbars%>/**/*.js','<%=dirs.build_jssrc%>.js'],
          dest: '<%=dirs.build_js%>/app.js'
      }
    },
    hashres: {
      options: {
        fileNameFormat: '${name}.${hash}.${ext}',
        renameFiles: true
      },
      main: {
        src: [ '<%=dirs.build_js%>/app.js'],
        dest: '<%=dirs.build_server%>/views/index.ejs'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('clean', 'Clears all build folders', function() {
    grunt.file.delete(root + '/build');
  });

  grunt.registerTask('cleanJsHbars', function() {
    grunt.file.delete(client_jshbars);
    grunt.file.mkdir(client_jshbars);
  });

/*  grunt.registerTask('cleanJs', 'Clears all build folders', function() {
    grunt.file.delete(build_jsdir + '/lib');
    grunt.file.delete(build_jsdir + '/src');
  });

  // Default task.
  //grunt.registerTask('default', ['clean', 'copy:tutorialComplete', 'emberTemplates', 'concat', 'hashres']);
  /*grunt.registerTask('js', ['cleanJs', 'copy:tutorialJs', 'concat', 'hashres']);*/
  grunt.registerTask('templates',['cleanJsHbars','emberTemplates']);
};

