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
        'css/app.css': 'app/styles/bootstrap.less'
        'css/vendor.css': /^bower_components/
      before: [
        'app/styles/bootstrap.less'
      ]
    templates:
      joinTo: 'app.js'
  modules:
    wrapper: false
    definition: false
  conventions:
    ignored: (path) -> /^bower_components\/(bootstrap|jquery)\//.test path
