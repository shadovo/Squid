'use strict';
require('./components/project/project');
require('./components/projects-menu/projects-menu');
require('./components/banner-templates/banner-templates');
require('./components/resize-tool/resize-tool');

const ko = require('knockout');
const store = require('./redux/store');

const App = function () {
    this.project = ko.observable();

    store.subscribe(() => {
        const state = store.getState();
        this.project(state.project);
    });
};

ko.applyBindings(new App());
