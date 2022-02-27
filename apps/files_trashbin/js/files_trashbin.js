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
/******/ 	return __webpack_require__(__webpack_require__.s = "./apps/files_trashbin/src/files_trashbin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./apps/files_trashbin/src/app.js":
/*!****************************************!*\
  !*** ./apps/files_trashbin/src/app.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014
 *
 * @author Abijeet <abijeetpatro@gmail.com>
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
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
OCA.Trashbin = {};
/**
 * @namespace OCA.Trashbin.App
 */

OCA.Trashbin.App = {
  _initialized: false,

  /** @type {OC.Files.Client} */
  client: null,
  initialize: function initialize($el) {
    if (this._initialized) {
      return;
    }

    this._initialized = true;
    this.client = new OC.Files.Client({
      host: OC.getHost(),
      port: OC.getPort(),
      root: OC.linkToRemoteBase('dav') + '/trashbin/' + OC.getCurrentUser().uid,
      useHTTPS: OC.getProtocol() === 'https'
    });
    var urlParams = OC.Util.History.parseUrlQuery();
    this.fileList = new OCA.Trashbin.FileList($('#app-content-trashbin'), {
      fileActions: this._createFileActions(),
      detailsViewEnabled: false,
      scrollTo: urlParams.scrollto,
      config: OCA.Files.App.getFilesConfig(),
      multiSelectMenu: [{
        name: 'restore',
        displayName: t('files_trashbin', 'Restore'),
        iconClass: 'icon-history'
      }, {
        name: 'delete',
        displayName: t('files_trashbin', 'Delete permanently'),
        iconClass: 'icon-delete'
      }],
      client: this.client,
      // The file list is created when a "show" event is handled, so
      // it should be marked as "shown" like it would have been done
      // if handling the event with the file list already created.
      shown: true
    });
  },
  _createFileActions: function _createFileActions() {
    var client = this.client;
    var fileActions = new OCA.Files.FileActions();
    fileActions.register('dir', 'Open', OC.PERMISSION_READ, '', function (filename, context) {
      var dir = context.fileList.getCurrentDirectory();
      context.fileList.changeDirectory(OC.joinPaths(dir, filename));
    });
    fileActions.setDefault('dir', 'Open');
    fileActions.registerAction({
      name: 'Restore',
      displayName: t('files_trashbin', 'Restore'),
      type: OCA.Files.FileActions.TYPE_INLINE,
      mime: 'all',
      permissions: OC.PERMISSION_READ,
      iconClass: 'icon-history',
      actionHandler: function actionHandler(filename, context) {
        var fileList = context.fileList;
        var tr = fileList.findFileEl(filename);
        fileList.showFileBusyState(tr, true);
        var dir = context.fileList.getCurrentDirectory();
        client.move(OC.joinPaths('trash', dir, filename), OC.joinPaths('restore', filename), true).then(fileList._removeCallback.bind(fileList, [filename]), function () {
          fileList.showFileBusyState(tr, false);
          OC.Notification.show(t('files_trashbin', 'Error while restoring file from trashbin'));
        });
      }
    });
    fileActions.registerAction({
      name: 'Delete',
      displayName: t('files_trashbin', 'Delete permanently'),
      mime: 'all',
      permissions: OC.PERMISSION_READ,
      iconClass: 'icon-delete',
      render: function render(actionSpec, isDefault, context) {
        var $actionLink = fileActions._makeActionLink(actionSpec, context);

        $actionLink.attr('original-title', t('files_trashbin', 'Delete permanently'));
        $actionLink.children('img').attr('alt', t('files_trashbin', 'Delete permanently'));
        context.$file.find('td:last').append($actionLink);
        return $actionLink;
      },
      actionHandler: function actionHandler(filename, context) {
        var fileList = context.fileList;
        $('.tipsy').remove();
        var tr = fileList.findFileEl(filename);
        fileList.showFileBusyState(tr, true);
        var dir = context.fileList.getCurrentDirectory();
        client.remove(OC.joinPaths('trash', dir, filename)).then(fileList._removeCallback.bind(fileList, [filename]), function () {
          fileList.showFileBusyState(tr, false);
          OC.Notification.show(t('files_trashbin', 'Error while removing file from trashbin'));
        });
      }
    });
    return fileActions;
  }
};
window.addEventListener('DOMContentLoaded', function () {
  $('#app-content-trashbin').one('show', function () {
    var App = OCA.Trashbin.App;
    App.initialize($('#app-content-trashbin')); // force breadcrumb init
    // App.fileList.changeDirectory(App.fileList.getCurrentDirectory(), false, true);
  });
});

/***/ }),

/***/ "./apps/files_trashbin/src/filelist.js":
/*!*********************************************!*\
  !*** ./apps/files_trashbin/src/filelist.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014
 *
 * @author Azul <azul@riseup.net>
 * @author Gary Kim <gary@garykim.dev>
 * @author Jan C. Borchardt <hey@jancborchardt.net>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Robin Appelman <robin@icewind.nl>
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

/* eslint-disable */
(function () {
  var DELETED_REGEXP = new RegExp(/^(.+)\.d[0-9]+$/);
  var FILENAME_PROP = '{http://nextcloud.org/ns}trashbin-filename';
  var DELETION_TIME_PROP = '{http://nextcloud.org/ns}trashbin-deletion-time';
  var TRASHBIN_ORIGINAL_LOCATION = '{http://nextcloud.org/ns}trashbin-original-location';
  var TRASHBIN_TITLE = '{http://nextcloud.org/ns}trashbin-title';
  /**
   * Convert a file name in the format filename.d12345 to the real file name.
   * This will use basename.
   * The name will not be changed if it has no ".d12345" suffix.
   * @param {String} name file name
   * @returns {String} converted file name
   */

  function getDeletedFileName(name) {
    name = OC.basename(name);
    var match = DELETED_REGEXP.exec(name);

    if (match && match.length > 1) {
      name = match[1];
    }

    return name;
  }
  /**
   * @class OCA.Trashbin.FileList
   * @augments OCA.Files.FileList
   * @classdesc List of deleted files
   *
   * @param $el container element with existing markup for the #controls
   * and a table
   * @param [options] map of options
   */


  var FileList = function FileList($el, options) {
    this.client = options.client;
    this.initialize($el, options);
  };

  FileList.prototype = _.extend({}, OCA.Files.FileList.prototype,
  /** @lends OCA.Trashbin.FileList.prototype */
  {
    id: 'trashbin',
    appName: t('files_trashbin', 'Deleted files'),

    /** @type {OC.Files.Client} */
    client: null,

    /**
     * @private
     */
    initialize: function initialize() {
      this.client.addFileInfoParser(function (response, data) {
        var props = response.propStat[0].properties;
        var path = props[TRASHBIN_ORIGINAL_LOCATION];
        var title = props[TRASHBIN_TITLE];
        return {
          displayName: props[FILENAME_PROP],
          mtime: parseInt(props[DELETION_TIME_PROP], 10) * 1000,
          hasPreview: true,
          path: path,
          extraData: title
        };
      });
      var result = OCA.Files.FileList.prototype.initialize.apply(this, arguments);
      this.$el.find('.undelete').click('click', _.bind(this._onClickRestoreSelected, this)); // Sort by most recently deleted first

      this.setSort('mtime', 'desc');
      /**
       * Override crumb making to add "Deleted Files" entry
       * and convert files with ".d" extensions to a more
       * user friendly name.
       */

      this.breadcrumb._makeCrumbs = function () {
        var parts = OCA.Files.BreadCrumb.prototype._makeCrumbs.apply(this, [].concat(Array.prototype.slice.call(arguments), ['icon-delete no-hover']));

        for (var i = 1; i < parts.length; i++) {
          parts[i].name = getDeletedFileName(parts[i].name);
        }

        return parts;
      };

      OC.Plugins.attach('OCA.Trashbin.FileList', this);
      return result;
    },

    /**
    * Override to only return read permissions
    */
    getDirectoryPermissions: function getDirectoryPermissions() {
      return OC.PERMISSION_READ | OC.PERMISSION_DELETE;
    },
    _setCurrentDir: function _setCurrentDir(targetDir) {
      OCA.Files.FileList.prototype._setCurrentDir.apply(this, arguments);

      var baseDir = OC.basename(targetDir);

      if (baseDir !== '') {
        this.setPageTitle(getDeletedFileName(baseDir));
      }
    },
    _createRow: function _createRow() {
      // FIXME: MEGAHACK until we find a better solution
      var tr = OCA.Files.FileList.prototype._createRow.apply(this, arguments);

      tr.find('td.filesize').remove();
      return tr;
    },
    getAjaxUrl: function getAjaxUrl(action, params) {
      var q = '';

      if (params) {
        q = '?' + OC.buildQueryString(params);
      }

      return OC.filePath('files_trashbin', 'ajax', action + '.php') + q;
    },
    setupUploadEvents: function setupUploadEvents() {// override and do nothing
    },
    linkTo: function linkTo(dir) {
      return OC.linkTo('files', 'index.php') + '?view=trashbin&dir=' + encodeURIComponent(dir).replace(/%2F/g, '/');
    },
    elementToFile: function elementToFile($el) {
      var fileInfo = OCA.Files.FileList.prototype.elementToFile($el);

      if (this.getCurrentDirectory() === '/') {
        fileInfo.displayName = getDeletedFileName(fileInfo.name);
      } // no size available


      delete fileInfo.size;
      return fileInfo;
    },
    updateEmptyContent: function updateEmptyContent() {
      var exists = this.$fileList.find('tr:first').exists();
      this.$el.find('#emptycontent').toggleClass('hidden', exists);
      this.$el.find('#filestable th').toggleClass('hidden', !exists);
    },
    _removeCallback: function _removeCallback(files) {
      var $el;

      for (var i = 0; i < files.length; i++) {
        $el = this.remove(OC.basename(files[i]), {
          updateSummary: false
        });
        this.fileSummary.remove({
          type: $el.attr('data-type'),
          size: $el.attr('data-size')
        });
      }

      this.fileSummary.update();
      this.updateEmptyContent();
    },
    _onClickRestoreSelected: function _onClickRestoreSelected(event) {
      event.preventDefault();
      var self = this;

      var files = _.pluck(this.getSelectedFiles(), 'name');

      for (var i = 0; i < files.length; i++) {
        var tr = this.findFileEl(files[i]);
        this.showFileBusyState(tr, true);
      }

      this.fileMultiSelectMenu.toggleLoading('restore', true);
      var restorePromises = files.map(function (file) {
        return self.client.move(OC.joinPaths('trash', self.getCurrentDirectory(), file), OC.joinPaths('restore', file), true).then(function () {
          self._removeCallback([file]);
        });
      });
      return Promise.all(restorePromises).then(function () {
        self.fileMultiSelectMenu.toggleLoading('restore', false);
      }, function () {
        OC.Notification.show(t('files_trashbin', 'Error while restoring files from trashbin'));
      });
    },
    _onClickDeleteSelected: function _onClickDeleteSelected(event) {
      event.preventDefault();
      var self = this;
      var allFiles = this.$el.find('.select-all').is(':checked');

      var files = _.pluck(this.getSelectedFiles(), 'name');

      for (var i = 0; i < files.length; i++) {
        var tr = this.findFileEl(files[i]);
        this.showFileBusyState(tr, true);
      }

      if (allFiles) {
        return this.client.remove(OC.joinPaths('trash', this.getCurrentDirectory())).then(function () {
          self.hideMask();
          self.setFiles([]);
        }, function () {
          OC.Notification.show(t('files_trashbin', 'Error while emptying trashbin'));
        });
      } else {
        this.fileMultiSelectMenu.toggleLoading('delete', true);
        var deletePromises = files.map(function (file) {
          return self.client.remove(OC.joinPaths('trash', self.getCurrentDirectory(), file)).then(function () {
            self._removeCallback([file]);
          });
        });
        return Promise.all(deletePromises).then(function () {
          self.fileMultiSelectMenu.toggleLoading('delete', false);
        }, function () {
          OC.Notification.show(t('files_trashbin', 'Error while removing files from trashbin'));
        });
      }
    },
    _onClickFile: function _onClickFile(event) {
      var mime = $(this).parent().parent().data('mime');

      if (mime !== 'httpd/unix-directory') {
        event.preventDefault();
      }

      return OCA.Files.FileList.prototype._onClickFile.apply(this, arguments);
    },
    generatePreviewUrl: function generatePreviewUrl(urlSpec) {
      return OC.generateUrl('/apps/files_trashbin/preview?') + $.param(urlSpec);
    },
    getDownloadUrl: function getDownloadUrl() {
      // no downloads
      return '#';
    },
    getDefaultActionUrl: function getDefaultActionUrl() {
      // no default action
      return '#';
    },
    updateStorageStatistics: function updateStorageStatistics() {// no op because the trashbin doesn't have
      // storage info like free space / used space
    },
    isSelectedDeletable: function isSelectedDeletable() {
      return true;
    },

    /**
    * Returns list of webdav properties to request
    */
    _getWebdavProperties: function _getWebdavProperties() {
      return [FILENAME_PROP, DELETION_TIME_PROP, TRASHBIN_ORIGINAL_LOCATION, TRASHBIN_TITLE].concat(this.filesClient.getPropfindProperties());
    },

    /**
    * Reloads the file list using ajax call
    *
    * @returns ajax call object
    */
    reload: function reload() {
      this._selectedFiles = {};

      this._selectionSummary.clear();

      this.$el.find('.select-all').prop('checked', false);
      this.showMask();

      if (this._reloadCall) {
        this._reloadCall.abort();
      }

      this._reloadCall = this.client.getFolderContents('trash/' + this.getCurrentDirectory(), {
        includeParent: false,
        properties: this._getWebdavProperties()
      });
      var callBack = this.reloadCallback.bind(this);
      return this._reloadCall.then(callBack, callBack);
    },
    reloadCallback: function reloadCallback(status, result) {
      delete this._reloadCall;
      this.hideMask();

      if (status === 401) {
        return false;
      } // Firewall Blocked request?


      if (status === 403) {
        // Go home
        this.changeDirectory('/');
        OC.Notification.show(t('files', 'This operation is forbidden'));
        return false;
      } // Did share service die or something else fail?


      if (status === 500) {
        // Go home
        this.changeDirectory('/');
        OC.Notification.show(t('files', 'This directory is unavailable, please check the logs or contact the administrator'));
        return false;
      }

      if (status === 404) {
        // go back home
        this.changeDirectory('/');
        return false;
      } // aborted ?


      if (status === 0) {
        return true;
      }

      this.setFiles(result);
      return true;
    }
  });
  OCA.Trashbin.FileList = FileList;
})();

/***/ }),

/***/ "./apps/files_trashbin/src/files_trashbin.js":
/*!***************************************************!*\
  !*** ./apps/files_trashbin/src/files_trashbin.js ***!
  \***************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./apps/files_trashbin/src/app.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _filelist__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filelist */ "./apps/files_trashbin/src/filelist.js");
/* harmony import */ var _filelist__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_filelist__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _trash_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./trash.scss */ "./apps/files_trashbin/src/trash.scss");
/**
 * @copyright Copyright (c) 2016 Roeland Jago Douma <roeland@famdouma.nl>
 *
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



window.OCA.Trashbin = OCA.Trashbin;

/***/ }),

/***/ "./apps/files_trashbin/src/trash.scss":
/*!********************************************!*\
  !*** ./apps/files_trashbin/src/trash.scss ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_trash_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./trash.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_trashbin/src/trash.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_trash_scss__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_trash_scss__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_trashbin/src/trash.scss":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_trashbin/src/trash.scss ***!
  \*************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/*\n * Copyright (c) 2014\n *\n * This file is licensed under the Affero General Public License version 3\n * or later.\n *\n * See the COPYING-README file.\n *\n */\n#app-content-trashbin tbody tr[data-type=file] td a.name,\n#app-content-trashbin tbody tr[data-type=file] td a.name span.nametext,\n#app-content-trashbin tbody tr[data-type=file] td a.name span.nametext span {\n  cursor: default;\n}\n\n#app-content-trashbin .summary :last-child {\n  padding: 0;\n}\n\n#app-content-trashbin #filestable .summary .filesize {\n  display: none;\n}", ""]);
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
//# sourceMappingURL=files_trashbin.js.map