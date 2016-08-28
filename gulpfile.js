var fs = require('fs');
var gutil = require('gulp-util');
var glob = require('glob');
var gulp = require('gulp');
var filelog = require('gulp-filelog');
var imageResize = require('gulp-image-resize');
var parallel = require("concurrent-transform");
var os = require("os");
var changed = require("gulp-changed");
var clean = require('gulp-clean');

// For each directory in ./album_source:
//    Get the album name, 
//		resize large photos, 
//		generate thumbnails
// Does all of the above concurrently, and should avoid
// editing files that have not changed
gulp.task('default', function() {
	glob.sync('album_source/*').forEach(function (filePath) {
		gutil.log('Processing photos in ' + filePath);
		var albumName = filePath.split('/').pop();
		if (fs.statSync(filePath).isDirectory()) {
			// Resize large photos
			gulp.src(filePath + '/*.jpg')
				.pipe(changed('assets/albums/' + albumName))
		    .pipe(parallel(
		    	imageResize({
			      width: 1920,
			      crop : false,
			      upscale : false,
			      imageMagick: true,
			      noProfile: true
					}),
		    	os.cpus().length
				))
		    .pipe(filelog('Resize'))
		    .pipe(gulp.dest('assets/albums/' + albumName));

		   // Create thumbnails
		   gulp.src(filePath + '/*.jpg')
		   	.pipe(changed('assets/albums/' + albumName + '/thumbnails'))
		    .pipe(parallel(
		    	imageResize({
			      width : 300,
			      height: 300,
			      crop : true,
			      upscale : false,
			      imageMagick: true,
			      noProfile: true
			    }),
			    os.cpus().length
		    ))
		    .pipe(filelog('Thumbnail'))
		    .pipe(gulp.dest('assets/albums/' + albumName + '/thumbnails'));
		}
	});
});

// Reset the albums
gulp.task('reset', function() {
	return gulp.src('assets/albums/*', {read: false})
		.pipe(filelog('Reset'))
		.pipe(clean());
});
