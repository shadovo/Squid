'use strict';
const ko = require('knockout');
const templates = require('../../templates');

function MultiRangeInputVM(params) {
    const self = this;

    const { callback } = params;

    const values = {
        min: params.min || 0,
        max: params.max || 1280
    };

    self.minValue = ko.observable(values.min);
    self.maxValue = ko.observable(values.max);

    function wrapCallbackInType(type) {
        return val => {
            if (typeof callback === 'function') {
                callback(
                    Object.assign({},
                        values,
                        {
                            [type]: parseInt(val)
                        }
                    )
                );
            }
        }
    }

    self.minValue.subscribe(wrapCallbackInType('min'));
    self.maxValue.subscribe(wrapCallbackInType('max'));
}

ko.components.register('multiRangeInput', {
    viewModel: MultiRangeInputVM,
    template: templates['multi-range-input-tmpl']
});
