exports.config =
  files:
    javascripts:
      defaultExtension: 'js'
      joinTo:
        'js/app.js': /^app\//
        'js/vendor.js': /^bower_components/
      order:
        before: [
          'bower_components/angular/angular.js'
        ]
    stylesheets:
      joinTo:
        'css/app.css': /^app\//
        'css/vendor.css': /^bower_components/
    templates:
      joinTo: 'app.js'
  modules:
    wrapper: false
    definition: false
