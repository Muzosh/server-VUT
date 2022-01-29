<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author Daniel Kesselberg <mail@danielkesselberg.de>
 * @author Joas Schilling <coding@schilljs.com>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
 * @author Vincent Petry <vincent@nextcloud.com>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 *
 */
namespace OCA\DAV\Tests\unit\Connector\Sabre;

use InvalidArgumentException;
use OC;
use OC\AppFramework\Http\Request;
use OC\Files\FileInfo;
use OC\Files\Filesystem;
use OC\Files\Storage\Local;
use OC\Files\Storage\Storage;
use OC\Files\Storage\Temporary;
use OC\Files\Storage\Wrapper\PermissionsMask;
use OC\Files\View;
use OC\Security\SecureRandom;
use OCA\DAV\Connector\Sabre\Exception\EntityTooLarge;
use OCA\DAV\Connector\Sabre\Exception\FileLocked;
use OCA\DAV\Connector\Sabre\Exception\Forbidden;
use OCA\DAV\Connector\Sabre\Exception\InvalidPath;
use OCA\DAV\Connector\Sabre\Exception\UnsupportedMediaType;
use OCA\DAV\Connector\Sabre\File;
use OCP\Constants;
use OCP\Encryption\Exceptions\GenericEncryptionException;
use OCP\Files\EntityTooLargeException;
use OCP\Files\ForbiddenException;
use OCP\Files\InvalidContentException;
use OCP\Files\InvalidPathException;
use OCP\Files\LockNotAcquiredException;
use OCP\Files\NotPermittedException;
use OCP\Files\Storage\IStorage;
use OCP\Files\StorageNotAvailableException;
use OCP\IConfig;
use OCP\ITempManager;
use OCP\IUserManager;
use OCP\Lock\ILockingProvider;
use OCP\Lock\LockedException;
use OCP\Security\ISecureRandom;
use OCP\Util;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Sabre\DAV\Exception;
use Sabre\DAV\Exception\BadRequest;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\Exception\ServiceUnavailable;
use stdclass;
use Test\HookHelper;
use Test\TestCase;
use Test\Traits\MountProviderTrait;
use Test\Traits\UserTrait;

/**
 * Class File
 *
 * @group DB
 *
 * @package OCA\DAV\Tests\unit\Connector\Sabre
 */
class FileTest extends TestCase {
	use MountProviderTrait;
	use UserTrait;

	/**
	 * @var array
	 */
	private static $hookCalls = [];

	/**
	 * @var string
	 */
	private $user;

	/** @var IConfig | MockObject */
	protected $config;

	/** @var ISecureRandom */
	protected $secureRandom;

	protected function setUp(): void {
		parent::setUp();
		unset($_SERVER['HTTP_OC_CHUNKED']);
		unset($_SERVER['CONTENT_LENGTH']);
		unset($_SERVER['REQUEST_METHOD']);

		\OC_Hook::clear();

		$this->user = 'test_user';
		$this->createUser($this->user, 'pass');

		$this->loginAsUser($this->user);

		$this->config = $this->createMock(IConfig::class);
		$this->secureRandom = new SecureRandom();
	}

	/**
	 * @throws ContainerExceptionInterface
	 * @throws NotFoundExceptionInterface
	 */
	protected function tearDown(): void {
		$userManager = OC::$server->get(IUserManager::class);
		$userManager->get($this->user)->delete();
		unset($_SERVER['HTTP_OC_CHUNKED']);

		parent::tearDown();
	}

	/**
	 * @return Storage|IStorage|MockObject
	 */
	private function getMockStorage() {
		$storage = $this->createMock(IStorage::class);
		$storage->method('getId')
			->willReturn('home::someuser');
		return $storage;
	}

	/**
	 * @param string $string
	 * @return resource|false
	 */
	private function getStream(string $string) {
		$stream = fopen('php://temp', 'r+');
		fwrite($stream, $string);
		fseek($stream, 0);
		return $stream;
	}


	public function fopenFailuresProvider(): array {
		return [
			[
				// return false
				null,
				Exception::class,
				false
			],
			[
				new NotPermittedException(),
				Exception\Forbidden::class
			],
			[
				new EntityTooLargeException(),
				EntityTooLarge::class
			],
			[
				new InvalidContentException(),
				UnsupportedMediaType::class
			],
			[
				new InvalidPathException(),
				Exception\Forbidden::class
			],
			[
				new ForbiddenException('', true),
				Forbidden::class
			],
			[
				new LockNotAcquiredException('/test.txt', 1),
				FileLocked::class
			],
			[
				new LockedException('/test.txt'),
				FileLocked::class
			],
			[
				new GenericEncryptionException(),
				ServiceUnavailable::class
			],
			[
				new StorageNotAvailableException(),
				ServiceUnavailable::class
			],
			[
				new Exception('Generic sabre exception'),
				Exception::class,
				false
			],
			[
				new \Exception('Generic exception'),
				Exception::class
			],
		];
	}

	/**
	 * @dataProvider fopenFailuresProvider
	 * @param \Exception|null $thrownException
	 * @param string $expectedException
	 * @param bool $checkPreviousClass
	 * @throws ContainerExceptionInterface
	 * @throws ForbiddenException
	 * @throws NotFoundExceptionInterface
	 */
	public function testSimplePutFails(?\Exception $thrownException, string $expectedException, bool $checkPreviousClass = true) {
		// setup
		$storage = $this->getMockBuilder(Local::class)
			->onlyMethods(['writeStream'])
			->setConstructorArgs([['datadir' => OC::$server->get(ITempManager::class)->getTemporaryFolder()]])
			->getMock();
		Filesystem::mount($storage, [], $this->user . '/');
		/** @var View | MockObject $view */
		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['getRelativePath', 'resolvePath'])
			->getMock();
		$view->expects($this->atLeastOnce())
			->method('resolvePath')
			->willReturnCallback(
				function ($path) use ($storage) {
					return [$storage, $path];
				}
			);

		if ($thrownException !== null) {
			$storage->expects($this->once())
				->method('writeStream')
				->will($this->throwException($thrownException));
		} else {
			$storage->expects($this->once())
				->method('writeStream')
				->willReturn(0);
		}

		$view->expects($this->any())
			->method('getRelativePath')
			->willReturnArgument(0);

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		// action
		$caughtException = null;
		try {
			$file->put('test data');
		} catch (\Exception $e) {
			$caughtException = $e;
		}

		$this->assertInstanceOf($expectedException, $caughtException);
		if ($checkPreviousClass) {
			$this->assertInstanceOf(get_class($thrownException), $caughtException->getPrevious());
		}

		$this->assertEmpty($this->listPartFiles($view), 'No stray part files');
	}

	/**
	 * Test putting a file using chunking
	 *
	 * @dataProvider fopenFailuresProvider
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws LockedException
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws ContainerExceptionInterface
	 * @throws NotFoundExceptionInterface|ForbiddenException
	 */
	public function testChunkedPutFails(?\Exception $thrownException, string $expectedException, bool $checkPreviousClass = false) {
		// setup
		$storage = $this->getMockBuilder(Local::class)
			->onlyMethods(['fopen'])
			->setConstructorArgs([['datadir' => OC::$server->get(ITempManager::class)->getTemporaryFolder()]])
			->getMock();
		Filesystem::mount($storage, [], $this->user . '/');
		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['getRelativePath', 'resolvePath'])
			->getMock();
		$view->expects($this->atLeastOnce())
			->method('resolvePath')
			->willReturnCallback(
				function ($path) use ($storage) {
					return [$storage, $path];
				}
			);

		if ($thrownException !== null) {
			$storage->expects($this->once())
				->method('fopen')
				->will($this->throwException($thrownException));
		} else {
			$storage->expects($this->once())
				->method('fopen')
				->willReturn(false);
		}

		$view->expects($this->any())
			->method('getRelativePath')
			->willReturnArgument(0);

		$_SERVER['HTTP_OC_CHUNKED'] = true;

		$info = new FileInfo('/test.txt-chunking-12345-2-0', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);
		$file = new File($view, $info);

		// put first chunk
		$file->acquireLock(ILockingProvider::LOCK_SHARED);
		$this->assertNull($file->put('test data one'));
		$file->releaseLock(ILockingProvider::LOCK_SHARED);

		$info = new FileInfo('/test.txt-chunking-12345-2-1', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);
		$file = new File($view, $info);

		// action
		$caughtException = null;
		try {
			// last chunk
			$file->acquireLock(ILockingProvider::LOCK_SHARED);
			$file->put('test data two');
			$file->releaseLock(ILockingProvider::LOCK_SHARED);
		} catch (\Exception $e) {
			$caughtException = $e;
		}

		$this->assertInstanceOf($expectedException, $caughtException);
		if ($checkPreviousClass) {
			$this->assertInstanceOf(get_class($thrownException), $caughtException->getPrevious());
		}

		$this->assertEmpty($this->listPartFiles($view), 'No stray part files');
	}

	/**
	 * Simulate putting a file to the given path.
	 *
	 * @param string $path path to put the file into
	 * @param string|null $viewRoot root to use for the view
	 * @param null|Request $request the HTTP request
	 *
	 * @return null|string of the PUT operation which is usually the etag
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 * @throws \Exception
	 */
	private function doPut(string $path, string $viewRoot = null, Request $request = null): ?string {
		$view = Filesystem::getView();
		if (!is_null($viewRoot)) {
			$view = new View($viewRoot);
		} else {
			$viewRoot = '/' . $this->user . '/files';
		}

		$info = new FileInfo(
			$viewRoot . '/' . ltrim($path, '/'),
			$this->getMockStorage(),
			null,
			['permissions' => Constants::PERMISSION_ALL],
			null
		);

		/** @var File | MockObject $file */
		$file = $this->getMockBuilder(File::class)
			->setConstructorArgs([$view, $info, null, $request])
			->onlyMethods(['header'])
			->getMock();

		// beforeMethod locks
		$view->lockFile($path, ILockingProvider::LOCK_SHARED);

		$result = $file->put($this->getStream('test data'));

		// afterMethod unlocks
		$view->unlockFile($path, ILockingProvider::LOCK_SHARED);

		return $result;
	}

	/**
	 * Test putting a single file
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 * @throws ServiceUnavailable
	 */
	public function testPutSingleFile() {
		$this->assertNotEmpty($this->doPut('/foo.txt'));
	}

	public function legalMtimeProvider(): array {
		return [
			"string" => [
				'HTTP_X_OC_MTIME' => "string",
				'expected result' => null
			],
			"castable string (int)" => [
				'HTTP_X_OC_MTIME' => "987654321",
				'expected result' => 987654321
			],
			"castable string (float)" => [
				'HTTP_X_OC_MTIME' => "123456789.56",
				'expected result' => 123456789
			],
			"float" => [
				'HTTP_X_OC_MTIME' => 123456789.56,
				'expected result' => 123456789
			],
			"zero" => [
				'HTTP_X_OC_MTIME' => 0,
				'expected result' => null
			],
			"zero string" => [
				'HTTP_X_OC_MTIME' => "0",
				'expected result' => null
			],
			"negative zero string" => [
				'HTTP_X_OC_MTIME' => "-0",
				'expected result' => null
			],
			"string starting with number following by char" => [
				'HTTP_X_OC_MTIME' => "2345asdf",
				'expected result' => null
			],
			"string castable hex int" => [
				'HTTP_X_OC_MTIME' => "0x45adf",
				'expected result' => null
			],
			"string that looks like invalid hex int" => [
				'HTTP_X_OC_MTIME' => "0x123g",
				'expected result' => null
			],
			"negative int" => [
				'HTTP_X_OC_MTIME' => -34,
				'expected result' => null
			],
			"negative float" => [
				'HTTP_X_OC_MTIME' => -34.43,
				'expected result' => null
			],
		];
	}

	/**
	 * Test putting a file with string Mtime
	 *
	 * @dataProvider legalMtimeProvider
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws InvalidPathException
	 * @throws LockedException
	 * @throws ServiceUnavailable
	 */
	public function testPutSingleFileLegalMtime($requestMtime, ?int $resultMtime) {
		$request = new Request([
			'server' => [
				'HTTP_X_OC_MTIME' => $requestMtime,
			]
		], $this->secureRandom, $this->config, null);
		$file = 'foo.txt';

		if ($resultMtime === null) {
			$this->expectException(InvalidArgumentException::class);
		}

		$this->doPut($file, null, $request);

		if ($resultMtime !== null) {
			$this->assertEquals($resultMtime, $this->getFileInfos($file)['mtime']);
		}
	}

	/**
	 * Test putting a file with string Mtime using chunking
	 *
	 * @dataProvider legalMtimeProvider
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException|InvalidPathException
	 */
	public function testChunkedPutLegalMtime($requestMtime, ?int $resultMtime) {
		$request = new Request([
			'server' => [
				'HTTP_X_OC_MTIME' => $requestMtime,
			]
		], $this->secureRandom, $this->config, null);

		$_SERVER['HTTP_OC_CHUNKED'] = true;
		$file = 'foo.txt';

		if ($resultMtime === null) {
			$this->expectException(Exception::class);
		}

		$this->doPut($file.'-chunking-12345-2-0', null, $request);
		$this->doPut($file.'-chunking-12345-2-1', null, $request);

		if ($resultMtime !== null) {
			$this->assertEquals($resultMtime, $this->getFileInfos($file)['mtime']);
		}
	}

	/**
	 * Test putting a file using chunking
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 */
	public function testChunkedPut() {
		$_SERVER['HTTP_OC_CHUNKED'] = true;
		$this->assertNull($this->doPut('/test.txt-chunking-12345-2-0'));
		$this->assertNotEmpty($this->doPut('/test.txt-chunking-12345-2-1'));
	}

	/**
	 * Test that putting a file triggers create hooks
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 */
	public function testPutSingleFileTriggersHooks() {
		HookHelper::setUpHooks();

		$this->assertNotEmpty($this->doPut('/foo.txt'));

		$this->assertCount(4, HookHelper::$hookCalls);
		$this->assertHookCall(
			HookHelper::$hookCalls[0],
			Filesystem::signal_create,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[1],
			Filesystem::signal_write,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[2],
			Filesystem::signal_post_create,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[3],
			Filesystem::signal_post_write,
			'/foo.txt'
		);
	}

	/**
	 * Test that putting a file triggers update hooks
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 */
	public function testPutOverwriteFileTriggersHooks() {
		$view = Filesystem::getView();
		$view->file_put_contents('/foo.txt', 'some content that will be replaced');

		HookHelper::setUpHooks();

		$this->assertNotEmpty($this->doPut('/foo.txt'));

		$this->assertCount(4, HookHelper::$hookCalls);
		$this->assertHookCall(
			HookHelper::$hookCalls[0],
			Filesystem::signal_update,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[1],
			Filesystem::signal_write,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[2],
			Filesystem::signal_post_update,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[3],
			Filesystem::signal_post_write,
			'/foo.txt'
		);
	}

	/**
	 * Test that putting a file triggers hooks with the correct path
	 * if the passed view was chrooted (can happen with public webdav
	 * where the root is the share root)
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 * @throws ServiceUnavailable
	 */
	public function testPutSingleFileTriggersHooksDifferentRoot() {
		$view = Filesystem::getView();
		$view->mkdir('noderoot');

		HookHelper::setUpHooks();

		// happens with public webdav where the view root is the share root
		$this->assertNotEmpty($this->doPut('/foo.txt', '/' . $this->user . '/files/noderoot'));

		$this->assertCount(4, HookHelper::$hookCalls);
		$this->assertHookCall(
			HookHelper::$hookCalls[0],
			Filesystem::signal_create,
			'/noderoot/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[1],
			Filesystem::signal_write,
			'/noderoot/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[2],
			Filesystem::signal_post_create,
			'/noderoot/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[3],
			Filesystem::signal_post_write,
			'/noderoot/foo.txt'
		);
	}

	/**
	 * Test that putting a file with chunks triggers create hooks
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 */
	public function testPutChunkedFileTriggersHooks() {
		HookHelper::setUpHooks();

		$_SERVER['HTTP_OC_CHUNKED'] = true;
		$this->assertNull($this->doPut('/foo.txt-chunking-12345-2-0'));
		$this->assertNotEmpty($this->doPut('/foo.txt-chunking-12345-2-1'));

		$this->assertCount(4, HookHelper::$hookCalls);
		$this->assertHookCall(
			HookHelper::$hookCalls[0],
			Filesystem::signal_create,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[1],
			Filesystem::signal_write,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[2],
			Filesystem::signal_post_create,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[3],
			Filesystem::signal_post_write,
			'/foo.txt'
		);
	}

	/**
	 * Test that putting a chunked file triggers update hooks
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 */
	public function testPutOverwriteChunkedFileTriggersHooks() {
		$view = Filesystem::getView();
		$view->file_put_contents('/foo.txt', 'some content that will be replaced');

		HookHelper::setUpHooks();

		$_SERVER['HTTP_OC_CHUNKED'] = true;
		$this->assertNull($this->doPut('/foo.txt-chunking-12345-2-0'));
		$this->assertNotEmpty($this->doPut('/foo.txt-chunking-12345-2-1'));

		$this->assertCount(4, HookHelper::$hookCalls);
		$this->assertHookCall(
			HookHelper::$hookCalls[0],
			Filesystem::signal_update,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[1],
			Filesystem::signal_write,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[2],
			Filesystem::signal_post_update,
			'/foo.txt'
		);
		$this->assertHookCall(
			HookHelper::$hookCalls[3],
			Filesystem::signal_post_write,
			'/foo.txt'
		);
	}

	public static function cancellingHook($params) {
		self::$hookCalls[] = [
			'signal' => Filesystem::signal_post_create,
			'params' => $params
		];
	}

	/**
	 * Test put file with cancelled hook
	 *
	 * @throws LockedException|ForbiddenException
	 */
	public function testPutSingleFileCancelPreHook() {
		Util::connectHook(
			Filesystem::CLASSNAME,
			Filesystem::signal_create,
			'\Test\HookHelper',
			'cancellingCallback'
		);

		// action
		$thrown = false;
		try {
			$this->doPut('/foo.txt');
		} catch (Exception $e) {
			$thrown = true;
		}

		$this->assertTrue($thrown);
		$this->assertEmpty($this->listPartFiles(), 'No stray part files');
	}

	/**
	 * Test exception when the uploaded size did not match
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException|ForbiddenException
	 */
	public function testSimplePutFailsSizeCheck() {
		// setup
		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['rename', 'getRelativePath', 'filesize'])
			->getMock();
		$view->expects($this->any())
			->method('rename')
			->withAnyParameters()
			->willReturn(false);
		$view->expects($this->any())
			->method('getRelativePath')
			->willReturnArgument(0);

		$view->expects($this->any())
			->method('filesize')
			->willReturn(123456);

		$_SERVER['CONTENT_LENGTH'] = 123456;
		$_SERVER['REQUEST_METHOD'] = 'PUT';

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		// action
		$thrown = false;
		try {
			// beforeMethod locks
			$file->acquireLock(ILockingProvider::LOCK_SHARED);

			$file->put($this->getStream('test data'));

			// afterMethod unlocks
			$file->releaseLock(ILockingProvider::LOCK_SHARED);
		} catch (BadRequest $e) {
			$thrown = true;
		}

		$this->assertTrue($thrown);
		$this->assertEmpty($this->listPartFiles($view), 'No stray part files');
	}

	/**
	 * Test exception during final rename in simple upload mode
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException|ForbiddenException
	 * @throws \Exception
	 */
	public function testSimplePutFailsMoveFromStorage() {
		$view = new View('/' . $this->user . '/files');

		// simulate situation where the target file is locked
		$view->lockFile('/test.txt', ILockingProvider::LOCK_EXCLUSIVE);

		$info = new FileInfo('/' . $this->user . '/files/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		// action
		$thrown = false;
		try {
			// beforeMethod locks
			$view->lockFile($info->getPath(), ILockingProvider::LOCK_SHARED);

			$file->put($this->getStream('test data'));

			// afterMethod unlocks
			$view->unlockFile($info->getPath(), ILockingProvider::LOCK_SHARED);
		} catch (FileLocked $e) {
			$thrown = true;
		}

		$this->assertTrue($thrown);
		$this->assertEmpty($this->listPartFiles($view), 'No stray part files');
	}

	/**
	 * Test exception during final rename in chunk upload mode
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 * @throws ForbiddenException
	 * @throws \Exception
	 */
	public function testChunkedPutFailsFinalRename() {
		$view = new View('/' . $this->user . '/files');

		// simulate situation where the target file is locked
		$view->lockFile('/test.txt', ILockingProvider::LOCK_EXCLUSIVE);

		$_SERVER['HTTP_OC_CHUNKED'] = true;

		$info = new FileInfo('/' . $this->user . '/files/test.txt-chunking-12345-2-0', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);
		$file = new File($view, $info);
		$file->acquireLock(ILockingProvider::LOCK_SHARED);
		$this->assertNull($file->put('test data one'));
		$file->releaseLock(ILockingProvider::LOCK_SHARED);

		$info = new FileInfo('/' . $this->user . '/files/test.txt-chunking-12345-2-1', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);
		$file = new File($view, $info);

		// action
		$thrown = false;
		try {
			$file->acquireLock(ILockingProvider::LOCK_SHARED);
			$file->put($this->getStream('test data'));
			$file->releaseLock(ILockingProvider::LOCK_SHARED);
		} catch (FileLocked $e) {
			$thrown = true;
		}

		$this->assertTrue($thrown);
		$this->assertEmpty($this->listPartFiles($view), 'No stray part files');
	}

	/**
	 * Test put file with invalid chars
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws LockedException|ForbiddenException
	 */
	public function testSimplePutInvalidChars() {
		// setup
		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['getRelativePath'])
			->getMock();
		$view->expects($this->any())
			->method('getRelativePath')
			->willReturnArgument(0);

		$info = new FileInfo('/*', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);
		$file = new File($view, $info);

		// action
		$thrown = false;
		try {
			// beforeMethod locks
			$view->lockFile($info->getPath(), ILockingProvider::LOCK_SHARED);

			$file->put($this->getStream('test data'));

			// afterMethod unlocks
			$view->unlockFile($info->getPath(), ILockingProvider::LOCK_SHARED);
		} catch (InvalidPath $e) {
			$thrown = true;
		}

		$this->assertTrue($thrown);
		$this->assertEmpty($this->listPartFiles($view), 'No stray part files');
	}

	/**
	 * Test setting name with setName() with invalid chars
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 */
	public function testSetNameInvalidChars() {
		$this->expectException(InvalidPath::class);

		// setup
		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['getRelativePath'])
			->getMock();

		$view->expects($this->any())
			->method('getRelativePath')
			->willReturnArgument(0);

		$info = new FileInfo('/*', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);
		$file = new File($view, $info);
		$file->setName('/super*star.txt');
	}


	/**
	 * @throws FileLocked
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws InvalidPath
	 * @throws Forbidden
	 * @throws LockedException
	 * @throws ForbiddenException
	 */
	public function testUploadAbort() {
		// setup
		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['rename', 'getRelativePath', 'filesize'])
			->getMock();
		$view->expects($this->any())
			->method('rename')
			->withAnyParameters()
			->willReturn(false);
		$view->expects($this->any())
			->method('getRelativePath')
			->willReturnArgument(0);
		$view->expects($this->any())
			->method('filesize')
			->willReturn(123456);

		$_SERVER['CONTENT_LENGTH'] = 12345;
		$_SERVER['REQUEST_METHOD'] = 'PUT';

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		// action
		$thrown = false;
		try {
			// beforeMethod locks
			$view->lockFile($info->getPath(), ILockingProvider::LOCK_SHARED);

			$file->put($this->getStream('test data'));

			// afterMethod unlocks
			$view->unlockFile($info->getPath(), ILockingProvider::LOCK_SHARED);
		} catch (BadRequest $e) {
			$thrown = true;
		}

		$this->assertTrue($thrown);
		$this->assertEmpty($this->listPartFiles($view), 'No stray part files');
	}


	/**
	 * @throws FileLocked
	 * @throws ServiceUnavailable
	 * @throws Exception\Forbidden
	 */
	public function testDeleteWhenAllowed() {
		// setup
		$view = $this->createMock(View::class);

		$view->expects($this->once())
			->method('unlink')
			->willReturn(true);

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		// action
		$file->delete();
	}


	/**
	 * @throws FileLocked
	 * @throws ServiceUnavailable
	 */
	public function testDeleteThrowsWhenDeletionNotAllowed() {
		$this->expectException(Exception\Forbidden::class);

		// setup
		$view = $this->createMock(View::class);

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => 0
		], null);

		$file = new File($view, $info);

		// action
		$file->delete();
	}


	/**
	 * @throws FileLocked
	 * @throws ServiceUnavailable
	 */
	public function testDeleteThrowsWhenDeletionFailed() {
		$this->expectException(Exception\Forbidden::class);

		// setup
		$view = $this->createMock(View::class);

		// but fails
		$view->expects($this->once())
			->method('unlink')
			->willReturn(false);

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		// action
		$file->delete();
	}


	/**
	 * @throws FileLocked
	 * @throws ServiceUnavailable
	 * @throws Exception\Forbidden
	 */
	public function testDeleteThrowsWhenDeletionThrows() {
		$this->expectException(Forbidden::class);

		// setup
		$view = $this->createMock(View::class);

		// but fails
		$view->expects($this->once())
			->method('unlink')
			->willThrowException(new ForbiddenException('', true));

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		// action
		$file->delete();
	}

	/**
	 * Asserts hook call
	 *
	 * @param array $callData hook call data to check
	 * @param string $signal signal name
	 * @param string $hookPath hook path
	 */
	protected function assertHookCall(array $callData, string $signal, string $hookPath) {
		$this->assertEquals($signal, $callData['signal']);
		$params = $callData['params'];
		$this->assertEquals(
			$hookPath,
			$params[Filesystem::signal_param_path]
		);
	}

	/**
	 * Test whether locks are set before and after the operation
	 *
	 * @throws Exception
	 * @throws Exception\Forbidden
	 * @throws ServiceUnavailable
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws InvalidPath
	 * @throws LockedException
	 * @throws \Exception
	 */
	public function testPutLocking() {
		$view = new View('/' . $this->user . '/files/');

		$path = 'test-locking.txt';
		$info = new FileInfo(
			'/' . $this->user . '/files/' . $path,
			$this->getMockStorage(),
			null,
			['permissions' => Constants::PERMISSION_ALL],
			null
		);

		$file = new File($view, $info);

		$this->assertFalse(
			$this->isFileLocked($view, $path, ILockingProvider::LOCK_SHARED),
			'File unlocked before put'
		);
		$this->assertFalse(
			$this->isFileLocked($view, $path, ILockingProvider::LOCK_EXCLUSIVE),
			'File unlocked before put'
		);

		$wasLockedPre = false;
		$wasLockedPost = false;
		$eventHandler = $this->getMockBuilder(stdclass::class)
			->addMethods(['writeCallback', 'postWriteCallback'])
			->getMock();

		// both pre and post hooks might need access to the file,
		// so only shared lock is acceptable
		$eventHandler->expects($this->once())
			->method('writeCallback')
			->willReturnCallback(
				function () use ($view, $path, &$wasLockedPre) {
					$wasLockedPre = $this->isFileLocked($view, $path, ILockingProvider::LOCK_SHARED);
					$wasLockedPre = $wasLockedPre && !$this->isFileLocked($view, $path, ILockingProvider::LOCK_EXCLUSIVE);
				}
			);
		$eventHandler->expects($this->once())
			->method('postWriteCallback')
			->willReturnCallback(
				function () use ($view, $path, &$wasLockedPost) {
					$wasLockedPost = $this->isFileLocked($view, $path, ILockingProvider::LOCK_SHARED);
					$wasLockedPost = $wasLockedPost && !$this->isFileLocked($view, $path, ILockingProvider::LOCK_EXCLUSIVE);
				}
			);

		Util::connectHook(
			Filesystem::CLASSNAME,
			Filesystem::signal_write,
			$eventHandler,
			'writeCallback'
		);
		Util::connectHook(
			Filesystem::CLASSNAME,
			Filesystem::signal_post_write,
			$eventHandler,
			'postWriteCallback'
		);

		// beforeMethod locks
		$view->lockFile($path, ILockingProvider::LOCK_SHARED);

		$this->assertNotEmpty($file->put($this->getStream('test data')));

		// afterMethod unlocks
		$view->unlockFile($path, ILockingProvider::LOCK_SHARED);

		$this->assertTrue($wasLockedPre, 'File was locked during pre-hooks');
		$this->assertTrue($wasLockedPost, 'File was locked during post-hooks');

		$this->assertFalse(
			$this->isFileLocked($view, $path, ILockingProvider::LOCK_SHARED),
			'File unlocked after put'
		);
		$this->assertFalse(
			$this->isFileLocked($view, $path, ILockingProvider::LOCK_EXCLUSIVE),
			'File unlocked after put'
		);
	}

	/**
	 * Returns part files in the given path
	 *
	 * @param View|null $userView view which root is the current user's "files" folder
	 * @param string $path path for which to list part files
	 *
	 * @return array list of part files
	 * @throws ForbiddenException
	 */
	private function listPartFiles(View $userView = null, string $path = ''): array {
		if ($userView === null) {
			$userView = Filesystem::getView();
		}
		$files = [];
		[$storage, $internalPath] = $userView->resolvePath($path);
		if ($storage instanceof Local) {
			$realPath = $storage->getSourcePath($internalPath);
			$dh = opendir($realPath);
			while (($file = readdir($dh)) !== false) {
				if (substr($file, strlen($file) - 5, 5) === '.part') {
					$files[] = $file;
				}
			}
			closedir($dh);
		}
		return $files;
	}

	/**
	 * returns an array of file information filesize, mtime, filetype,  mimetype
	 *
	 * @param string $path
	 * @param View|null $userView
	 * @return array
	 * @throws InvalidPathException
	 */
	private function getFileInfos(string $path = '', View $userView = null): array {
		if ($userView === null) {
			$userView = Filesystem::getView();
		}
		return [
			"filesize" => $userView->filesize($path),
			"mtime" => $userView->filemtime($path),
			"filetype" => $userView->filetype($path),
			"mimetype" => $userView->getMimeType($path)
		];
	}


	/**
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws NotFound
	 * @throws Exception
	 */
	public function testGetFopenFails() {
		$this->expectException(ServiceUnavailable::class);

		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['fopen'])
			->getMock();
		$view->expects($this->atLeastOnce())
			->method('fopen')
			->willReturn(false);

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		$file->get();
	}


	/**
	 * @throws FileLocked
	 * @throws NotFound
	 * @throws Exception
	 * @throws ServiceUnavailable
	 */
	public function testGetFopenThrows() {
		$this->expectException(Forbidden::class);

		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['fopen'])
			->getMock();
		$view->expects($this->atLeastOnce())
			->method('fopen')
			->willThrowException(new ForbiddenException('', true));

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_ALL
		], null);

		$file = new File($view, $info);

		$file->get();
	}


	/**
	 * @throws FileLocked
	 * @throws Forbidden
	 * @throws Exception
	 * @throws ServiceUnavailable
	 */
	public function testGetThrowsIfNoPermission() {
		$this->expectException(NotFound::class);

		$view = $this->getMockBuilder(View::class)
			->onlyMethods(['fopen'])
			->getMock();
		$view->expects($this->never())
			->method('fopen');

		$info = new FileInfo('/test.txt', $this->getMockStorage(), null, [
			'permissions' => Constants::PERMISSION_CREATE // no read perm
		], null);

		$file = new  File($view, $info);

		$file->get();
	}

	/**
	 * @throws FileLocked
	 * @throws Exception
	 * @throws ServiceUnavailable
	 * @throws Exception\Forbidden
	 * @throws InvalidPath
	 * @throws Forbidden
	 * @throws LockedException
	 * @throws \Exception
	 */
	public function testSimplePutNoCreatePermissions() {
		$this->logout();

		$storage = new Temporary([]);
		$storage->file_put_contents('file.txt', 'old content');
		$noCreateStorage = new PermissionsMask([
			'storage' => $storage,
			'mask' => Constants::PERMISSION_ALL - Constants::PERMISSION_CREATE
		]);

		$this->registerMount($this->user, $noCreateStorage, '/' . $this->user . '/files/root');

		$this->loginAsUser($this->user);

		$view = new View('/' . $this->user . '/files');

		$info = $view->getFileInfo('root/file.txt');

		$file = new File($view, $info);

		// beforeMethod locks
		$view->lockFile('root/file.txt', ILockingProvider::LOCK_SHARED);

		$file->put($this->getStream('new content'));

		// afterMethod unlocks
		$view->unlockFile('root/file.txt', ILockingProvider::LOCK_SHARED);

		$this->assertEquals('new content', $view->file_get_contents('root/file.txt'));
	}

	/**
	 * @throws FileLocked
	 * @throws Exception
	 * @throws ServiceUnavailable
	 * @throws Exception\Forbidden
	 * @throws InvalidPath
	 * @throws Forbidden
	 * @throws LockedException
	 * @throws \Exception
	 */
	public function testPutLockExpired() {
		$view = new View('/' . $this->user . '/files/');

		$path = 'test-locking.txt';
		$info = new FileInfo(
			'/' . $this->user . '/files/' . $path,
			$this->getMockStorage(),
			null,
			['permissions' => Constants::PERMISSION_ALL],
			null
		);

		$file = new File($view, $info);

		// don't lock before the PUT to simulate an expired shared lock
		$this->assertNotEmpty($file->put($this->getStream('test data')));

		// afterMethod unlocks
		$view->unlockFile($path, ILockingProvider::LOCK_SHARED);
	}
}
