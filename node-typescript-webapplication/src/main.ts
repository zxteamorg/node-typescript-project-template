import * as expressCore from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as  morgan from "morgan";  // Logging middleware

const app = express();

// Set logger. Available values: "dev", "short", "tiny". or no argument (default)
app.use(morgan("dev"));

//app.set("views", path.join(__dirname, "../views"));
//app.set("view engine", "html");
//app.engine("html", some render engine);

// http://expressjs.com/en/guide/behind-proxies.html
//app.set("trust proxy", ["loopback", "0000:0000:0000:0::0"]);
//app.enable("trust proxy");

// Static content
app.use(express.static(path.join(__dirname, "../resources/webapp/wwwroot")));

// 404 Not found (bad URL)
app.use(function (req, res): any {
	return res.status(404).sendFile(path.join(__dirname, "../resources/webapp/errors/404.html"));
});

// 5xx Fatal error
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction): any {
	//TODO: send email, log err, etc...
	console.error(err);

	return res.status(500).sendFile(path.join(__dirname, "../resources/webapp/errors/500.html"));
});

// Make HTTP server instance
const server = http.createServer(app);

// Register "listening" callback
server.on("listening", function (): any {
	const address = server.address();
	if (typeof address === "string") {
		console.log("A server was started on " + address);
	} else {
		console.log(address.family + " server was started on http://" + address.address + ":" + address.port);
	}
});

const listen = "localhost";
const port = 8080;

// Start listening
server.listen(port, listen);

console.log("Starting HTTP Web Server...");
