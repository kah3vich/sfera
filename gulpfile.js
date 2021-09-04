//! Специальная функция, для проект работы node_modules файлов gulp ---
function defaultTask(cd) {
    cd();
} 
// exports.default = defaultTask;
//! вызов данной функции - gulp ----------------------------------------
//! --------------------------------------------------------------------


//! --------------------------------------------------------------------
//! Пути для файлов ----------------------------------------------------
//! --------------------------------------------------------------------
let project_folder = "dist";
let source_folder = "#src";
let path = {
    //! Путь для папки с итоговому кодом
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    //! Путь для папки с исходной кодом
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/**/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{png, jpg, svg, ico, webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    //! Путь для папки за слежкой файлов
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{png, jpg, svg, ico, webp}",
    },
    //! Путь папки, которая будет удаляться через функцию
    clean: "./" + project_folder + "/"
}


//! --------------------------------------------------------------------
//! Подключение плагинов -----------------------------------------------
//! --------------------------------------------------------------------

let { src, dest } = require('gulp'),
    gulp =          require('gulp'),                                    // основа gulp
    browsersync =   require("browser-sync").create(),                   // локальный сервер
    fileinclude =   require("gulp-file-include"),                       // подключение к файлам через @@include
    del =           require("del"),                                     // удаление чего-либо 
    sass =          require('gulp-sass')(require('sass')),              // препроцессор
    autoprefixer =  require('gulp-autoprefixer'),                       // префиксы для браузеров
    group_media =   require('gulp-group-css-media-queries'),            // объединение медиа запросов
    clean_css =     require('gulp-clean-css'),                          // минимизация файла css
    rename =        require('gulp-rename'),                             // переименование файла
    uglify =        require('gulp-uglify-es').default,                  // минимизация файла js
    imagemin =      require('gulp-imagemin'),                           // сжатие фотографии
    webp =          require('gulp-webp'),                               // добавление фотографий с форматом webp
    webp_html =     require('gulp-webp-html'),                          // добавление webp для html
    webp_css =      require('gulp-webp-css'),                           // добавление webp для css
    svg_sprite =    require('gulp-svg-sprite'),                         // преобразование svg 
    ttf2woff =      require('gulp-ttf2woff'),                           // преобразование ttf2woff формата
    ttf2woff2 =     require('gulp-ttf2woff'),                           // преобразование ttf2woff2 формата
    fonter =        require('gulp-fonter'),                             // преобразование шрифтов
    fs =            require('fs');                                      // преобразование для миксинов шрифтов



//! --------------------------------------------------------------------
//! Локальный сервер ---------------------------------------------------
//! --------------------------------------------------------------------

function browserSync() {
    browsersync.init({                                                  // инициализация плагина 
        server: {
            baseDir: "./" + project_folder + "/"
        },                                                              // локальный сервер запускается из указанной папки 
        port: 3000,                                                     // порт
        notify: false                                                   // уведомление о работе сервера
    })
}


//! --------------------------------------------------------------------
//! HTML функция с параметрами -----------------------------------------
//! --------------------------------------------------------------------

function html() {
    return src(path.src.html)                                           // файл html
        .pipe(fileinclude())                                            // подключений файлов через @@include
        .pipe(webp_html())                                              // добавление webp формат
        .pipe(dest(path.build.html))                                    // полученный файл идет в указанную папку 
        .pipe(browsersync.stream())                                     // слежка за файлами этой функции 
}


//! --------------------------------------------------------------------
//! CSS функция с параметрами ------------------------------------------
//! --------------------------------------------------------------------

function css() {
    return src(path.src.css)                                            // файл scss
        .pipe(
            sass({                                                      // преобразование препроцессора scss в css
                outputStyle: "expanded"                                 // compressed - ( min ) сжатая версия файла 
            })                                                          // expanded - ( full ) развернутая версия файла 
        )
        .pipe(group_media())                                            // все медиа запросы идут в конец итогового файла 
        .pipe(autoprefixer({                                            // добавляет префиксы для css 
            overrideBrowserslist: ['last 10 version'],                  // префиксы для последних версий браузеров
            cascade: true,                                              // каскад 
            grid: true                                                  // grid 
        }))
        .pipe(webp_css())                                               // формат webp добавляется в css
        .pipe(dest(path.build.css))                                     // полученный файл идет в указанную папку 
        .pipe(clean_css())                                              // минимизация файла css 
        .pipe(
            rename({                                                    // переименование файла в .min.css
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))                                     // полученный файл идет в указанную папку 
        .pipe(browsersync.stream())                                     // слежка за файлами этой функции 
}


//! --------------------------------------------------------------------
//! JS функция с параметрами -------------------------------------------
//! --------------------------------------------------------------------

function js() {
    return src(path.src.js)                                             // файл js
        .pipe(fileinclude())                                            // подключений файлов через @@include
        .pipe(dest(path.build.js))                                      // полученный файл идет в указанную папку 
        .pipe(uglify())                                                 // минимизация файла js 
        .pipe(
            rename({                                                    // переименование файла в .min.js
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))                                      // полученный файл идет в указанную папку 
        .pipe(browsersync.stream())                                     // слежка за файлами этой функции 
}


//! --------------------------------------------------------------------
//! Image функция с параметрами ----------------------------------------
//! --------------------------------------------------------------------

function images() {
    return src(path.src.img)                                            // файл image
        .pipe(
            webp({                                                      // добавление формата webp 
                quality: 100                                             // процент качества 
            })
        )
        .pipe(dest(path.build.img))                                     // полученный файл идет в указанную папку 
        .pipe(src(path.src.img))                                        // файл image
        .pipe( 
            imagemin({                                                  // сжатие фотографии 
                progressive: false,                                      // прогрессивный 
                svgoPlugins: [{ removeViewBox: false }],                // плагин для svg
                interlaced: true,                                       // переплетенный
                optimizationLevel: 0                                   // оптимизация от  0 до 7
            })
        )
        .pipe(dest(path.build.img))                                     // полученный файл идет в указанную папку 
        .pipe(browsersync.stream())                                     // слежка за файлами этой функции 
}


//! --------------------------------------------------------------------
//! Fonts функция для стилей css ---------------------------------------
//! --------------------------------------------------------------------

function fontsStyle(params) { 
    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + 
                            '/scss/fonts.scss', '@include font("' + 
                            fontname + '", "' + fontname + 
                            '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }                                                       // данная функция нужна для создание 
            }                                                           // в файле fonts.scss подключений стилей шрифтов
        })                                                              // так же для работы нужен миксин, который 
    }                                                                   // находится в главной папки style.scss
} 
function cb() { }


//! --------------------------------------------------------------------
//! Watch функция за слежкой изменений файлов в функции ----------------
//! --------------------------------------------------------------------

function watchFiles() {
    gulp.watch([path.watch.html], html);                                // слежка за файлами html
    gulp.watch([path.watch.css], css);                                  // слежка за файлами scss
    gulp.watch([path.watch.js], js);                                    // слежка за файлами js
    gulp.watch([path.watch.img], images);                               // слежка за файлами image 
}


//! --------------------------------------------------------------------
//! Fonts функция с параметрами ----------------------------------------
//! --------------------------------------------------------------------

function fonts() {
    src(path.src.fonts)                                                 // файл ttf
        .pipe(ttf2woff())                                               // плагин преобразующий формат 
        .pipe(dest(path.build.fonts));                                  // полученный файл идет в указанную папку 
    return src(path.src.fonts)                                          // файл ttf
        .pipe(ttf2woff2())                                              // плагин преобразующий формат 
        .pipe(dest(path.build.fonts));                                  // полученный файл идет в указанную папку 
}


//! --------------------------------------------------------------------
//! Otf2ttf преобразование формата -------------------------------------
//! --------------------------------------------------------------------

gulp.task('otf2ttf', function () {
    return src([source_folder + '/fonts/*.otf'])                        // файл otf
        .pipe(fonter({                                                  // плагин для преобразование формата 
            formats: ['ttf']                                            // в формат ttf из otf
        }))
        .pipe(dest(source_folder + '/fonts/'))                          // полученный файл идет в указанную папку 
})


//! --------------------------------------------------------------------
//! Svg преобразователь ------------------------------------------------
//! --------------------------------------------------------------------

gulp.task('svg_sprite', function () {
    return gulp.src([source_folder + '/iconsprite/*.svg'])              // файл svg d
        .pipe(svg_sprite({                                              // плагин для svg 
            mode: {
                stack: {
                    sprite: "../icons/icons.svg",                       // название файла
                    example: true                                       // создание дополнительных файлов 
                }
            },
        }
        ))
        .pipe(dest(path.build.img))                                     // полученный файл идет в указанную папку 
})


//! --------------------------------------------------------------------
//! Clean очистка ------------------------------------------------------
//! --------------------------------------------------------------------

function clean() {
    return del(path.clean)                                              // удаляет указанную папку 
}


//! --------------------------------------------------------------------
//! Переменные для запуска функций -------------------------------------
//! --------------------------------------------------------------------

let build = gulp.series(clean,                                          // удаление папки - dist 
            gulp.parallel(js, css, html, images, fonts), fontsStyle);   // сборка всех файлов 
let watch = gulp.parallel(build, watchFiles, browserSync);              // сборка -> слежка за изменениями -> локальный сервер 


//! --------------------------------------------------------------------
//! Подключение функций к gulp -----------------------------------------
//! --------------------------------------------------------------------

exports.fontsStyle = fontsStyle;                                        // подключение шрифтов в css 
exports.fonts = fonts;                                                  // преобразование шрифтов 
exports.images = images;                                                // сжатие фотографий 
exports.js = js;                                                        // обработка и минимизация файлов js 
exports.css = css;                                                      // обработка и минимизация файлов sccs в css 
exports.html = html;                                                    // обработка и объединение файлов html
exports.build = build;                                                  // сборка всех файлов 
exports.watch = watch;                                                  // слежка за изменениями файлов
exports.default = watch;                                                // вызов функции - gulp 


//! --------------------------------------------------------------------
//! --------------------------------------------------------------------
//! --------------------------------------------------------------------