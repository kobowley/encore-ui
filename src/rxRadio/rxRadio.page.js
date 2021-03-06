/*jshint node:true*/
var _ = require('lodash');
var Page = require('astrolabe').Page;

/**
 * @namespace
 */
var htmlRadio = {
    /**
     * @function
     * @returns {Boolean} Whether the radio is currently displayed
     */
    isDisplayed: {
        value: function () {
            return this.rootElement.isDisplayed();
        }
    },

    /**
     * @function
     * @returns {Boolean} Whether the radio element is valid
     */
    isValid: {
        value: function () {
            return this.rootElement.getAttribute('class').then(function (classes) {
                return _.contains(classes.split(' '), 'ng-valid');
            });
        }
    },

    /**
     * @function
     * @returns {Boolean} Whether or not the radio element is currently selected
     */
    isSelected: {
        value: function () {
            return this.rootElement.isSelected();
        }
    },

    /**
     * @function
     * @description Make sure radio is selected
     */
    select: {
        value: function () {
            var radio = this.rootElement;
            return this.isSelected(). then(function (selected) {
                if (!selected) {
                    radio.click();
                }
            });
        }
    }
};

/**
 * @namespace
 * @extends htmlRadio
 */
var rxRadio = {
    eleWrapper: {
        get: function () {
            return this.rootElement.element(by.xpath('..'));
        }
    },

    eleFakeRadio: {
        get: function () {
            return this.eleWrapper.$('.fake-radio');
        }
    },

    /**
     * @function
     * @returns {Boolean} whether root element is if type="radio"
     */
    isRadio: {
        value: function () {
            return this.rootElement.getAttribute('type').then(function (ilk) {
                return ilk === 'radio';
            });
        }
    },

    /**
     * @function
     * @returns {Boolean} Whether the styled element is currently displayed.
     */
    isDisplayed: {
        value: function () {
            return this.eleFakeRadio.isDisplayed();
        }
    },

    /**
     * @function
     * @return {Boolean} whether or not the wrapper is disabled
     */
    isDisabled: {
        value: function () {
            return this.eleWrapper.getAttribute('class').then(function (classes) {
                return _.contains(classes.split(' '), 'rx-disabled');
            });
        }
    },

    /**
     * @function
     * @returns {Boolean} Whether or not the styled element exists on the page
     */
    isPresent: {
        value: function () {
            return this.eleFakeRadio.isPresent();
        }
    }
};
rxRadio = _.assign(htmlRadio, rxRadio);

/**
 * @exports encore.htmlRadio
 */
exports.htmlRadio = {
    /**
     * @function
     * @param {WebElement} radioElement - WebElement to be transformed into an htmlRadio page object.
     * @returns {htmlRadio} Page object representing the radio element
     */
    initialize: function (radioElement) {
        htmlRadio.rootElement = {
            get: function () { return radioElement; }
        };
        return Page.create(htmlRadio);
    },

    /**
     * @returns {htmlRadio} Page object representing the _first_ `<input type="radio" />` element found on the page
     */
    main: (function () {
        htmlRadio.rootElement = {
            get: function () { return $('input[type="radio"]'); }
        };
        return Page.create(htmlRadio);
    })()
};

/**
 * @exports encore.rxRadio
 */
exports.rxRadio = {
    /**
     * @function
     * @param {WebElement} rxRadioElement - WebElement to be transformed into an rxRadio page object
     * @returns {rxRadio} Page object representing the rxRadio element
     */
    initialize: function (rxRadioElement) {
        rxRadio.rootElement = {
            get: function () { return rxRadioElement; }
        };
        return Page.create(rxRadio);
    },

    /**
     * @returns {rxRadio} Page object representing the _first_ `<input rx-radio />` element found on the page
     */
    main: (function () {
        rxRadio.rootElement = {
            get: function () { return $('input[rx-radio]'); }
        };
        return Page.create(rxRadio);
    })()
};
