<div id="app-navigation">
	<ul class="with-icon">

		<?php

		$pinned = 0;
		foreach ($_['navigationItems'] as $item) {
			$pinned = NavigationListElements($item, $l, $pinned);
		}

		?>

		<?php if ($_['quota'] === \OCP\Files\FileInfo::SPACE_UNLIMITED): ?>
			<li id="quota" class="pinned <?php p($pinned === 0 ? 'first-pinned ' : '') ?>">
				<a href="#" class="icon-quota svg">
					<p><?php p($l->t('%s used', [$_['usage']])); ?></p>
				</a>
			</li>
		<?php else: ?>
			<li id="quota" class="has-tooltip pinned <?php p($pinned === 0 ? 'first-pinned ' : '') ?>"
				title="<?php p($l->t('%s%% of %s used', [$_['usage_relative'], $_['total_space']])); ?>">
				<a href="#" class="icon-quota svg">
					<p id="quotatext"><?php p($l->t('%1$s of %2$s used', [$_['usage'], $_['total_space']])); ?></p>
					<div class="quota-container">
						<progress value="<?php p($_['usage_relative']); ?>" max="100" class="<?= ($_['usage_relative'] > 80) ? 'warn' : '' ?>"></progress>
					</div>
				</a>
			</li>
		<?php endif; ?>
				<li>
					<a href="#"><h2>Fiter Options</h2></a>
				</li>
				<li><a href="#"> 
					<b><label for="fileType">By file type:</label></b>
					<select id="fileType" name="fileType">
						<option value="none">None</option>
						<option value="image">Image</option>
						<option value="text">Text</option>
						<option value="diskImage">Disk Image</option>
					</select> 
				</a></li>
				<li>
					<a href="#">
						<b>By last editation date:</b>
						<form id="lastEdit" name="lastEdit">
							<label for="editFrom">From:</label>
							<input type="text" id="editFrom" placeholder="YYYY-MM-DD"><br>
							<label for="editTo">To:</label>&nbsp;
							<input type="text" id="editTo" placeholder="YYYY-MM-DD">
						</form>
					</a>
				</li>
				<li>
					<a href="#">
						<b>By file size:</b>
						<form id="fileSize" name="fileSize">
							<label for="sizeFrom">From:</label>
							<input type="text" id="sizeFrom" placeholder="100MB"><br>
							<label for="sizeTo">To:</label>
							<input type="text" id="sizeTo" placeholder="100MB">
						</form>
					</a>
				</li>
				<li>
				<a href="#"><button>Filter</button></a>
				</li>
	</ul>
	<div id="app-settings">
		<div id="app-settings-header">
			<button class="settings-button"
					data-apps-slide-toggle="#app-settings-content">
				<?php p($l->t('Settings')); ?>
			</button>
		</div>
		<div id="app-settings-content">
			<div id="files-app-settings"></div>
			<div id="files-setting-showhidden">
				<input class="checkbox" id="showhiddenfilesToggle"
					   checked="checked" type="checkbox">
				<label for="showhiddenfilesToggle"><?php p($l->t('Show hidden files')); ?></label>
			</div>
			<div id="files-setting-cropimagepreviews">
				<input class="checkbox" id="cropimagepreviewsToggle"
					   checked="checked" type="checkbox">
				<label for="cropimagepreviewsToggle"><?php p($l->t('Crop image previews')); ?></label>
			</div>
			<label for="webdavurl"><?php p($l->t('WebDAV')); ?></label>
			<input id="webdavurl" type="text" readonly="readonly"
				   value="<?php p($_['webdav_url']); ?>"/>
			<em><a href="<?php echo link_to_docs('user-webdav') ?>" target="_blank" rel="noreferrer noopener"><?php p($l->t('Use this address to access your Files via WebDAV')) ?> ↗</a></em>
		</div>
	</div>

</div>


<?php

/**
 * Prints the HTML for a single Entry.
 *
 * @param $item The item to be added
 * @param $l Translator
 * @param $pinned IntegerValue to count the pinned entries at the bottom
 *
 * @return int Returns the pinned value
 */
function NavigationListElements($item, $l, $pinned) {
	strpos($item['classes'] ?? '', 'pinned') !== false ? $pinned++ : ''; ?>
	<li
		data-id="<?php p($item['id']) ?>"
		<?php if (isset($item['dir'])) { ?> data-dir="<?php p($item['dir']); ?>" <?php } ?>
		<?php if (isset($item['view'])) { ?> data-view="<?php p($item['view']); ?>" <?php } ?>
		<?php if (isset($item['expandedState'])) { ?> data-expandedstate="<?php p($item['expandedState']); ?>" <?php } ?>
		class="nav-<?php p($item['id']) ?>
		<?php if (isset($item['classes'])) {
		p($item['classes']);
	} ?>
		<?php p($pinned === 1 ? 'first-pinned' : '') ?>
		<?php if (isset($item['defaultExpandedState']) && $item['defaultExpandedState']) { ?> open<?php } ?>"
		<?php if (isset($item['folderPosition'])) { ?> folderposition="<?php p($item['folderPosition']); ?>" <?php } ?>>

		<a href="<?php p(isset($item['href']) ? $item['href'] : '#') ?>"
		   class="nav-icon-<?php p(isset($item['icon']) && $item['icon'] !== '' ? $item['icon'] : $item['id']) ?> svg"><?php p($item['name']); ?></a>


		<?php
		NavigationElementMenu($item);
	if (isset($item['sublist'])) {
		?>
			<button class="collapse app-navigation-noclose"
				aria-label="<?php p($l->t('Toggle %1$s sublist', $item['name'])) ?>"
				<?php if (sizeof($item['sublist']) == 0) { ?> style="display: none" <?php } ?>>
			</button>
			<ul id="sublist-<?php p($item['id']); ?>">
				<?php
				foreach ($item['sublist'] as $item) {
					$pinned = NavigationListElements($item, $l, $pinned);
				} ?>
			</ul>
		<?php
	} ?>
	</li>


	<?php
	return $pinned;
}

/**
 * Prints the HTML for a dotmenu.
 *
 * @param $item The item to be added
 *
 * @return void
 */
function NavigationElementMenu($item) {
	if (isset($item['menubuttons']) && $item['menubuttons'] === 'true') {
		?>
		<div id="dotmenu-<?php p($item['id']); ?>"
			 class="app-navigation-entry-utils" <?php if (isset($item['enableMenuButton']) && $item['enableMenuButton'] === 0) { ?> style="display: none"<?php } ?>>
			<ul>
				<li class="app-navigation-entry-utils-menu-button svg">
					<button id="dotmenu-button-<?php p($item['id']) ?>"></button>
				</li>
			</ul>
		</div>
		<div id="dotmenu-content-<?php p($item['id']) ?>"
			 class="app-navigation-entry-menu">
			<ul>

			</ul>
		</div>
	<?php
	}
}
