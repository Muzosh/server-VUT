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
/******/ 	return __webpack_require__(__webpack_require__.s = "./apps/files_sharing/src/additionalScripts.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./apps/files_sharing/src/additionalScripts.js":
/*!*****************************************************!*\
  !*** ./apps/files_sharing/src/additionalScripts.js ***!
  \*****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _share__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./share */ "./apps/files_sharing/src/share.js");
/* harmony import */ var _sharebreadcrumbview__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sharebreadcrumbview */ "./apps/files_sharing/src/sharebreadcrumbview.js");
/* harmony import */ var _sharebreadcrumbview__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sharebreadcrumbview__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_sharebreadcrumb_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style/sharebreadcrumb.scss */ "./apps/files_sharing/src/style/sharebreadcrumb.scss");
/* harmony import */ var _collaborationresourceshandler_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./collaborationresourceshandler.js */ "./apps/files_sharing/src/collaborationresourceshandler.js");
/* harmony import */ var _collaborationresourceshandler_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_collaborationresourceshandler_js__WEBPACK_IMPORTED_MODULE_3__);
/**
 * @copyright Copyright (c) 2016 Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
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



 // eslint-disable-next-line camelcase

__webpack_require__.p = OC.linkTo('files_sharing', 'js/dist/'); // eslint-disable-next-line camelcase

__webpack_require__.nc = btoa(OC.requestToken);
window.OCA.Sharing = OCA.Sharing;

/***/ }),

/***/ "./apps/files_sharing/src/collaborationresourceshandler.js":
/*!*****************************************************************!*\
  !*** ./apps/files_sharing/src/collaborationresourceshandler.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @copyright Copyright (c) 2016 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
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
// eslint-disable-next-line camelcase
__webpack_require__.p = OC.linkTo('files_sharing', 'js/dist/'); // eslint-disable-next-line camelcase

__webpack_require__.nc = btoa(OC.requestToken);
window.OCP.Collaboration.registerType('file', {
  action: function action() {
    return new Promise(function (resolve, reject) {
      OC.dialogs.filepicker(t('files_sharing', 'Link to a file'), function (f) {
        var client = OC.Files.getClient();
        client.getFileInfo(f).then(function (status, fileInfo) {
          resolve(fileInfo.id);
        }).fail(function () {
          reject(new Error('Cannot get fileinfo'));
        });
      }, false, null, false, OC.dialogs.FILEPICKER_TYPE_CHOOSE, '', {
        allowDirectoryChooser: true
      });
    });
  },
  typeString: t('files_sharing', 'Link to a file'),
  typeIconClass: 'icon-files-dark'
});

/***/ }),

/***/ "./apps/files_sharing/src/share.js":
/*!*****************************************!*\
  !*** ./apps/files_sharing/src/share.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var escape_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! escape-html */ "./node_modules/escape-html/index.js");
/* harmony import */ var escape_html__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(escape_html__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Copyright (c) 2014
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
 * @author Maxence Lange <maxence@nextcloud.com>
 * @author Michael Jobst <mjobst+github@tecratech.de>
 * @author Michael Jobst <mjobst@necls.com>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 * @author Samuel <faust64@gmail.com>
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
  _.extend(OC.Files.Client, {
    PROPERTY_SHARE_TYPES: '{' + OC.Files.Client.NS_OWNCLOUD + '}share-types',
    PROPERTY_OWNER_ID: '{' + OC.Files.Client.NS_OWNCLOUD + '}owner-id',
    PROPERTY_OWNER_DISPLAY_NAME: '{' + OC.Files.Client.NS_OWNCLOUD + '}owner-display-name'
  });

  if (!OCA.Sharing) {
    OCA.Sharing = {};
  }
  /**
   * @namespace
   */


  OCA.Sharing.Util = {
    /**
     * Regular expression for splitting parts of remote share owners:
     * "user@example.com/"
     * "user@example.com/path/to/owncloud"
     * "user@anotherexample.com@example.com/path/to/owncloud
     */
    _REMOTE_OWNER_REGEXP: new RegExp('^(([^@]*)@(([^@^/\\s]*)@)?)((https://)?[^[\\s/]*)([/](.*))?$'),

    /**
     * Initialize the sharing plugin.
     *
     * Registers the "Share" file action and adds additional
     * DOM attributes for the sharing file info.
     *
     * @param {OCA.Files.FileList} fileList file list to be extended
     */
    attach: function attach(fileList) {
      // core sharing is disabled/not loaded
      if (!OC.Share) {
        return;
      }

      if (fileList.id === 'trashbin' || fileList.id === 'files.public') {
        return;
      }

      var fileActions = fileList.fileActions;
      var oldCreateRow = fileList._createRow;

      fileList._createRow = function (fileData) {
        var tr = oldCreateRow.apply(this, arguments);
        var sharePermissions = OCA.Sharing.Util.getSharePermissions(fileData);

        if (fileData.permissions === 0) {
          // no permission, disabling sidebar
          delete fileActions.actions.all.Comment;
          delete fileActions.actions.all.Details;
          delete fileActions.actions.all.Goto;
        }

        tr.attr('data-share-permissions', sharePermissions);

        if (fileData.shareOwner) {
          tr.attr('data-share-owner', fileData.shareOwner);
          tr.attr('data-share-owner-id', fileData.shareOwnerId); // user should always be able to rename a mount point

          if (fileData.mountType === 'shared-root') {
            tr.attr('data-permissions', fileData.permissions | OC.PERMISSION_UPDATE);
          }
        }

        if (fileData.recipientData && !_.isEmpty(fileData.recipientData)) {
          tr.attr('data-share-recipient-data', JSON.stringify(fileData.recipientData));
        }

        if (fileData.shareTypes) {
          tr.attr('data-share-types', fileData.shareTypes.join(','));
        }

        return tr;
      };

      var oldElementToFile = fileList.elementToFile;

      fileList.elementToFile = function ($el) {
        var fileInfo = oldElementToFile.apply(this, arguments);
        fileInfo.sharePermissions = $el.attr('data-share-permissions') || undefined;
        fileInfo.shareOwner = $el.attr('data-share-owner') || undefined;
        fileInfo.shareOwnerId = $el.attr('data-share-owner-id') || undefined;

        if ($el.attr('data-share-types')) {
          fileInfo.shareTypes = $el.attr('data-share-types').split(',');
        }

        if ($el.attr('data-expiration')) {
          var expirationTimestamp = parseInt($el.attr('data-expiration'));
          fileInfo.shares = [];
          fileInfo.shares.push({
            expiration: expirationTimestamp
          });
        }

        return fileInfo;
      };

      var oldGetWebdavProperties = fileList._getWebdavProperties;

      fileList._getWebdavProperties = function () {
        var props = oldGetWebdavProperties.apply(this, arguments);
        props.push(OC.Files.Client.PROPERTY_OWNER_ID);
        props.push(OC.Files.Client.PROPERTY_OWNER_DISPLAY_NAME);
        props.push(OC.Files.Client.PROPERTY_SHARE_TYPES);
        return props;
      };

      fileList.filesClient.addFileInfoParser(function (response) {
        var data = {};
        var props = response.propStat[0].properties;
        var permissionsProp = props[OC.Files.Client.PROPERTY_PERMISSIONS];

        if (permissionsProp && permissionsProp.indexOf('S') >= 0) {
          data.shareOwner = props[OC.Files.Client.PROPERTY_OWNER_DISPLAY_NAME];
          data.shareOwnerId = props[OC.Files.Client.PROPERTY_OWNER_ID];
        }

        var shareTypesProp = props[OC.Files.Client.PROPERTY_SHARE_TYPES];

        if (shareTypesProp) {
          data.shareTypes = _.chain(shareTypesProp).filter(function (xmlvalue) {
            return xmlvalue.namespaceURI === OC.Files.Client.NS_OWNCLOUD && xmlvalue.nodeName.split(':')[1] === 'share-type';
          }).map(function (xmlvalue) {
            return parseInt(xmlvalue.textContent || xmlvalue.text, 10);
          }).value();
        }

        return data;
      }); // use delegate to catch the case with multiple file lists

      fileList.$el.on('fileActionsReady', function (ev) {
        var $files = ev.$files;

        _.each($files, function (file) {
          var $tr = $(file);
          var shareTypes = $tr.attr('data-share-types') || '';
          var shareOwner = $tr.attr('data-share-owner');

          if (shareTypes || shareOwner) {
            var hasLink = false;
            var hasShares = false;

            _.each(shareTypes.split(',') || [], function (shareType) {
              shareType = parseInt(shareType, 10);

              if (shareType === OC.Share.SHARE_TYPE_LINK) {
                hasLink = true;
              } else if (shareType === OC.Share.SHARE_TYPE_EMAIL) {
                hasLink = true;
              } else if (shareType === OC.Share.SHARE_TYPE_USER) {
                hasShares = true;
              } else if (shareType === OC.Share.SHARE_TYPE_GROUP) {
                hasShares = true;
              } else if (shareType === OC.Share.SHARE_TYPE_REMOTE) {
                hasShares = true;
              } else if (shareType === OC.Share.SHARE_TYPE_REMOTE_GROUP) {
                hasShares = true;
              } else if (shareType === OC.Share.SHARE_TYPE_CIRCLE) {
                hasShares = true;
              } else if (shareType === OC.Share.SHARE_TYPE_ROOM) {
                hasShares = true;
              } else if (shareType === OC.Share.SHARE_TYPE_DECK) {
                hasShares = true;
              }
            });

            OCA.Sharing.Util._updateFileActionIcon($tr, hasShares, hasLink);
          }
        });
      });
      fileList.$el.on('changeDirectory', function () {
        OCA.Sharing.sharesLoaded = false;
      });
      fileActions.registerAction({
        name: 'Share',
        displayName: function displayName(context) {
          if (context && context.$file) {
            var shareType = parseInt(context.$file.data('share-types'), 10);
            var shareOwner = context.$file.data('share-owner-id');

            if (shareType >= 0 || shareOwner) {
              return t('files_sharing', 'Shared');
            }
          }

          return t('files_sharing', 'Share');
        },
        altText: t('files_sharing', 'Share'),
        mime: 'all',
        order: -150,
        permissions: OC.PERMISSION_ALL,
        iconClass: function iconClass(fileName, context) {
          var shareType = parseInt(context.$file.data('share-types'), 10);

          if (shareType === OC.Share.SHARE_TYPE_EMAIL || shareType === OC.Share.SHARE_TYPE_LINK) {
            return 'icon-public';
          }

          return 'icon-shared';
        },
        icon: function icon(fileName, context) {
          var shareOwner = context.$file.data('share-owner-id');

          if (shareOwner) {
            return OC.generateUrl("/avatar/".concat(shareOwner, "/32"));
          }
        },
        type: OCA.Files.FileActions.TYPE_INLINE,
        actionHandler: function actionHandler(fileName, context) {
          // details view disabled in some share lists
          if (!fileList._detailsView) {
            return;
          } // do not open sidebar if permission is set and equal to 0


          var permissions = parseInt(context.$file.data('share-permissions'), 10);

          if (isNaN(permissions) || permissions > 0) {
            fileList.showDetailsView(fileName, 'sharing');
          }
        },
        render: function render(actionSpec, isDefault, context) {
          var permissions = parseInt(context.$file.data('permissions'), 10); // if no share permissions but share owner exists, still show the link

          if ((permissions & OC.PERMISSION_SHARE) !== 0 || context.$file.attr('data-share-owner')) {
            return fileActions._defaultRenderAction.call(fileActions, actionSpec, isDefault, context);
          } // don't render anything


          return null;
        }
      }); // register share breadcrumbs component

      var breadCrumbSharingDetailView = new OCA.Sharing.ShareBreadCrumbView();
      fileList.registerBreadCrumbDetailView(breadCrumbSharingDetailView);
    },

    /**
     * Update file list data attributes
     */
    _updateFileListDataAttributes: function _updateFileListDataAttributes(fileList, $tr, shareModel) {
      // files app current cannot show recipients on load, so we don't update the
      // icon when changed for consistency
      if (fileList.id === 'files') {
        return;
      }

      var recipients = _.pluck(shareModel.get('shares'), 'share_with_displayname'); // note: we only update the data attribute because updateIcon()


      if (recipients.length) {
        var recipientData = _.mapObject(shareModel.get('shares'), function (share) {
          return {
            shareWith: share.share_with,
            shareWithDisplayName: share.share_with_displayname
          };
        });

        $tr.attr('data-share-recipient-data', JSON.stringify(recipientData));
      } else {
        $tr.removeAttr('data-share-recipient-data');
      }
    },

    /**
     * Update the file action share icon for the given file
     *
     * @param $tr file element of the file to update
     * @param {boolean} hasUserShares true if a user share exists
     * @param {boolean} hasLinkShares true if a link share exists
     *
     * @returns {boolean} true if the icon was set, false otherwise
     */
    _updateFileActionIcon: function _updateFileActionIcon($tr, hasUserShares, hasLinkShares) {
      // if the statuses are loaded already, use them for the icon
      // (needed when scrolling to the next page)
      if (hasUserShares || hasLinkShares || $tr.attr('data-share-recipient-data') || $tr.attr('data-share-owner')) {
        OCA.Sharing.Util._markFileAsShared($tr, true, hasLinkShares);

        return true;
      }

      return false;
    },

    /**
     * Marks/unmarks a given file as shared by changing its action icon
     * and folder icon.
     *
     * @param $tr file element to mark as shared
     * @param hasShares whether shares are available
     * @param hasLink whether link share is available
     */
    _markFileAsShared: function _markFileAsShared($tr, hasShares, hasLink) {
      var action = $tr.find('.fileactions .action[data-action="Share"]');
      var type = $tr.data('type');
      var icon = action.find('.icon');
      var message, recipients, avatars;
      var ownerId = $tr.attr('data-share-owner-id');
      var owner = $tr.attr('data-share-owner');
      var mountType = $tr.attr('data-mounttype');
      var shareFolderIcon;
      var iconClass = 'icon-shared';
      action.removeClass('shared-style'); // update folder icon

      if (type === 'dir' && (hasShares || hasLink || ownerId)) {
        if (typeof mountType !== 'undefined' && mountType !== 'shared-root' && mountType !== 'shared') {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-' + mountType);
        } else if (hasLink) {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-public');
        } else {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-shared');
        }

        $tr.find('.filename .thumbnail').css('background-image', 'url(' + shareFolderIcon + ')');
        $tr.attr('data-icon', shareFolderIcon);
      } else if (type === 'dir') {
        var isEncrypted = $tr.attr('data-e2eencrypted'); // FIXME: duplicate of FileList._createRow logic for external folder,
        // need to refactor the icon logic into a single code path eventually

        if (isEncrypted === 'true') {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-encrypted');
          $tr.attr('data-icon', shareFolderIcon);
        } else if (mountType && mountType.indexOf('external') === 0) {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-external');
          $tr.attr('data-icon', shareFolderIcon);
        } else {
          shareFolderIcon = OC.MimeType.getIconUrl('dir'); // back to default

          $tr.removeAttr('data-icon');
        }

        $tr.find('.filename .thumbnail').css('background-image', 'url(' + shareFolderIcon + ')');
      } // update share action text / icon


      if (hasShares || ownerId) {
        recipients = $tr.data('share-recipient-data');
        action.addClass('shared-style');
        avatars = '<span>' + t('files_sharing', 'Shared') + '</span>'; // even if reshared, only show "Shared by"

        if (ownerId) {
          message = t('files_sharing', 'Shared by');
          avatars = OCA.Sharing.Util._formatRemoteShare(ownerId, owner, message);
        } else if (recipients) {
          avatars = OCA.Sharing.Util._formatShareList(recipients);
        }

        action.html(avatars).prepend(icon);

        if (ownerId || recipients) {
          var avatarElement = action.find('.avatar');
          avatarElement.each(function () {
            $(this).avatar($(this).data('username'), 32);
          });
          action.find('span[title]').tooltip({
            placement: 'top'
          });
        }
      } else {
        action.html('<span class="hidden-visually">' + t('files_sharing', 'Shared') + '</span>').prepend(icon);
      }

      if (hasLink) {
        iconClass = 'icon-public';
      }

      icon.removeClass('icon-shared icon-public').addClass(iconClass);
    },

    /**
     * Format a remote address
     *
     * @param {String} shareWith userid, full remote share, or whatever
     * @param {String} shareWithDisplayName
     * @param {String} message
     * @returns {String} HTML code to display
     */
    _formatRemoteShare: function _formatRemoteShare(shareWith, shareWithDisplayName, message) {
      var parts = OCA.Sharing.Util._REMOTE_OWNER_REGEXP.exec(shareWith);

      if (!parts || !parts[7]) {
        // display avatar of the user
        var avatar = '<span class="avatar" data-username="' + escape_html__WEBPACK_IMPORTED_MODULE_0___default()(shareWith) + '" title="' + message + ' ' + escape_html__WEBPACK_IMPORTED_MODULE_0___default()(shareWithDisplayName) + '"></span>';
        var hidden = '<span class="hidden-visually">' + message + ' ' + escape_html__WEBPACK_IMPORTED_MODULE_0___default()(shareWithDisplayName) + '</span> ';
        return avatar + hidden;
      }

      var userName = parts[2];
      var userDomain = parts[4];
      var server = parts[5];
      var protocol = parts[6];
      var serverPath = parts[8] ? parts[7] : ''; // no trailing slash on root

      var tooltip = message + ' ' + userName;

      if (userDomain) {
        tooltip += '@' + userDomain;
      }

      if (server) {
        tooltip += '@' + server.replace(protocol, '') + serverPath;
      }

      var html = '<span class="remoteAddress" title="' + escape_html__WEBPACK_IMPORTED_MODULE_0___default()(tooltip) + '">';
      html += '<span class="username">' + escape_html__WEBPACK_IMPORTED_MODULE_0___default()(userName) + '</span>';

      if (userDomain) {
        html += '<span class="userDomain">@' + escape_html__WEBPACK_IMPORTED_MODULE_0___default()(userDomain) + '</span>';
      }

      html += '</span> ';
      return html;
    },

    /**
     * Loop over all recipients in the list and format them using
     * all kind of fancy magic.
     *
    * @param {Object} recipients array of all the recipients
    * @returns {String[]} modified list of recipients
    */
    _formatShareList: function _formatShareList(recipients) {
      var _parent = this;

      recipients = _.toArray(recipients);
      recipients.sort(function (a, b) {
        return a.shareWithDisplayName.localeCompare(b.shareWithDisplayName);
      });
      return $.map(recipients, function (recipient) {
        return _parent._formatRemoteShare(recipient.shareWith, recipient.shareWithDisplayName, t('files_sharing', 'Shared with'));
      });
    },

    /**
     * Marks/unmarks a given file as shared by changing its action icon
     * and folder icon.
     *
    * @param $tr file element to mark as shared
    * @param hasShares whether shares are available
    * @param hasLink whether link share is available
    */
    markFileAsShared: function markFileAsShared($tr, hasShares, hasLink) {
      var action = $tr.find('.fileactions .action[data-action="Share"]');
      var type = $tr.data('type');
      var icon = action.find('.icon');
      var message, recipients, avatars;
      var ownerId = $tr.attr('data-share-owner-id');
      var owner = $tr.attr('data-share-owner');
      var mountType = $tr.attr('data-mounttype');
      var shareFolderIcon;
      var iconClass = 'icon-shared';
      action.removeClass('shared-style'); // update folder icon

      if (type === 'dir' && (hasShares || hasLink || ownerId)) {
        if (typeof mountType !== 'undefined' && mountType !== 'shared-root' && mountType !== 'shared') {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-' + mountType);
        } else if (hasLink) {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-public');
        } else {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-shared');
        }

        $tr.find('.filename .thumbnail').css('background-image', 'url(' + shareFolderIcon + ')');
        $tr.attr('data-icon', shareFolderIcon);
      } else if (type === 'dir') {
        var isEncrypted = $tr.attr('data-e2eencrypted'); // FIXME: duplicate of FileList._createRow logic for external folder,
        // need to refactor the icon logic into a single code path eventually

        if (isEncrypted === 'true') {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-encrypted');
          $tr.attr('data-icon', shareFolderIcon);
        } else if (mountType && mountType.indexOf('external') === 0) {
          shareFolderIcon = OC.MimeType.getIconUrl('dir-external');
          $tr.attr('data-icon', shareFolderIcon);
        } else {
          shareFolderIcon = OC.MimeType.getIconUrl('dir'); // back to default

          $tr.removeAttr('data-icon');
        }

        $tr.find('.filename .thumbnail').css('background-image', 'url(' + shareFolderIcon + ')');
      } // update share action text / icon


      if (hasShares || ownerId) {
        recipients = $tr.data('share-recipient-data');
        action.addClass('shared-style');
        avatars = '<span>' + t('files_sharing', 'Shared') + '</span>'; // even if reshared, only show "Shared by"

        if (ownerId) {
          message = t('files_sharing', 'Shared by');
          avatars = this._formatRemoteShare(ownerId, owner, message);
        } else if (recipients) {
          avatars = this._formatShareList(recipients);
        }

        action.html(avatars).prepend(icon);

        if (ownerId || recipients) {
          var avatarElement = action.find('.avatar');
          avatarElement.each(function () {
            $(this).avatar($(this).data('username'), 32);
          });
          action.find('span[title]').tooltip({
            placement: 'top'
          });
        }
      } else {
        action.html('<span class="hidden-visually">' + t('files_sharing', 'Shared') + '</span>').prepend(icon);
      }

      if (hasLink) {
        iconClass = 'icon-public';
      }

      icon.removeClass('icon-shared icon-public').addClass(iconClass);
    },

    /**
     * @param {Array} fileData
     * @returns {String}
     */
    getSharePermissions: function getSharePermissions(fileData) {
      return fileData.sharePermissions;
    }
  };
})();

OC.Plugins.register('OCA.Files.FileList', OCA.Sharing.Util);

/***/ }),

/***/ "./apps/files_sharing/src/sharebreadcrumbview.js":
/*!*******************************************************!*\
  !*** ./apps/files_sharing/src/sharebreadcrumbview.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @copyright 2016 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
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
(function () {
  'use strict';

  var BreadCrumbView = OC.Backbone.View.extend({
    tagName: 'span',
    events: {
      click: '_onClick'
    },
    _dirInfo: undefined,
    render: function render(data) {
      this._dirInfo = data.dirInfo || null;

      if (this._dirInfo !== null && (this._dirInfo.path !== '/' || this._dirInfo.name !== '')) {
        var isShared = data.dirInfo && data.dirInfo.shareTypes && data.dirInfo.shareTypes.length > 0;
        this.$el.removeClass('shared icon-public icon-shared');

        if (isShared) {
          this.$el.addClass('shared');

          if (data.dirInfo.shareTypes.indexOf(OC.Share.SHARE_TYPE_LINK) !== -1) {
            this.$el.addClass('icon-public');
          } else {
            this.$el.addClass('icon-shared');
          }
        } else {
          this.$el.addClass('icon-shared');
        }

        this.$el.show();
        this.delegateEvents();
      } else {
        this.$el.removeClass('shared icon-public icon-shared');
        this.$el.hide();
      }

      return this;
    },
    _onClick: function _onClick(e) {
      e.preventDefault();
      e.stopPropagation();
      var fileInfoModel = new OCA.Files.FileInfoModel(this._dirInfo);
      var self = this;
      fileInfoModel.on('change', function () {
        self.render({
          dirInfo: self._dirInfo
        });
      });
      var path = fileInfoModel.attributes.path + '/' + fileInfoModel.attributes.name;
      OCA.Files.Sidebar.open(path);
      OCA.Files.Sidebar.setActiveTab('sharing');
    }
  });
  OCA.Sharing.ShareBreadCrumbView = BreadCrumbView;
})();

/***/ }),

/***/ "./apps/files_sharing/src/style/sharebreadcrumb.scss":
/*!***********************************************************!*\
  !*** ./apps/files_sharing/src/style/sharebreadcrumb.scss ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharebreadcrumb_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./sharebreadcrumb.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_sharing/src/style/sharebreadcrumb.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharebreadcrumb_scss__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_sharebreadcrumb_scss__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_sharing/src/style/sharebreadcrumb.scss":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./apps/files_sharing/src/style/sharebreadcrumb.scss ***!
  \****************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "/**\n * @copyright 2016 Christoph Wurst <christoph@winzerhof-wurst.at>\n *\n * @author 2016 Christoph Wurst <christoph@winzerhof-wurst.at>\n *\n * @license GNU AGPL version 3 or any later version\n *\n * This program is free software: you can redistribute it and/or modify\n * it under the terms of the GNU Affero General Public License as\n * published by the Free Software Foundation, either version 3 of the\n * License, or (at your option) any later version.\n *\n * This program is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n * GNU Affero General Public License for more details.\n *\n * You should have received a copy of the GNU Affero General Public License\n * along with this program.  If not, see <http://www.gnu.org/licenses/>.\n *\n */\ndiv.crumb span.icon-shared,\ndiv.crumb span.icon-public {\n  display: inline-block;\n  cursor: pointer;\n  opacity: 0.2;\n  margin-right: 6px;\n}\n\ndiv.crumb span.icon-shared.shared,\ndiv.crumb span.icon-public.shared {\n  opacity: 0.7;\n}", ""]);
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

/***/ "./node_modules/escape-html/index.js":
/*!*******************************************!*\
  !*** ./node_modules/escape-html/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */



/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}


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
//# sourceMappingURL=additionalScripts.js.map