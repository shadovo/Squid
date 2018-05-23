'use strict';

const actions = require('../actions/actions');
const store = require('../store');

module.exports = {
    createProject: () => store.dispatch(actions.createProject()),
    openProject: path => store.dispatch(actions.openProject(path)),
    updateProject: projectDiff => store.dispatch(actions.updateProject(projectDiff)),
    updateProjectHeading: projectDiff => store.dispatch(actions.updateProjectHeading(projectDiff)),
    updateProjectText: projectDiff => store.dispatch(actions.updateProjectText(projectDiff)),
    updateProjectLink: projectDiff => store.dispatch(actions.updateProjectLink(projectDiff)),
    updateProjectLogo: projectDiff => store.dispatch(actions.updateProjectLogo(projectDiff)),
    updateProjectImage: projectDiff => store.dispatch(actions.updateProjectImage(projectDiff)),
    updateProjectBackground: projectDiff => store.dispatch(actions.updateProjectBackground(projectDiff))
};
