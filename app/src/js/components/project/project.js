'use strict';

const remote = require('electron').remote;
const ko = require('knockout');
const path = require('path');
const templates = require('../../templates');
const colorUtils = require('../../utils/color-utils');
const actionDispatcher = require('../../redux/action-dispatchers/action-dispatcher');
const base64Image = require('node-base64-image');
const store = require('../../redux/store');
require('../color-picker/color-picker');
require('../multi-range-input/multi-range-input');

const textColors = [
    '#111111',
    '#666666',
    '#ffffff',
    '#5fa743',
    '#43a7a4',
    '#437ca7',
    '#a243a7',
    '#d44848',
    '#e47b39',
 
];

const backgroundColors = [
    '#CBE6A3',
    '#E5F4E3',
    '#CDE8FF',
    '#E3EEF7',
    '#FEDCB4',
    '#FAEDD4',
    '#F9EDF1',
    '#DFDFDF',
    '#F2F2F2'
];

const availableFonts = [{
    name: 'Georgia',
    css: 'Georgia, serif',
}, {
    name: 'Palatino Linotype',
    css: '"Palatino Linotype", "Book Antiqua", Palatino, serif'
}, {
    name: 'Arial',
    css: 'Arial, Helvetica, sans-serif',
}, {
    name: 'Helvetica',
    css: 'Helvetica, Arial, sans-serif',
}, {
    name: 'Impact',
    css: 'Impact, Charcoal, sans-serif',
}, {
    name: 'Lucida Sans Unicode',
    css: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
}, {
    name: 'Tahoma',
    css: 'Tahoma, Geneva, sans-serif',
}, {
    name: 'Verdana',
    css: 'Verdana, Geneva, sans-serif',
}, {
    name: 'Courier New',
    css: '"Courier New", Courier, monospace',
}];


function ProjectVM() {

    const defaultPath = ko.observable();    

    this.logo = {
        src: ko.observable(),
        name: ko.observable(),
    };
    this.image = {
        src: ko.observable(),
        name: ko.observable(),
        mediaQueries: ko.observable({})
    };
    this.background = {
        name: ko.observable(),
        color: ko.observable()
    };
    this.heading = {
        text: ko.observable(),
        mediaQueries: ko.observable({})
    };
    this.text = {
        text: ko.observable(),
        mediaQueries: ko.observable({})
    };
    this.link = {
        text: ko.observable(),
        mediaQueries: ko.observable({})
    };

    this.availableFonts = availableFonts;
    this.textColors = textColors;
    this.backgroundColors = backgroundColors;

    const updateProjectData = () => {

        const state = store.getState();
        const project = state.project;

        defaultPath(project.path);
        
        if (project.logo) {
            this.logo.src(project.logo.src);
            this.logo.name(path.basename(project.logo.src || ''));
        } else {
            this.logo.src(undefined);
            this.logo.name(undefined);
        }
        
        if (project.image) {
            this.image.src(project.image.src);
            this.image.name(path.basename(project.image.src || ''));
            this.image.mediaQueries(project.image.mediaQueries || {});
        } else {
            this.image.src(undefined);
            this.image.name(undefined);
            this.image.mediaQueries({});
        }
        
        if (project.background) {
            this.background.name(path.basename(project.background.src || ''));
            this.background.color(project.background.color);
        } else {
            this.background.name(undefined);
            this.background.color(undefined);
        }
        
        if (project.heading) {
            this.heading.text(project.heading.text);
        } else {
            this.heading.text(undefined);
        }

        if (project.text) {
            this.text.text(project.text.text);
        } else {
            this.text.text(undefined);
        }

        if (project.link) {
            this.link.text(project.link.text);
        } else {
            this.link.text(undefined);
        }
        
    }

    store.subscribe(updateProjectData);

    updateProjectData();

    function selectImageFile(callbackPerPath) {
        remote.dialog.showOpenDialog(
            remote.getCurrentWindow(), {
                defaultPath: defaultPath(),
                filters: [{
                    name: 'Images',
                    extensions: ['jpg', 'jpeg', 'png', 'gif']
                }],
                properties: ['openFile']
            },
            (paths = []) => {
                paths.map(callbackPerPath);
            }
        );
    }

    this.heading.text.subscribe((newVal) => {
        actionDispatcher.updateProjectHeading({
            text: newVal
        });
    });

    this.text.text.subscribe((newVal) => {
        actionDispatcher.updateProjectText({
            text: newVal
        });
    });

    this.link.text.subscribe((newVal) => {
        actionDispatcher.updateProjectLink({
            text: newVal
        });
    });

    this.selectLogo = selectImageFile.bind(this, filePath => {
        actionDispatcher.updateProjectLogo({
            src: filePath
        });
    });

    this.removeLogo = () => {
        actionDispatcher.updateProjectLogo({
            src: undefined
        });
    };

    this.selectImage = selectImageFile.bind(this, filePath => {
        actionDispatcher.updateProjectImage({
            src: filePath
        });
    });

    this.removeImage = () => {
        actionDispatcher.updateProjectImage({
            src: undefined
        });
    };

    this.background.color.subscribe((newVal) => {
        actionDispatcher.updateProjectBackground({
            color: newVal
        });
    });

    this.setImageMediaQuery = (range) => {
        actionDispatcher.updateProjectImage({
            mediaQueries: range
        });
    };

    this.setHeadingMediaQuery = (range) => {
        actionDispatcher.updateProjectHeading({
            mediaQueries: range
        });
    };

    this.setTextMediaQuery = (range) => {
        actionDispatcher.updateProjectText({
            mediaQueries: range
        });
    };

    this.setBackgroundColor = (color) => {
        this.background.color(color);
    };
}

ko.components.register('project', {
    viewModel: ProjectVM,
    template: templates['project-tmpl']
});