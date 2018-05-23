'use strict';

const { remote } = require('electron');
const ko = require('knockout');
const templates = require('../../templates');
const IPHONE_WIDTH = 375;
const IPAD_WIDTH = 470;
const DESKTOP_WIDTH = 786;
const EXTRA_SIDE_PADDING = 318;

function ResizeToolVM() {

    this.IPHONE_WIDTH = IPHONE_WIDTH;
    this.IPAD_WIDTH = IPAD_WIDTH;
    this.DESKTOP_WIDTH = DESKTOP_WIDTH;

    const browserWindow = remote.getCurrentWindow()

    this.setSize = function (size) {
        const currentSize = browserWindow.getSize(); // [width, height]
        browserWindow.setSize(size + EXTRA_SIDE_PADDING, currentSize[1], true);
    };

}

ko.components.register('resizeTool', {
    viewModel: ResizeToolVM,
    template: templates['resize-tool-tmpl']
});
