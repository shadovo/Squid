'use strict';

const projectUtils = require('../../utils/project-utils');
const { 
    CREATE_PROJECT,
    OPEN_PROJECT,
    UPDATE_PROJECT,
    UPDATE_PROJECT_HEADING,
    UPDATE_PROJECT_TEXT,
    UPDATE_PROJECT_LINK,
    UPDATE_PROJECT_LOGO,
    UPDATE_PROJECT_IMAGE,
    UPDATE_PROJECT_BACKGROUND,
    PROJECT_PART_HEADING,
    PROJECT_PART_TEXT,
    PROJECT_PART_LINK,
    PROJECT_PART_LOGO,
    PROJECT_PART_IMAGE,
    PROJECT_PART_BACKGROUND
} = require('../../utils/constants');

const initialState = {
    project: undefined
};

function createProject(state, action) {
    const newProject = projectUtils.createProject(action.project);

    return Object.assign({}, state, {
        project: newProject
    });
}

function openProject(state, action) {
    const newProject = projectUtils.createProjectFromPath(action.path);
    return Object.assign({}, state, {
        project: newProject
    });
}

function updateProject(state, action) {
    return Object.assign({}, state, {
        project: Object.assign({}, 
            state.project,
            action.projectDiff
        )
    });
}

function getUpdateProjectPartFunction(part) {
    return (state, action) => {
        return updateProject(
            state,
            {
                projectDiff: {
                    [part]: Object.assign(
                        {}, 
                        state.project[part],
                        action.projectDiff
                    )
                }
            }
        )
    }
}

const updateHeading = getUpdateProjectPartFunction(PROJECT_PART_HEADING);
const updateText = getUpdateProjectPartFunction(PROJECT_PART_TEXT);
const updateLink = getUpdateProjectPartFunction(PROJECT_PART_LINK);
const updateLogo = getUpdateProjectPartFunction(PROJECT_PART_LOGO);
const updateImage = getUpdateProjectPartFunction(PROJECT_PART_IMAGE);
const updateBackground = getUpdateProjectPartFunction(PROJECT_PART_BACKGROUND);

function reducers(state = initialState, action) {
    switch (action.type) {
        case CREATE_PROJECT: return createProject(state, action);
        case OPEN_PROJECT: return openProject(state, action);
        case UPDATE_PROJECT: return updateProject(state, action);
        case UPDATE_PROJECT_HEADING: return updateHeading(state, action);
        case UPDATE_PROJECT_TEXT: return updateText(state, action);
        case UPDATE_PROJECT_LINK: return updateLink(state, action);
        case UPDATE_PROJECT_LOGO: return updateLogo(state, action);
        case UPDATE_PROJECT_IMAGE: return updateImage(state, action);
        case UPDATE_PROJECT_BACKGROUND: return updateBackground(state, action);
        default: return state;
    }
}

module.exports = reducers;
