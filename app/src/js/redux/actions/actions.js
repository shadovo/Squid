'use strict';

const { 
    CREATE_PROJECT, 
    OPEN_PROJECT, 
    UPDATE_PROJECT,
    UPDATE_PROJECT_HEADING,
    UPDATE_PROJECT_TEXT,
    UPDATE_PROJECT_LINK,
    UPDATE_PROJECT_LOGO,
    UPDATE_PROJECT_IMAGE,
    UPDATE_PROJECT_BACKGROUND
} = require('../../utils/constants');

const projectUtils = require('../../utils/project-utils');

function createProject(project) {
    return {
        type: CREATE_PROJECT,
        project
    };
}

function openProject(path) {
    return (dispatch) => {
        projectUtils.createProjectFromPath(path)
                    .then(project => dispatch(createProject(project)));
    };
}

function updateProjectForType(type) {
    return projectDiff => {
        return {
            type,
            projectDiff
        }
    }
}

const updateProject = updateProjectForType(UPDATE_PROJECT);
const updateProjectHeading = updateProjectForType(UPDATE_PROJECT_HEADING);
const updateProjectText = updateProjectForType(UPDATE_PROJECT_TEXT);
const updateProjectLink = updateProjectForType(UPDATE_PROJECT_LINK);
const updateProjectLogo = updateProjectForType(UPDATE_PROJECT_LOGO);
const updateProjectImage = updateProjectForType(UPDATE_PROJECT_IMAGE);
const updateProjectBackground = updateProjectForType(UPDATE_PROJECT_BACKGROUND);

module.exports = {
    createProject,
    openProject,
    updateProject,
    updateProjectHeading,
    updateProjectText,
    updateProjectLink,
    updateProjectLogo,
    updateProjectImage,
    updateProjectBackground
};
