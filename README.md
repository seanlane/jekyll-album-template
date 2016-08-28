# Jekyll Album Template

This is a Jekyll template that is geared towards generating automated photo galleries. The idea is that once the template and dependancies are in place, all you need to do is add images to the pertinent directory, run Gulp to process the images for each album, and then run Jekyll to build the site. If nothing else, hopefully it serves as some inspiration for anyone else trying to do something similar.

There seems to be about a million different ways to upload and share pictures on the internet, and the vast majority of them are probably better for everyone on the planet. That said, it scratches an itch that I've been having. I wanted a place that I could easily upload images, using SFTP or any tool of my choosing, automate the processing of images, and choose how to present the images.

This project was built using or extending the following projects and libraries:

Project / Library | Use |
------------------|-----|
[Poole](http://getpoole.com) | Base jekyll template and helped me with the README
[Flickery](http://flickity.metafizzy.co/) | Touch responsive image presentation
[jQuery Unveil](http://luis-almeida.github.com/unveil) | Lazy loading of thumbnails
[jQuery 3] | Dependancy for jQuery Unveil
[Pure CSS Grids](http://purecss.io/grids/) | Responsive Grids for the thumbnails
[Lightbox with Flickity by Jim Hyland](http://codepen.io/jimahyland/pen/GZGrEa/) | Lightbox for showing main imamges
[GulpJS](http://gulpjs.com/) | Automation of processing images and some other tasks
[Imagemagick](http://www.imagemagick.org/script/index.php) | Processing images

See this project in action with [the demo site](http://seanlane.net/jekyll-album-template).

## Contents

- [Usage](#usage)
- [Options](#options)
- [Development](#development)
- [Author](#author)
- [License](#license)

## Usage

### 1. Install dependencies

The Jekyll Album Template is (obviously) built on Jekyll so before getting started, you'll need to install the Jekyll gem:

```bash
$ gem install jekyll
```

The Jekyll Album Template uses Gulp to automate the processing of images to resize them as needed, generate thumbnails, wipe EXIF data, and wipe the albums as necessary. To do this, there are a few npm modules to install:

```bash
$ npm install
```

This project also relies on ImageMagick for the image processing. If you are running macOS with homebrew installed, then you can install it with:

```bash
$ brew install imagemagick
```

For Linux systems with `apt-get`:

```bash
$ sudo apt-get install imagemagick
```

For other installations methods and more information, I direct you to the [homepage for Imagemagick](http://www.imagemagick.org/script/index.php).

### 2. Configure

At the moment, this is a bit hackish, but it works. Basically, all the source images go into the directory `./album_source/<YOUR ALBUM NAME>`, and then the page hosting the album needs the following boilerplate:

```
---
layout: album
album: <YOUR ALBUM NAME>
---
{% assign album_path = 'assets/albums/' | append: page.album %}
{% assign thumbnail_path = album_path | append: '/thumbnails' %}
<div class="pure-g lightbox">
{% for image in site.static_files reversed %}
	{% if image.extname == '.jpg' or image.extname == '.png' %}
    {% if image.path contains album_path %}
    	{% unless image.path contains 'thumbnails' %}
	    	<div class="image pure-u-1 pure-u-md-1-4">
	    		<a href="{{ site.baseurl }}{{ image.path }}">
	        	<img class="pure-img" src="{{ site.baseurl}}/assets/images/dashinfinity.gif" data-src="{{ site.baseurl }}{{ image.path | split: album_path | last | prepend: thumbnail_path | prepend: '/' }}" alt="image" />
	        </a>
	      </div>
	     {% endunless %}
    {% endif %}
  {% endif %}
{% endfor %}
</div>
```

I want to clean this up, but this will work for a first version.

Once the images are in place, you can generate them with the following command:

```bash
$ gulp
```

This command will run the default task in `./gulpfile.js`, do it in parallel, and (hopefully) avoid reprocessing images that already exist within destination album. 

If you want to wipe the existing processed images, you can wipe all the files within `./assets/albums` with the following command:

```bash
$ gulp reset
```

### 3. Running locally

To see your Jekyll site with the album applied, start a Jekyll server. In Terminal, from `/jekyll-album-template` (or whatever your Jekyll site's root directory is named):

```bash
$ jekyll serve
```

Open <http://localhost:4000> in your browser, and voilà.

### 4. Serving it up

If you host your code on GitHub, you can use [GitHub Pages](https://pages.github.com) to host your project.

1. First run `$ gulp` to generate the images
2. Fork this repo and switch to the `gh-pages` branch.
  1. If you're [using a custom domain name](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages), modify the `CNAME` file to point to your new domain.
  2. If you're not using a custom domain name, **modify the `baseurl` in `_config.yml`** to point to your GitHub Pages URL. Example: for a repo at `github.com/username/jekyll-album-template`, use `http://username.github.io/jekyll-album-template/`. **Be sure to include the trailing slash.**
3. Done! Head to your GitHub Pages URL or custom domain.

If you want to serve the site somewhere else, like a webhost like DreamHost, Bluehost, or somewhere similar, do the following:

1. Run `$ gulp` and then `$ jekyll build`.
2. Copy the contents of the `./_site` folder to your server where it can be hosted.

No matter your production or hosting setup, be sure to verify the `baseurl` option file and `CNAME` settings. Not applying this correctly can mean broken styles on your site.

## Options

### Image Sizes

The source images are currently configured to be resized with a maximum width of 1920px, and the thumbnails are set to be 300px x 300px. This can be changed within `./gulpfile.js`.

### Thumbnail sorting

Right now, the files are sorted by name in reverse order, since that's what I'm trying to do. Hopefully sorting by EXIF data or something more configurable can be added, but works for the time being.

## Development

The Jekyll Album Template has two branches, but only one is used for active development.

- `master` for development.  **All pull requests should be to submitted against `master`.**
- `gh-pages` for the hosted site **Please avoid using this branch.**

CSS is handled via Jeykll's built-in Sass compiler. Source Sass files are located in `_sass/`, included into `styles.scss`, and compile to `styles.css`.

## Author

**Sean Lane**
- <https://github.com/seanlane>
- <https://twitter.com/osoguasu>

## License

Open sourced under the [GPL v3 License](LICENSE.md), since I think that's what the dependancies require of me. If this is wrong, please don't sue me ([See the author section for ways to contact me](#author)).
