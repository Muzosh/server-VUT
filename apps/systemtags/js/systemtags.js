/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./apps/systemtags/src/systemtags.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./apps/systemtags/src/app.js":
/*!************************************!*\
  !*** ./apps/systemtags/src/app.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2015 Vincent Petry <pvince81@owncloud.com>
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Vincent Petry <vincent@nextcloud.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function () {
  if (!OCA.SystemTags) {
    /**
     * @namespace
     */
    OCA.SystemTags = {};
  }

  OCA.SystemTags.App = {
    initFileList: function initFileList($el) {
      if (this._fileList) {
        return this._fileList;
      }

      this._fileList = new OCA.SystemTags.FileList($el, {
        id: 'systemtags',
        fileActions: this._createFileActions(),
        config: OCA.Files.App.getFilesConfig(),
        // The file list is created when a "show" event is handled,
        // so it should be marked as "shown" like it would have been
        // done if handling the event with the file list already
        // created.
        shown: true
      });
      this._fileList.appName = t('systemtags', 'Tags');
      return this._fileList;
    },
    removeFileList: function removeFileList() {
      if (this._fileList) {
        this._fileList.$fileList.empty();
      }
    },
    _createFileActions: function _createFileActions() {
      // inherit file actions from the files app
      var fileActions = new OCA.Files.FileActions(); // note: not merging the legacy actions because legacy apps are not
      // compatible with the sharing overview and need to be adapted first

      fileActions.registerDefaultActions();
      fileActions.merge(OCA.Files.fileActions);

      if (!this._globalActionsInitialized) {
        // in case actions are registered later
        this._onActionsUpdated = _.bind(this._onActionsUpdated, this);
        OCA.Files.fileActions.on('setDefault.app-systemtags', this._onActionsUpdated);
        OCA.Files.fileActions.on('registerAction.app-systemtags', this._onActionsUpdated);
        this._globalActionsInitialized = true;
      } // when the user clicks on a folder, redirect to the corresponding
      // folder in the files app instead of opening it directly


      fileActions.register('dir', 'Open', OC.PERMISSION_READ, '', function (filename, context) {
        OCA.Files.App.setActiveView('files', {
          silent: true
        });
        OCA.Files.App.fileList.changeDirectory(OC.joinPaths(context.$file.attr('data-path'), filename), true, true);
      });
      fileActions.setDefault('dir', 'Open');
      return fileActions;
    },
    _onActionsUpdated: function _onActionsUpdated(ev) {
      if (!this._fileList) {
        return;
      }

      if (ev.action) {
        this._fileList.fileActions.registerAction(ev.action);
      } else if (ev.defaultAction) {
        this._fileList.fileActions.setDefault(ev.defaultAction.mime, ev.defaultAction.name);
      }
    },

    /**
     * Destroy the app
     */
    destroy: function destroy() {
      OCA.Files.fileActions.off('setDefault.app-systemtags', this._onActionsUpdated);
      OCA.Files.fileActions.off('registerAction.app-systemtags', this._onActionsUpdated);
      this.removeFileList();
      this._fileList = null;
      delete this._globalActionsInitialized;
    }
  };
})();

window.addEventListener('DOMContentLoaded', function () {
  $('#app-content-systemtagsfilter').on('show', function (e) {
    OCA.SystemTags.App.initFileList($(e.target));
  });
  $('#app-content-systemtagsfilter').on('hide', function () {
    OCA.SystemTags.App.removeFileList();
  });
});

/***/ }),

/***/ "./apps/systemtags/src/css/systemtagsfilelist.scss":
/*!*********************************************************!*\
  !*** ./apps/systemtags/src/css/systemtagsfilelist.scss ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_systemtagsfilelist_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./systemtagsfilelist.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/systemtags/src/css/systemtagsfilelist.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_systemtagsfilelist_scss__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_systemtagsfilelist_scss__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./apps/systemtags/src/filesplugin.js":
/*!********************************************!*\
  !*** ./apps/systemtags/src/filesplugin.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2015 Vincent Petry <pvince81@owncloud.com>
 *
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Vincent Petry <vincent@nextcloud.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function () {
  OCA.SystemTags = _.extend({}, OCA.SystemTags);

  if (!OCA.SystemTags) {
    /**
     * @namespace
     */
    OCA.SystemTags = {};
  }
  /**
   * @namespace
   */


  OCA.SystemTags.FilesPlugin = {
    ignoreLists: ['trashbin', 'files.public'],
    attach: function attach(fileList) {
      if (this.ignoreLists.indexOf(fileList.id) >= 0) {
        return;
      } // only create and attach once
      // FIXME: this should likely be done on a different code path now
      // for the sidebar to only have it registered once


      if (!OCA.SystemTags.View) {
        var systemTagsInfoView = new OCA.SystemTags.SystemTagsInfoView();
        fileList.registerDetailView(systemTagsInfoView);
        OCA.SystemTags.View = systemTagsInfoView;
      }
    }
  };
})();

OC.Plugins.register('OCA.Files.FileList', OCA.SystemTags.FilesPlugin);

/***/ }),

/***/ "./apps/systemtags/src/systemtags.js":
/*!*******************************************!*\
  !*** ./apps/systemtags/src/systemtags.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./apps/systemtags/src/app.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _systemtagsfilelist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./systemtagsfilelist */ "./apps/systemtags/src/systemtagsfilelist.js");
/* harmony import */ var _systemtagsfilelist__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_systemtagsfilelist__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _filesplugin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filesplugin */ "./apps/systemtags/src/filesplugin.js");
/* harmony import */ var _filesplugin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_filesplugin__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _systemtagsinfoview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./systemtagsinfoview */ "./apps/systemtags/src/systemtagsinfoview.js");
/* harmony import */ var _systemtagsinfoview__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_systemtagsinfoview__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _css_systemtagsfilelist_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./css/systemtagsfilelist.scss */ "./apps/systemtags/src/css/systemtagsfilelist.scss");
/**
 * @copyright Copyright (c) 2016 Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */





window.OCA.SystemTags = OCA.SystemTags;

/***/ }),

/***/ "./apps/systemtags/src/systemtagsfilelist.js":
/*!***************************************************!*\
  !*** ./apps/systemtags/src/systemtagsfilelist.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2016 Vincent Petry <pvince81@owncloud.com>
 *
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Vincent Petry <vincent@nextcloud.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function () {
  /**
   * @class OCA.SystemTags.FileList
   * @augments OCA.Files.FileList
   *
   * @classdesc SystemTags file list.
   * Contains a list of files filtered by system tags.
   *
   * @param {Object} $el container element with existing markup for the #controls and a table
   * @param {Array} [options] map of options, see other parameters
   * @param {Array.<string>} [options.systemTagIds] array of system tag ids to
   * filter by
   */
  var FileList = function FileList($el, options) {
    this.initialize($el, options);
  };

  FileList.prototype = _.extend({}, OCA.Files.FileList.prototype,
  /** @lends OCA.SystemTags.FileList.prototype */
  {
    id: 'systemtagsfilter',
    appName: t('systemtags', 'Tagged files'),

    /**
     * Array of system tag ids to filter by
     *
     * @type Array.<string>
     */
    _systemTagIds: [],
    _lastUsedTags: [],
    _clientSideSort: true,
    _allowSelection: false,
    _filterField: null,

    /**
     * @private
     * @param {Object} $el container element
     * @param {Object} [options] map of options, see other parameters
     */
    initialize: function initialize($el, options) {
      OCA.Files.FileList.prototype.initialize.apply(this, arguments);

      if (this.initialized) {
        return;
      }

      if (options && options.systemTagIds) {
        this._systemTagIds = options.systemTagIds;
      }

      OC.Plugins.attach('OCA.SystemTags.FileList', this);
      var $controls = this.$el.find('#controls').empty();

      _.defer(_.bind(this._getLastUsedTags, this));

      this._initFilterField($controls);
    },
    destroy: function destroy() {
      this.$filterField.remove();
      OCA.Files.FileList.prototype.destroy.apply(this, arguments);
    },
    _getLastUsedTags: function _getLastUsedTags() {
      var self = this;
      $.ajax({
        type: 'GET',
        url: OC.generateUrl('/apps/systemtags/lastused'),
        success: function success(response) {
          self._lastUsedTags = response;
        }
      });
    },
    _initFilterField: function _initFilterField($container) {
      var self = this;
      this.$filterField = $('<input type="hidden" name="tags"/>');
      $container.append(this.$filterField);
      this.$filterField.select2({
        placeholder: t('systemtags', 'Select tags to filter by'),
        allowClear: false,
        multiple: true,
        toggleSelect: true,
        separator: ',',
        query: _.bind(this._queryTagsAutocomplete, this),
        id: function id(tag) {
          return tag.id;
        },
        initSelection: function initSelection(element, callback) {
          var val = $(element).val().trim();

          if (val) {
            var tagIds = val.split(',');
            var tags = [];
            OC.SystemTags.collection.fetch({
              success: function success() {
                _.each(tagIds, function (tagId) {
                  var tag = OC.SystemTags.collection.get(tagId);

                  if (!_.isUndefined(tag)) {
                    tags.push(tag.toJSON());
                  }
                });

                callback(tags);
              }
            });
          } else {
            // eslint-disable-next-line standard/no-callback-literal
            callback([]);
          }
        },
        formatResult: function formatResult(tag) {
          return OC.SystemTags.getDescriptiveTag(tag);
        },
        formatSelection: function formatSelection(tag) {
          return OC.SystemTags.getDescriptiveTag(tag)[0].outerHTML;
        },
        sortResults: function sortResults(results) {
          results.sort(function (a, b) {
            var aLastUsed = self._lastUsedTags.indexOf(a.id);

            var bLastUsed = self._lastUsedTags.indexOf(b.id);

            if (aLastUsed !== bLastUsed) {
              if (bLastUsed === -1) {
                return -1;
              }

              if (aLastUsed === -1) {
                return 1;
              }

              return aLastUsed < bLastUsed ? -1 : 1;
            } // Both not found


            return OC.Util.naturalSortCompare(a.name, b.name);
          });
          return results;
        },
        escapeMarkup: function escapeMarkup(m) {
          // prevent double markup escape
          return m;
        },
        formatNoMatches: function formatNoMatches() {
          return t('systemtags', 'No tags found');
        }
      });
      this.$filterField.on('change', _.bind(this._onTagsChanged, this));
      return this.$filterField;
    },

    /**
     * Autocomplete function for dropdown results
     *
     * @param {Object} query select2 query object
     */
    _queryTagsAutocomplete: function _queryTagsAutocomplete(query) {
      OC.SystemTags.collection.fetch({
        success: function success() {
          var results = OC.SystemTags.collection.filterByName(query.term);
          query.callback({
            results: _.invoke(results, 'toJSON')
          });
        }
      });
    },

    /**
     * Event handler for when the URL changed
     *
     * @param {Event} e the urlchanged event
     */
    _onUrlChanged: function _onUrlChanged(e) {
      if (e.dir) {
        var tags = _.filter(e.dir.split('/'), function (val) {
          return val.trim() !== '';
        });

        this.$filterField.select2('val', tags || []);
        this._systemTagIds = tags;
        this.reload();
      }
    },
    _onTagsChanged: function _onTagsChanged(ev) {
      var val = $(ev.target).val().trim();

      if (val !== '') {
        this._systemTagIds = val.split(',');
      } else {
        this._systemTagIds = [];
      }

      this.$el.trigger($.Event('changeDirectory', {
        dir: this._systemTagIds.join('/')
      }));
      this.reload();
    },
    updateEmptyContent: function updateEmptyContent() {
      var dir = this.getCurrentDirectory();

      if (dir === '/') {
        // root has special permissions
        if (!this._systemTagIds.length) {
          // no tags selected
          this.$el.find('#emptycontent').html('<div class="icon-systemtags"></div>' + '<h2>' + t('systemtags', 'Please select tags to filter by') + '</h2>');
        } else {
          // tags selected but no results
          this.$el.find('#emptycontent').html('<div class="icon-systemtags"></div>' + '<h2>' + t('systemtags', 'No files found for the selected tags') + '</h2>');
        }

        this.$el.find('#emptycontent').toggleClass('hidden', !this.isEmpty);
        this.$el.find('#filestable thead th').toggleClass('hidden', this.isEmpty);
      } else {
        OCA.Files.FileList.prototype.updateEmptyContent.apply(this, arguments);
      }
    },
    getDirectoryPermissions: function getDirectoryPermissions() {
      return OC.PERMISSION_READ | OC.PERMISSION_DELETE;
    },
    updateStorageStatistics: function updateStorageStatistics() {// no op because it doesn't have
      // storage info like free space / used space
    },
    reload: function reload() {
      // there is only root
      this._setCurrentDir('/', false);

      if (!this._systemTagIds.length) {
        // don't reload
        this.updateEmptyContent();
        this.setFiles([]);
        return $.Deferred().resolve();
      }

      this._selectedFiles = {};

      this._selectionSummary.clear();

      if (this._currentFileModel) {
        this._currentFileModel.off();
      }

      this._currentFileModel = null;
      this.$el.find('.select-all').prop('checked', false);
      this.showMask();
      this._reloadCall = this.filesClient.getFilteredFiles({
        systemTagIds: this._systemTagIds
      }, {
        properties: this._getWebdavProperties()
      });

      if (this._detailsView) {
        // close sidebar
        this._updateDetailsView(null);
      }

      var callBack = this.reloadCallback.bind(this);
      return this._reloadCall.then(callBack, callBack);
    },
    reloadCallback: function reloadCallback(status, result) {
      if (result) {
        // prepend empty dir info because original handler
        result.unshift({});
      }

      return OCA.Files.FileList.prototype.reloadCallback.call(this, status, result);
    }
  });
  OCA.SystemTags.FileList = FileList;
})();

/***/ }),

/***/ "./apps/systemtags/src/systemtagsinfoview.js":
/*!***************************************************!*\
  !*** ./apps/systemtags/src/systemtagsinfoview.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2015
 *
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
 * @author Vincent Petry <vincent@nextcloud.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function (OCA) {
  function modelToSelection(model) {
    var data = model.toJSON();

    if (!OC.isUserAdmin() && !data.canAssign) {
      data.locked = true;
    }

    return data;
  }
  /**
   * @class OCA.SystemTags.SystemTagsInfoView
   * @classdesc
   *
   * Displays a file's system tags
   *
   */


  var SystemTagsInfoView = OCA.Files.DetailFileInfoView.extend(
  /** @lends OCA.SystemTags.SystemTagsInfoView.prototype */
  {
    _rendered: false,
    className: 'systemTagsInfoView',
    name: 'systemTags',

    /* required by the new files sidebar to check if the view is unique */
    id: 'systemTagsInfoView',

    /**
     * @type OC.SystemTags.SystemTagsInputField
     */
    _inputView: null,
    initialize: function initialize(options) {
      var self = this;
      options = options || {};
      this._inputView = new OC.SystemTags.SystemTagsInputField({
        multiple: true,
        allowActions: true,
        allowCreate: true,
        isAdmin: OC.isUserAdmin(),
        initSelection: function initSelection(element, callback) {
          callback(self.selectedTagsCollection.map(modelToSelection));
        }
      });
      this.selectedTagsCollection = new OC.SystemTags.SystemTagsMappingCollection([], {
        objectType: 'files'
      });

      this._inputView.collection.on('change:name', this._onTagRenamedGlobally, this);

      this._inputView.collection.on('remove', this._onTagDeletedGlobally, this);

      this._inputView.on('select', this._onSelectTag, this);

      this._inputView.on('deselect', this._onDeselectTag, this);
    },

    /**
     * Event handler whenever a tag was selected
     * @param {Object} tag the tag to create
     */
    _onSelectTag: function _onSelectTag(tag) {
      // create a mapping entry for this tag
      this.selectedTagsCollection.create(tag.toJSON());
    },

    /**
     * Event handler whenever a tag gets deselected.
     * Removes the selected tag from the mapping collection.
     *
     * @param {string} tagId tag id
     */
    _onDeselectTag: function _onDeselectTag(tagId) {
      this.selectedTagsCollection.get(tagId).destroy();
    },

    /**
     * Event handler whenever a tag was renamed globally.
     *
     * This will automatically adjust the tag mapping collection to
     * container the new name.
     *
     * @param {OC.Backbone.Model} changedTag tag model that has changed
     */
    _onTagRenamedGlobally: function _onTagRenamedGlobally(changedTag) {
      // also rename it in the selection, if applicable
      var selectedTagMapping = this.selectedTagsCollection.get(changedTag.id);

      if (selectedTagMapping) {
        selectedTagMapping.set(changedTag.toJSON());
      }
    },

    /**
     * Event handler whenever a tag was deleted globally.
     *
     * This will automatically adjust the tag mapping collection to
     * container the new name.
     *
     * @param {OC.Backbone.Model} tagId tag model that has changed
     */
    _onTagDeletedGlobally: function _onTagDeletedGlobally(tagId) {
      // also rename it in the selection, if applicable
      this.selectedTagsCollection.remove(tagId);
    },
    setFileInfo: function setFileInfo(fileInfo) {
      var self = this;

      if (!this._rendered) {
        this.render();
      }

      if (fileInfo) {
        this.selectedTagsCollection.setObjectId(fileInfo.id);
        this.selectedTagsCollection.fetch({
          success: function success(collection) {
            collection.fetched = true;
            var appliedTags = collection.map(modelToSelection);

            self._inputView.setData(appliedTags);

            if (appliedTags.length > 0) {
              self.show();
            }
          }
        });
      }

      this.hide();
    },

    /**
     * Renders this details view
     */
    render: function render() {
      this.$el.append(this._inputView.$el);

      this._inputView.render();
    },
    isVisible: function isVisible() {
      return !this.$el.hasClass('hidden');
    },
    show: function show() {
      this.$el.removeClass('hidden');
    },
    hide: function hide() {
      this.$el.addClass('hidden');
    },
    toggle: function toggle() {
      this.$el.toggleClass('hidden');
    },
    openDropdown: function openDropdown() {
      this.$el.find('.systemTagsInputField').select2('open');
    },
    remove: function remove() {
      this._inputView.remove();
    }
  });
  OCA.SystemTags.SystemTagsInfoView = SystemTagsInfoView;
})(OCA);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/systemtags/src/css/systemtagsfilelist.scss":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/systemtags/src/css/systemtagsfilelist.scss ***!
  \**************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/*\n * Copyright (c) 2016\n *\n * This file is licensed under the Affero General Public License version 3\n * or later.\n *\n * See the COPYING-README file.\n *\n */\n#app-content-systemtagsfilter .select2-container {\n  width: 30%;\n  margin-left: 10px;\n}\n\n#app-sidebar .app-sidebar-header__action .tag-label {\n  cursor: pointer;\n  padding: 13px 0;\n  display: flex;\n  color: var(--color-text-light);\n  position: relative;\n  margin-top: -20px;\n}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ });
//# sourceMappingURL=systemtags.js.map