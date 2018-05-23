'use strict';

const remote = require('electron').remote;
const ko = require('knockout');
const templates = require('../../templates');
const bannerTemplatesUtils = require('../../utils/banner-templates-utils');
const store = require('../../redux/store');
const path = require('path');
const actionDispatcher = require('../../redux/action-dispatchers/action-dispatcher');
require('../../bindings/render-template');

function BannerTemplateVM() {

    this.previouslySelectedTemplate = ko.observable();

    const updateProjectData = () => {
        const state = store.getState();
        const project = state.project;
        this.previouslySelectedTemplate(project.templateName);
    }

    store.subscribe(updateProjectData);
    updateProjectData();

    this.downloadBanner = (template) => {
        const state = store.getState();
        const project = state.project;
        remote.dialog.showOpenDialog(
            remote.getCurrentWindow(),
            {
                defaultPath: project.path,
                buttonLabel: 'Spara',
                properties: ['openDirectory', 'createDirectory']
            },
            function (filename) {
                if (filename && filename[0])
                bannerTemplatesUtils.saveBanner(filename[0], template, project)
                                    .then(() => {
                                        remote.dialog.showMessageBox(
                                            remote.getCurrentWindow(),
                                            {
                                                title: 'Din banner har sparats',
                                                message: `Din banner har sparats i \n${filename[0]}`,
                                                buttons: ['Öppna mapp','Ok']
                                            },
                                            function (response) {
                                                if (response === 0) {
                                                    remote.shell.showItemInFolder(filename[0]);
                                                }
                                                actionDispatcher.updateProject({
                                                    templateName: template
                                                });
                                            }
                                        )
                                    });
            }
        );
    };
    this.tmplNames = bannerTemplatesUtils.getAllBannerTmplNames();
}

ko.components.register('bannerTemplates', {
    viewModel: BannerTemplateVM,
    template: templates['banner-templates-tmpl']
});
