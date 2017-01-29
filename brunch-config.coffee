exports.config =
  npm:
    enabled: false
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app\/js/
        'js/vendor.js': /^bower_components/
      order:
        before: [
          'app/js/application.js'
          'bower_components/angular/angular.js'
        ]
    stylesheets:
      joinTo:
        'css/app.css': 'app/styles/bootstrap.less'
        'css/vendor.css': /^bower_components/
      order:
        before: [
          'app/styles/bootstrap.less'
        ]
    templates:
      joinTo: 'app.js'
  paths:
    watched: [
               'app/assets'
               'app/js'
             ]
  modules:
    wrapper: false
    definition: false
  conventions:
    ignored: (path) -> /^bower_components\/(bootstrap|jquery)\//.test path
