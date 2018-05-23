'use strict';

const { remote } = require('electron');
const ko = require('knockout');
const templates = require('../../templates');
const actionDispatcher = require('../../redux/action-dispatchers/action-dispatcher');



function ProjectsMenuVM(params) {
    const pathSelected = paths => {
        if (paths) {
            paths.map(actionDispatcher.openProject);
        }
    };

    this.openProject = () => {
        remote.dialog.showOpenDialog(
            remote.getCurrentWindow(),
            { properties: ['openDirectory', 'createDirectory'] },
            pathSelected
        );
    };

    this.newProject = () => {
        actionDispatcher.createProject();
    }
}

ko.components.register('projectsMenu', {
    viewModel: ProjectsMenuVM,
    template: templates['projects-menu-tmpl']
});
