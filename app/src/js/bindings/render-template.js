'use strict';

const ko = require('knockout');
const bannerTemplatesUtils = require('../utils/banner-templates-utils');
const store = require('../redux/store');

ko.bindingHandlers.renderTemplate = {
    init: function (element, valueAccessor) {
        const templateName = ko.unwrap(valueAccessor());
        const updateProjectData = () => {
            const state = store.getState();
            const project = state.project;
            element.contentWindow.document.documentElement.innerHTML = bannerTemplatesUtils.createBannerHTML(templateName, project, true);
        }
        store.subscribe(updateProjectData);
        updateProjectData();
    }
};
