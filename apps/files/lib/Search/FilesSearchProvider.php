<?php

declare(strict_types=1);

/**
 * @copyright 2020 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 * @author Robin Appelman <robin@icewind.nl>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\Files\Search;

use OC\Files\Search\SearchComparison;
use OC\Files\Search\SearchOrder;
use OC\Files\Search\SearchQuery;
use OC\Files\Search\SearchBinaryOperator;
use OCP\Files\FileInfo;
use OCP\Files\IMimeTypeDetector;
use OCP\Files\IRootFolder;
use OCP\Files\Search\ISearchComparison;
use OCP\Files\Node;
use OCP\Files\Search\ISearchOrder;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\Search\IProvider;
use OCP\Search\ISearchQuery;
use OCP\Search\SearchResult;
use OCP\Search\SearchResultEntry;

class FilesSearchProvider implements IProvider {

	/** @var IL10N */
	private $l10n;

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var IMimeTypeDetector */
	private $mimeTypeDetector;

	/** @var IRootFolder */
	private $rootFolder;

	public function __construct(
		IL10N $l10n,
		IURLGenerator $urlGenerator,
		IMimeTypeDetector $mimeTypeDetector,
		IRootFolder $rootFolder
	) {
		$this->l10n = $l10n;
		$this->urlGenerator = $urlGenerator;
		$this->mimeTypeDetector = $mimeTypeDetector;
		$this->rootFolder = $rootFolder;
	}

	/**
	 * @inheritDoc
	 */
	public function getId(): string {
		return 'files';
	}

	/**
	 * @inheritDoc
	 */
	public function getName(): string {
		return $this->l10n->t('Files');
	}

	/**
	 * @inheritDoc
	 */
	public function getOrder(string $route, array $routeParameters): int {
		if ($route === 'files.View.index') {
			// Before comments
			return -5;
		}
		return 5;
	}

	/**
	 * @inheritDoc
	 */
	public function search(IUser $user, ISearchQuery $query): SearchResult {
		//Handling of file filters
		//Definition of data structure with size units.
		$UNITS = array(
			"B" => 1,
			"KB" => 1000,
			"MB" => 1000000,
			"GB" => 1000000000,
			"TB" => 1000000000000,
		);

		//Requests are always structured to be in a format ${FILE_NAME}__${FILTER_CRITERIA1}::${FILTER_VALUE1}::${FILTER_VALUE1}__${FILTER_CRITERIA1}::${FILTER_VALUE3}
		//File name variable is fixed and doesn't carry a label due to compatibility.
		//All other criteria are dynamic and each criteria has n values.

		//$stringQueryList carries all criteria queries.
		$stringQueryList = explode("__", $query->getTerm());

		//$queryArray carries SQL sub-queries for different criteria in SearchComparison form.
		$queryArray = [];

		//Query created for File name criteria.
		array_push($queryArray, new SearchComparison(ISearchComparison::COMPARE_LIKE, 'name', '%' . array_shift($stringQueryList) . '%'));

		///Limit search to opened folder. If the user isn't located in Files app, search all.
		if(array_key_exists("fileid", $query->getRouteParameters()) && array_key_exists("dir", $query->getRouteParameters())){
			$queryCompare = new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_OR, [
				new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'parent', (int)$query->getRouteParameters()["fileid"]),
				new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_AND, [
					new SearchComparison(ISearchComparison::COMPARE_LIKE, 'owner', '%%'),
					new SearchComparison(ISearchComparison::COMPARE_LIKE, 'file_target', (string)$query->getRouteParameters()["dir"] . '%'),
					new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_NOT, [
						new SearchComparison(ISearchComparison::COMPARE_LIKE, 'file_target', (string)$query->getRouteParameters()["dir"] . '%/%'),
					])
				])
			]);
			array_push($queryArray, $queryCompare);
		}

		//Filters out empty values
		$filteredStringQuery = array_filter($stringQueryList, function(string $stringQuery){
			return strlen($stringQuery);
		});

		//Creates an SQL sub-query for every criteria.
		foreach($filteredStringQuery as $stringQueryFiltered){

			//$exploded has always the crieteria name on index 0 and its values on indexes larger or equal to 1.
			$exploded = explode("::", $stringQueryFiltered);
			if(count($exploded) >= 2){
				switch($exploded[0]){
					//TUTORIAL
					//Here add a case to switch defining how to handle the criteria.
					case "mimetype":
						switch($exploded[1]){
							case "text":
								//Text mimetype is extended to PDFs, MS Word (.doc, .docx) and Open Office documents.
								$provisionalQueryArray = [
									new SearchComparison(ISearchComparison::COMPARE_LIKE, 'mimetype', 'text/%'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/pdf'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/msword'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/vnd.oasis.opendocument.text'),
								];
								$provisionalQuery = new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_OR, $provisionalQueryArray);
								break;
							case "disk_image":
								//Should work for .iso, .vdi, .bin, .deb, .rpm, .adi., .dim and .ova
								$provisionalQueryArray = [
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/x-disk-image'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/x-bin'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/x-deb'),
								];
								$provisionalQuery = new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_OR, $provisionalQueryArray);
								break;
							case "archive":
								//Should work for .gz, .zip, .7z, .rar, .tar
								$provisionalQueryArray = [
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/gzip'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/zip'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/x-7z-compressed'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/vnd.rar'),
									new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'mimetype', 'application/x-tar'),
								];
								$provisionalQuery = new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_OR, $provisionalQueryArray);
								break;
							default:	
								//Every other supported mimetype doesn't have a special definition.
								$provisionalQuery = new SearchComparison(ISearchComparison::COMPARE_LIKE, 'mimetype', $exploded[1] . '/%');
						}
						array_push($queryArray, $provisionalQuery);
						break;
					case "owner":
						array_push($queryArray, new SearchComparison(ISearchComparison::COMPARE_LIKE, 'owner', '%' . $exploded[1] . '%'));
						break;
					case "lte":
						//Query for search for files of smaller size than provided.
						if(count($exploded) >= 3){
							array_push($queryArray, new SearchComparison(ISearchComparison::COMPARE_LESS_THAN_EQUAL, 'size', (int)$exploded[1] * $UNITS[$exploded[2]]));
						}
						break;
					case "gte":
						//Query for search for files of larger size than provided.
						if(count($exploded) >= 3){
							array_push($queryArray, new SearchComparison(ISearchComparison::COMPARE_GREATER_THAN_EQUAL, 'size', (int)$exploded[1] * $UNITS[$exploded[2]]));
						}
						break;
					case "date_from":
						//Query that selects all files last edited after the date.
						if(count($exploded) >= 4){
							array_push($queryArray, new SearchComparison(ISearchComparison::COMPARE_GREATER_THAN_EQUAL, 'mtime', strtotime($exploded[2] . " " . $exploded[1] . " " . $exploded[3])));
						}
						break;
					case "date_to":
						//Query that selects all files last edited before the date included (86400).
						if(count($exploded) >= 4){
							array_push($queryArray, new SearchComparison(ISearchComparison::COMPARE_LESS_THAN, 'mtime', 86400 + strtotime($exploded[2] . " " . $exploded[1] . " " . $exploded[3])));
						}
						break;
					case "last_updater":
						//Last updater = user ID of the person who made the last edit in a file.
						array_push($queryArray, new SearchComparison(ISearchComparison::COMPARE_LIKE, 'last_updater', '%' . $exploded[1] . '%'));
						break;
				}
			}
		}
		$userFolder = $this->rootFolder->getUserFolder($user->getUID());
		$fileQuery = new SearchQuery(
			//Create a long query from the SQL sub-queries created earlier joined with AND operator.
			new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_AND, $queryArray),
			
			//Define maximum number of provided results. Used for pagination.
			//Pagination is effectively deactivated (set to 999) for Files app. Other apps have globally defined limit.
			array_key_exists("fileid", $query->getRouteParameters()) ? 999 : $query->getLimit(),
			(int)$query->getCursor(),
			$query->getSortOrder() === ISearchQuery::SORT_DATE_DESC ? [
				new SearchOrder(ISearchOrder::DIRECTION_DESCENDING, 'mtime'),
			] : [],
			$user
		);

		return SearchResult::paginated(
			$this->l10n->t('Files'),
			array_map(function (Node $result) use ($userFolder) {
				// Generate thumbnail url
				$thumbnailUrl = $this->urlGenerator->linkToRouteAbsolute('core.Preview.getPreviewByFileId', ['x' => 32, 'y' => 32, 'fileId' => $result->getId()]);
				$path = $userFolder->getRelativePath($result->getPath());

				// Use shortened link to centralize the various
				// files/folder url redirection in files.View.showFile
				$link = $this->urlGenerator->linkToRoute(
					'files.View.showFile',
					['fileid' => $result->getId()]
				);

				$searchResultEntry = new SearchResultEntry(
					$thumbnailUrl,
					$result->getName(),
					$this->formatSubline($path),
					$this->urlGenerator->getAbsoluteURL($link),
					$result->getMimetype() === FileInfo::MIMETYPE_FOLDER ? 'icon-folder' : $this->mimeTypeDetector->mimeTypeIcon($result->getMimetype())
				);
				$searchResultEntry->addAttribute('fileId', (string)$result->getId());
				$searchResultEntry->addAttribute('path', $path);
				return $searchResultEntry;
			}, $userFolder->search($fileQuery)),
			$query->getCursor() + $query->getLimit()
		);
	}

	/**
	 * Format subline for files
	 *
	 * @param string $path
	 * @return string
	 */
	private function formatSubline(string $path): string {
		// Do not show the location if the file is in root
		if (strrpos($path, '/') > 0) {
			$path = ltrim(dirname($path), '/');
			return $this->l10n->t('in %s', [$path]);
		} else {
			return '';
		}
	}
}
