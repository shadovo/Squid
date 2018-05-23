'use strict';
/* global document */

const importLinks = document.querySelectorAll('link[rel="import"]');
const importLinksList = [...importLinks];

const templates = importLinksList.reduce((templates, link) => {
    const templateLinks = link.import.querySelectorAll('link[rel="import"]'); // links as NodeList
    const templateLinksList = [...templateLinks]; // Convert to array
    const templateSubSet = templateLinksList.reduce((templatesObject, templateLink) => {
        const template = templateLink.import.querySelector('template');
        let newTemplateKV = {};
        if (template) {
            if (template.id) {
                newTemplateKV[template.id] = document.importNode(template.content, true);
            } else {
                console.warn('Import tags without id will not be available in templates.js');
            }
        }
        return Object.assign({}, templatesObject, newTemplateKV);
    }, {});
    return Object.assign({}, templates, templateSubSet);
}, {});

module.exports = templates;
