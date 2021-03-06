
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        sourceMap: true
      },
      lib: {
        src : [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/backbone.js',
          'public/lib/handlebars.js'
        ],
        dest: 'public/dist/lib.js'
      },
      client: {
        src: [
          'public/client/app.js',
          'public/client/link.js',
          'public/client/links.js',
          'public/client/linkView.js',
          'public/client/linksView.js',
          'public/client/createLinkView.js',
          'public/client/router.js'
            ],
        dest: 'public/dist/client.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          watch: ['app/**/*', 'lib/**/*', 'server-config.js', 'server.js', 'Gruntfile.js'],
          ignore: ['public/dist/**/*.*']
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      client: {
        options: {
          sourceMapIn: 'public/dist/client.js.map'
        },
        files: {
          'public/dist/client.min.js': ['public/dist/client.js']
        }
      },
      lib: {
        options: {
          sourceMapIn: 'public/dist/lib.js.map'
        },
        files: {
          'public/dist/lib.min.js' : ['public/dist/lib.js']
        }
      }
    },

    jshint: {
      files: [
        '**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js',
          'node_modules/**/*.js',
          'test/**/*.js'
        ]
      }
    },

    cssmin: {
      minify: {
        src: 'public/style.css',
        dest: 'public/style.min.css'
      }
    },
    shell: {
      options: {
        stdout: false,
        stderr: false,
        async: true,
        failOnError: true,
        canKill: true
      },
      mongodev: {
        command: 'mongod --dbpath ./db/mongo'
      },
      mongotest: {
        command: 'mongod --dbpath ./db/test'
      },
      nodemon: {
        command: 'grunt nodemon'
      }
    },
    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
          'Gruntfile.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: [
          'public/*.css',
          '!public/*.min.css'
        ],
        tasks: ['cssmin']
      }
    },

    gitpush: {
      azure: {
        options: {
          remote: 'azure',
          branch: 'master'
        }
      }
    }
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////




  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['gitpush']);
    } else {
      grunt.task.run(['build', 'server-dev']);
    }
  });

  grunt.registerTask('server-dev', [ 'shell:nodemon', 'shell:mongodev', 'watch' ]);
  grunt.registerTask('test'      , ['jshint', 'mocha']);
  grunt.registerTask('mocha'     , ['shell:mongotest', 'mochaTest', 'shell:mongotest:kill']);
  grunt.registerTask('deploy'    , ['test', 'upload']);
  grunt.registerTask('build'     , ['concat', 'uglify', 'cssmin']);
};
