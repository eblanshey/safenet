# SafeNet JS

## What is it?

SafeNet JS is a low-level library for communicating with the Safe Launcher. It is written in pure javascript and can be used in a node and browser environment. The goal is to provide 1-to-1 compatibility with the launcher's API. It is only 53kb compressed (which includes encryption and stream base64 libraries).

## [Demo](http://app.playground.safenet/)

Start the [SAFE launcher](https://maidsafe.readme.io/docs/getting-started) and then [click here](http://app.playground.safenet/) for the playground on the SAFE network. Or, simply follow installation for development detailed below (npm install and start), then run the `playground.html` file in your browser. It includes the ability to view the source code for each function.

#### Security Warning

Running SAFE apps in the browser is currently not secure and no privacy or security should be expected in its current state. It is currently possible to mix safenet and conventional internet requests, thus exposing yourself to many cross-site vulnerabilities. This demo is useful for learning about the SAFE network and the API, and browser apps can be created with the intention of running them when more secure browser solutions are created.

## Installation

If using node or a browser compiler such as Webpack, use `npm install safenet`. If you simply want to include the library in the browser, add the following script tag tag to the header of your html file:

```html
<script src="http://app.playground.safenet/lib/index.js"></script>
```

For development, clone this repo, run `npm install`, then `npm start`.

## Usage

All methods return promises. The return values stated for each method refers to the resolved value. You may refer to the demo app for example usage of each method.

#### new SafeApp(app, permissions, config)

Instantiates new SafeApp object.

- `app`: object containing app info, as per description in the [auth docs](https://maidsafe.readme.io/docs/auth):
	- name
	- version
	- vendor
	- id
- `permissions`: array of permissions. Only `SAFE_DRIVE_ACCESS` currently supported.
- `config`: optional object containing additional configuration:
	- `storage`: object that should be used for saving authentication token and symmetric keys for sending and receiving encrypted data from the launcher. localStorage is used by default in the browser. Storage for Node has not been implemented yet. See **this file** for example implementation. To supply your own object for saving auth data, you must provide three properties:
		- `set`: function with a single argument, a value to save to storage.
		- `get`: function with no arguments. Returns data from storage.
		- `clear`: function with no arguments. Clears data from storage.

### Errors

If an error occur with an API request, the promise will be rejected with a SafeError object. All SafeError objects contain the following properties:

* `isSafeError`: `true`
* `message`: string of error
* `type`: one of `launcher`, `http`, `network`, or `error`. Here is a description of each:
	* `error`: generic error
	* `network`: could not connect to the network/launcher
	* `http`: a generic http response error, e.g. a non-2xx response, but without a SAFE-related error attached.
	* `launcher`: the launcher returned an error
* `status`: status code. If `http` error, it'll be the http header code (e.g. `400`). If launcher, the launcher error code (e.g. `-502`)
* `response`: if an `http` or `launcher` type, this will contain the [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object returned from the request. Body has already been retrieved and is in the `message` property above. If another type, this will be `undefined`.

### Authorization (SafeApp.auth)

Methods related to authentication.

#### authorize()

This is the only method that doesn't have a matching api call in the documentation, but makes authentication much easier. If auth data is saved in storage, it is used to check if already authorized with the launcher using `isAuth()`. If not authorized, it requests authorization. If no data saved in storage, immediately proceed to request for authentication from the launcher using `authenticate()`.

This is the recommended way to authenticate.

**Returns:** `undefined`

#### authenticate() [docs](https://maidsafe.readme.io/docs/auth)

Authenticates with the launcher using the app info and permission used when creating the SafeApp object. It generates a new public keypair for initial communication with the launcher, and then saves the resulting auth token and symmetrical key and nonce to storage. If authentication fails, the invalid auth data is cleared from storage.

**Returns:** `undefined`

#### isAuth()  [docs](https://maidsafe.readme.io/docs/is-token-valid)

Checks if it is authenticated with the network. This is the only case where a launcher 401 (unauthorized) error is caught in order to return a boolean value with the promise.

**Returns:** `true` or `false`

#### deauthorize() [docs](https://maidsafe.readme.io/docs/revoke-token)

Deauthorizes the app from the launcher and clears the token and key from storage.

**Returns:** `true` or `false`

### DNS (SafeApp.dns)

#### listNames() [docs](https://maidsafe.readme.io/docs/dns-list-long-names)

List the app's registered names. Known as "long names" in the launcher API.

**Returns:** array of string names

#### createName(name) [docs](https://maidsafe.readme.io/docs/dns-create-long-name)

Create a new name with the provided string value.

**Returns:** `undefined`

#### deleteName(name)

Delete an existing name with the provided string value.

**Returns:** `undefined`

#### listServices(name) [docs](https://maidsafe.readme.io/docs/dns-list-services)

List all services for a given name. Services act as "subdomains" for a given name.

**Returns:** `array`

#### createServiceForName(obj) [docs](https://maidsafe.readme.io/docs/dns)

Create a service for an existing name. Provide an object with the following properties:

- `longName`: the name as a string to create the service for. It should have been created at this point using `createName()` above.
- `serviceName`: the new service name as a string.
- `serviceHomeDirPath`: the service should map to this directory on the SAFE network. The path should have been created already using `SafeApp.nfs.createDirectory()`.
- `isPathShared`: was the directory provided above created in the user's SAFEDrive?

**Returns:** `undefined`


#### createServiceAndName(obj) [docs](https://maidsafe.readme.io/docs/dns-register-service)

Create a service and a name at the same time. Provide an object with the same properties as `createServiceForName()`. The only difference is that the provided name must not exist yet.

**Returns:** `undefined`

#### getServiceDir(service, name) [docs](https://maidsafe.readme.io/docs/dns-get-home-dir)

Fetches the mapped directory provided a service and name. Read response details in [MaidSafe docs](https://maidsafe.readme.io/docs/dns-get-home-dir).

**Returns:** `object`

#### getFile(service, name, filePath, options = {}) [docs](https://maidsafe.readme.io/docs/dns-get-file-unauth)

Fetches the contents of the file using the provided service, name, and file path. `options` is an optional object allowing you to get a substring of the file. The object can contain an `offset` and/or `length`.

**Returns:** `object` with `body` property containing contents of file and `meta` containing file-related headers.

#### deleteService(service, name)

Fetches the contents of the file using the provided service, name, and file path. `options` is an optional object allowing you to get a substring of the file. The object can contain an `offset` and/or `length`.

**Returns:** `undefined`

### NFS (SafeApp.nfs)

#### createDirectory(dir, options) [docs](https://maidsafe.readme.io/docs/nfs-create-directory)

Creates a new directory.

- `dir`: directory string
- `options`: object with the following properties:
	- `isPrivate`: should the contents of files in this directory be encrypted? If so, only the currently authenticated user will be able to access them.
	- `metadata`: a string of metadata
	- `isVersioned`: boolean, whether or not directory changes should be versioned
	- `isPathShared`: boolean, whether or not to use the SAFEDrive directory as the root directory. The `SAFE_DRIVE_ACCESS` permission must be provided upon authentication in order to set this option to `true`.

**Returns:** `undefined`

#### getDirectory(dir, options) [docs](https://maidsafe.readme.io/docs/nfs-get-directory)

Gets information about the provided directory. `options` should contain the `isPathShared` property.

#### deleteDirectory(dir, options) [docs](https://maidsafe.readme.io/docs/nfs-delete-directory)

Deletes the directory at the provided path. `options` should contain the `isPathShared` property.

**Returns:** `undefined`

#### createFile(filePath, options) [docs](https://maidsafe.readme.io/docs/nfsfile)

Creates an empty file at the given path. 

- `filePath`: file path string
- `options`: object with the following properties:
	- `metadata`: a string of metadata
	- `isVersioned`: boolean, whether or not directory changes should be versioned
	- `isPathShared`: boolean, whether or not to use the SAFEDrive directory as the root directory. The `SAFE_DRIVE_ACCESS` permission must be provided upon authentication in order to set this option to `true`.

**Returns:** `undefined`

#### updateFile(filePath, content, options) [docs](https://maidsafe.readme.io/docs/nfs-update-file-content)

Update a file at the given path with the provided content.

- `filePath`: file path string
- `content`: string or TypedArray with the content you wish to write to the file.
- `options`: 
	-  `isPathShared`: boolean, whether or not to use the SAFEDrive directory as the root directory. The `SAFE_DRIVE_ACCESS` permission must be provided upon authentication in order to set this option to `true`.
	- `offset`: (optional) integer from where to start writing the file. Characters will be replaced one-by-one. If not provided, the entire file is overwritten.

**Returns:** `undefined`

#### getFile(filePath, options) [docs](https://maidsafe.readme.io/docs/nfs-get-file)

Fetches the contents of the file using the provided file path. `options` is an object that contains `isPathShared` (required) and `offset` and `length` properties (optional), allowing you to get a substring of the file.

**Returns:** `object` with `body` property containing contents of file and `meta` containing file-related headers.

#### deleteFile(filePath, options) [docs](https://maidsafe.readme.io/docs/nfs-delete-file)

Deletes the file. `options` must contain `isPathShared`.

**Returns:** `undefined`

## To Do

* Unit tests
* Missing NFS calls ([as listed in the safe launcher](https://github.com/maidsafe/safe_launcher/blob/master/app/server/routes/version_0_4.js))
* Bugfixes:
	* Missing headers when fetching files

