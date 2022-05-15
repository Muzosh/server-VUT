/*
 * @copyright Copyright (c) 2021 Julius Härtl <jus@bitgrid.net>
 *
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { subscribe } from '@nextcloud/event-bus'

(function() {

	const FilesPlugin = {
		attach(fileList) {
			//Listens to the emittor in UnitedSearch.vue.
			//Gets a JSON object of filter results.
			subscribe('nextcloud:unified-search.searchFiles', ({ query }) => {
				//Initializes an array of search results
				//JSON -> Array
				var resultArray = [];
				if(query.length > 0){
				  for(const data of query[0].list){
					//Pushes a name of a file in the JSON object of filter results.
					resultArray.push(data.title);
				  }
				  fileList.setFilter(resultArray);
				}else fileList.setFilter([]); //Sends emty array if no matching results of filtering
			})
			//Sends an array with emty string if user wishes to clear the filter form.
			subscribe('nextcloud:unified-search.reset', () => {
				this.query = null
				fileList.setFilter(['']);
			})

		},
	}

	window.OC.Plugins.register('OCA.Files.FileList', FilesPlugin)

})()
