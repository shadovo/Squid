'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const CACHE_KEYS = {
    TEMPLATE_NAMES: 'TEMPLATE_NAMES',
    TEMPLATE_FILE_CONTENT: 'TEMPLATE_FILE_CONTENT' 
};

const cache = {
    TEMPLATE_NAMES: undefined,
    TEMPLATE_FILE_CONTENT: {}
};

const bannerTemplatePathParts = [__dirname, '..', '..', '..', 'static', 'templates'];
const platformSpecificPath = path.join.apply({}, bannerTemplatePathParts);

function getAllBannerTmplNames() {
    if (cache[CACHE_KEYS.TEMPLATE_NAMES]) {
        return cache[CACHE_KEYS.TEMPLATE_NAMES];
    }
    const filenames = fs.readdirSync(platformSpecificPath, 'utf8');
    cache[CACHE_KEYS.TEMPLATE_NAMES] = filenames;
    return filenames;
}

function getTemplateHTMLString(templateName) {
    if(cache[CACHE_KEYS.TEMPLATE_FILE_CONTENT][templateName]) {
        return cache[CACHE_KEYS.TEMPLATE_FILE_CONTENT][templateName];
    }
    const fileContent = fs.readFileSync(path.join(platformSpecificPath, templateName), 'utf8');
    cache[CACHE_KEYS.TEMPLATE_FILE_CONTENT][templateName] = fileContent;
    return fileContent;
}

function getCssForShowingElementBetween(selector, min = 0, max = 1280) {
    return `
        @media screen and (min-width: ${max}px), screen and (max-width: ${min}px) {
            ${selector} {
                display: none;
            }
        }
    `;
}

function createBannerHTML(templateName, project, isPreview) {
    const htmlString = getTemplateHTMLString(templateName);
    const customCss = [];

    const $ = cheerio.load(htmlString);

    const $heading = $('#heading');
    if (project.heading && project.heading.text) {
        $heading.text(project.heading.text);
    } else {
        $heading.remove();
    }

    const $text = $('#text');
    if (project.text && project.text.text) {
        $text.html(project.text.text.replace(/\n/g, '<br>'));
    } else {
        $text.remove();
    }

    const $link = $('#link');
    if (project.link && project.link.text) {
        $link.text(project.link.text);
    } else {
        $link.remove();
    }

    const $logo = $('#logo');
    const $logoWrapper = $('#logo-wrapper');
    if (project.logo && project.logo.src) {
        $logo.attr('src', project.logo.src);
        if (isPreview) {
            $logo.css('opacity', '1');
        } else {
            $logoWrapper.css('background-image', `url('${project.logo.src}')`);
        }
    } else {
        $logo.remove();
    }

    const $image = $('#image');
    if (project.image && project.image.src) {
        $image.attr('src', project.image.src);
        if (project.image.mediaQueries) {
            customCss.push(
                getCssForShowingElementBetween(
                    '#image', 
                    project.image.mediaQueries.min, 
                    project.image.mediaQueries.max
                )
            );
        }
    } else {
        $image.remove();
    }

    const $background = $('#background');
    if (project.background && project.background.color) {
        $background.css('background-color', project.background.color);
    }

    if (customCss.length > 0) {
        $('head').append(`<style>${customCss.join('')}</style>`);
    }

    return $.html();
}

function cloneImage(projectPath, fileSrc) {
    return new Promise((resolve, reject) => {
        if (fileSrc && path.dirname(fileSrc) !== projectPath) {
            fs.createReadStream(fileSrc)
                .on('clsoe', resolve)
                .on('error', reject)
                .pipe(
                    fs.createWriteStream(
                        path.join(projectPath, path.basename(fileSrc))
                    )
                    .on('error', reject)
                )
        };
        resolve();
    });
}

function saveHtml(projectPath, html) {
    const indexSrc = path.join(projectPath, 'index.html');
    return new Promise((resolve, reject) => {
        fs.writeFile(indexSrc, html, {encoding: 'utf8'}, (err, data) => {
            if (err) reject();
            else resolve();
        });
    });
}

function saveConfig(projectPath, project, templateName) {
    const confSrc = path.join(projectPath, 'conf.json');
    return new Promise((resolve, reject) => {
        fs.writeFile(
            confSrc, 
            JSON.stringify(
                    Object.assign({}, project, {
                    path: undefined,
                    templateName
                })
            ),
            {encoding: 'utf8'},
            (err, data) => {
                if (err) reject();
                else resolve();
            }
        )
    });
}

function normalizeProject(project) {
    const logoSrc = project.logo && project.logo.src ? `./${encodeURI(path.basename(project.logo.src))}` : undefined;
    const imageSrc = project.image && project.image.src ? `./${encodeURI(path.basename(project.image.src))}` : undefined;
    const backgroundSrc = project.background && project.background.src ? `./${encodeURI(path.basename(project.background.src))}` : undefined;

    return Object.assign({}, project, {
        logo: Object.assign({}, project.logo, {
            src: logoSrc
        }),
        image: Object.assign({}, project.image, {
            src: imageSrc
        }),
        background: Object.assign({}, project.background, {
            src: backgroundSrc
        })
    });
}

function saveBanner(projectPath, templateName, project) {
    const normalizedProject = normalizeProject(project);
    const html = createBannerHTML(templateName, normalizedProject);
    return Promise.all([
        saveHtml(projectPath, html),
        saveConfig(projectPath, normalizedProject, templateName),
        cloneImage(projectPath, project.image.src),
        cloneImage(projectPath, project.background.src),
        cloneImage(projectPath, project.logo.src)
    ]);
}

module.exports = {
    getAllBannerTmplNames,
    getTemplateHTMLString,
    createBannerHTML,
    saveBanner
}