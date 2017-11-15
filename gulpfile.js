/* SETUP */
const path = {
	dist: ".dist",
	pub: "pub",
	src: "src",
	test: "test",
	views: "views"
};

/* IMPLEMENTATION */
const fs = require('fs');
const gulp = require("gulp");
const gzip = require('gulp-gzip');
const install = require("gulp-install");
const clean = require('gulp-clean');
const runSequence = require("run-sequence");
const sourcemaps = require("gulp-sourcemaps");
const tar = require('gulp-tar');
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");

const distPackage = require("./package.json");
// Cleanup package for PROD
if("devDependencies" in distPackage) { delete distPackage.devDependencies; }
if("types" in distPackage) { delete distPackage.types; }
if("scripts" in distPackage) { delete distPackage.scripts; }

gulp.task("default", function(cb){ return runSequence("clean", "dist", cb); });
gulp.task("clean", ["clean:src", "clean:test", "clean:dist"]);
gulp.task("clean:src", function () {
	return gulp.src([path.src + "/**/*.js", path.src + "/**/*.map"], { read: false })
		.pipe(clean());
});
gulp.task("clean:test", function () {
	return gulp.src([path.test + "/**/*.js", path.test + "/**/*.map"], { read: false })
		.pipe(clean());
});
gulp.task("clean:dist", function (cb) {
	return gulp.src(path.dist, { read: false })
		.pipe(clean());
});
gulp.task("build", ["build:src", "build:test"]);
gulp.task("build:src", ["build:src:lint", "build:src:compile"]);
gulp.task("build:src:lint", function () {
	return gulp.src(path.src + "/**/*.ts")
		.pipe(tslint({ formatter: "verbose" }))
		.pipe(tslint.report());
});
gulp.task("build:src:compile", ["build:src:lint"], function () {
	return gulp.src(path.src + "/**/*.ts")
		.pipe(sourcemaps.init()) // sourcemaps will be generated
		.pipe(ts({
			target: "es6",
			module: "commonjs",
			noImplicitAny: false,
			declaration: false /* Generates corresponding .d.ts files. You need to pipe the dts streams to save these files.*/,
			moduleResolution: "node"
		}))
		.pipe(sourcemaps.write(".", {
			includeContent: false,
			sourceRoot: "../" + path.src,
			mapFile: function (path) { return path.replace(".js.map", ".map"); }
		}))
		.pipe(gulp.dest(path.src));
});
gulp.task("build:test", ["build:test:lint", "build:test:compile"]);
gulp.task("build:test:lint", function () {
	return gulp.src(path.test + "/**/*.ts")
		.pipe(tslint({ formatter: "verbose" }))
		.pipe(tslint.report());
});
gulp.task("build:test:compile", ["build:test:lint"], function () {
	return gulp.src(path.test + "/**/*.ts")
		.pipe(sourcemaps.init()) // sourcemaps will be generated
		.pipe(ts({
			target: "es6",
			module: "commonjs",
			noImplicitAny: false,
			declaration: false /* Generates corresponding .d.ts files. You need to pipe the dts streams to save these files.*/,
			moduleResolution: "node",
			strictNullChecks: true
		}))
		.pipe(sourcemaps.write(".", {
			includeContent: false,
			sourceRoot: "../" + path.test,
			mapFile: function (path) { return path.replace(".js.map", ".map"); }
		}))
		.pipe(gulp.dest(path.test));
});
gulp.task("dist", ["dist:conf", "dist:js", "dist:pub", "dist:views", "dist:deps", "dist:archive"]);
gulp.task("dist:js", ["build:src"], function () {
	return gulp.src(path.src + "/**/*.js")
		.pipe(gulp.dest(path.dist + "/tmp/lib"))
});
gulp.task("dist:pub", function () {
	return gulp.src(path.pub + "/**/*")
		.pipe(gulp.dest(path.dist + "/tmp/" + path.pub))
});
gulp.task("dist:views", function () {
	return gulp.src(path.views + "/**/*.html")
		.pipe(gulp.dest(path.dist + "/tmp/" + path.views))
});
gulp.task("dist:conf", function () {
	return gulp.src(".env")
		.pipe(gulp.dest(path.dist + "/tmp"))
});
gulp.task("dist:deps", function () {
	// Ensure directory exists
	if(!fs.existsSync(path.dist)) { fs.mkdirSync(path.dist); }
	if(!fs.existsSync(path.dist + "/tmp")) { fs.mkdirSync(path.dist + "/tmp"); }
	// You can replace following by just copy package.json, but I have already loaded it so let's just save
	fs.writeFileSync(path.dist + "/tmp/package.json", JSON.stringify(distPackage, null, "\t"));
	return gulp.src(path.dist + "/tmp/package.json")
		.pipe(install({production: true}));
});
gulp.task("dist:archive", ["dist:conf", "dist:js", "dist:pub", "dist:views", "dist:deps"], function() {
	gulp.src([path.dist + "/tmp/**/*", path.dist + "/tmp/**/.*"])
		.pipe(tar(distPackage.name + "-" + distPackage.version + ".tar", {mode: null}))
		.pipe(gzip())
		.pipe(gulp.dest(path.dist));
});
