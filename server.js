var express = require('express'), //load express module. 3rd party module. Loaded from node_modules folder.
    http = require('http'), //load http module. http is a core module.
    https = require('https'), //load http module. http is a core module.
    path = require('path'),
    fs = require('fs'),
	async = require('async'),
	moment = require('moment');  

app = express();

var server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  path = require('path'),
  ejs = require('ejs-locals'),
  childprocs = require('./lib/childprocs');
// noide config
var noideConfig = {};
if (fs.existsSync('./noide.json')) {
  noideConfig = require('./noide.json');
}
// set up default prj dir - used in the absence of a 'path' query string
if (!noideConfig.projectsDir) noideConfig.projectsDir = path.join(__dirname, 'noide/projects');
if (!noideConfig.framesUrl1) noideConfig.framesUrl1 = "http://localhost:3000";
if (!noideConfig.framesUrl2) noideConfig.framesUrl2 = "http://localhost:8080/debug?port=5858";

app.set('noideConfig', noideConfig);
// initialize locals
app.locals({
  metaTitle: 'Node.js  IDE',
  templates: fs.readFileSync('./public/html/templates.html')
});

var sessionStore = new express.session.MemoryStore({
  reapInterval: 60000 * 10
});

app.configure(function () {
    app.set('env', process.env.NODE_ENV || 'dev');
    app.set('port', process.env.NODE_PORT || 2000);
    app.set('views', path.join(__dirname, 'views'));
    app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
    app.use(express.cookieParser());
    app.use(express.session({
        store: sessionStore,
        secret: '5up3453c43t',
        key: 'sid'
    }));    
    app.use(express.favicon());
    app.use("/css", express.static(path.join(__dirname, 'css')));
    app.use("/js", express.static(path.join(__dirname, 'js')));
    app.use(express.logger('dev'));

    app.use(express.methodOverride());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
    app.use(express.methodOverride());

    app.enable('trust proxy');
    if (noideConfig.users) {
        app.use(express.basicAuth(function(user, pass, callback) {
          callback(null, noideConfig.users[user] == pass);
        }));
    }
    app.use(app.router);   
    
    app.use(function logErrors(err, req, res, next) {
        console.error(err.stack);
        next(err);
    });
	
	app.use(express.bodyParser());
});

app.get("/index", function(req, res) {
        res.render('index.html');
});

app.get("/editor", function(req, res) {
        res.render('/editor');
});

app.configure('development', function() {
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});
process.on('uncaughtException', function(err) {
  console.error(err.stack);
});
// routing
require('./lib/routing').configure();
// initialize server / start listening
server.listen(app.get('port'), function() {
  console.log('Listening on ' + app.get('port'));
});
// child processes
childprocs.connect(io, sessionStore);
app.set('childprocs', childprocs);