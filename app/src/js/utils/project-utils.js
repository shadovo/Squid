'use strict';

const fs = require('fs');

const path  = require('path');
const base64Image = require('node-base64-image');

function createProject(project = {}) {
    return Object.assign({}, project);
}

function makeFullPath(projectPath, file) {
    return path.join(projectPath, file);
}

function createProjectFromPath(projectPath) {
    return new Promise((resolve, reject) => {
        const confPath = path.join(projectPath, 'conf.json');

        if (!fs.existsSync(confPath))
            resolve({});
    
        const conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
        const response = Object.assign({}, conf, {
            image: Object.assign({}, conf.image, { 
                src: conf.image && conf.image.src ? makeFullPath(projectPath, decodeURI(conf.image.src)) : undefined 
            }),
            logo: Object.assign({}, conf.logo, { 
                src: conf.logo && conf.logo.src ? makeFullPath(projectPath, decodeURI(conf.logo.src)) : undefined 
            }),
            background: Object.assign({}, conf.background, { 
                src: conf.background && conf.background.src ? makeFullPath(projectPath, decodeURI(conf.background.src)) : undefined,
            })
        });

        if (response.background && response.background.src) {
            base64Image.encode(response.background.src, { local: true, string: true }, (err, base64) => {
                const data = `data:image/png;base64,${base64}`;
                resolve(
                    Object.assign({}, response, {
                        background: Object.assign(
                            {},
                            response.background,
                            { data: data }
                        )
                    })
                );
            });
        } else {
            resolve(response);
        }
    });
    
}

module.exports = {
    createProject,
    createProjectFromPath
};
