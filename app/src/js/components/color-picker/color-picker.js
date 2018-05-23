'use strict';
const ko = require('knockout');
const templates = require('../../templates');

function ColorPickerVM(params) {
    const self = this;
    self.predefinedColors = params.colors || [
        '#fbe5ee',
        '#e8fbff',
        '#e9fde9',
        '#ffeadc',
        '#fffbda',
        '#EAEAEA'
    ];

    self.selectedColor = ko.observable(params.selectedColor);

    self.selectPredefined = function(color) {
        self.selectedColor(color);
    }

    self.selectedColor.subscribe(function(val) {
        if (typeof params.callback === 'function') {
            params.callback(val);
        }
    });
}

ko.components.register('colorPicker', {
    viewModel: ColorPickerVM,
    template: templates['color-picker-tmpl']
});
