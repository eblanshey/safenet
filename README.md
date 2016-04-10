# SafeNet JS

## What is it?

SafeNet JS is a low-level library for communicating with the Safe Launcher. It is written in pure javascript and can be used with NodeJS and the browser. The goal is to provide 1-to-1 compatibility with the launcher's API.

## Demo

Click here for the playground on the SAFE network. Or, simply follow installation for development detailed below, then run the `playground.html` file in your browser. It includes the ability to view the source code for each function.

## Installation

If using node or a browser compiler such as Webpack, use `npm install safenet`. If you simply want to include the client in the browser, a safe network link will be provided later that you can simply include using a `<script>` tag.

For development, clone this repo, run `npm install`, then `npm start`.

## Usage

Except for instantiation of SafeApp below, all methods return promises. The return values stated for each method refers to the resolved value.

#### new SafeApp(app, permissions, config)

Instantiates new SafeApp object.

- `app`: object containing app info, as per description in the [auth docs](https://maidsafe.readme.io/docs/auth):
	- name
	- version
	- vendor
	- id
- `permissions`: array of permissions. Only `SAFE_DRIVE_ACCESS` currently supported.
- `config`: optional obj containing additional configuration:
	- `storage`: object that should be used for saving authentication token and symmetric keys for sending and receiving encrypted data from the launcher. localStorage is used by default in the browser. No node.js method implemented yet. See **this file** for example implementation. To supply your own object for saving auth data, you must provide three properties:
		- `set`: function with a single argument, a value to save to storage.
		- `get`: function with no arguments. Returns data from storage.
		- `clear`: function with no arguments. Clears data from storage.


### Authorization (SafeApp.auth)

Methods related to authentication.

#### authorize()

This is the only method that doesn't have a matching api call in the documentation, but makes authentication much easier. If auth data is saved in storage, it is used to check if already authorized with the launcher using `isAuth()`. If not authorized, it requests authorization. If no data saved in storage, immediately proceed to request for authentication from the launcher using `authenticate()`.

This is the recommended way to authenticate.

**Returns:** `undefined`

#### authenticate()

Authenticates with the launcher using the app info and permission used when creating the SafeApp object. It generates a new public keypair for initial communication with the launcher, and then saves the resulting auth token and symmetrical key and nonce to storage. If authentication fails, the invalid auth data is cleared from storage.

**Returns:** `undefined`

#### isAuth()

Checks if it is authenticated with the network. This is the only case where a launcher 401 (unauthorized) error is caught in order to return a boolean value with the promise.

**Returns:** `true` or `false`

#### deauthorize()

Deauthorizes the app from the launcher and clears the token and key from storage.

**Returns:** `true` or `false`

### DNS (SafeApp.dns)

#### listNames()

List the app's registered names. Known as "long names" in the launcher API.

**Returns:** array of string names

#### createName(name)

Create a new name with the provided string value.

**Returns:** `undefined`

#### deleteName(name)

Delete an existing name with the provided string value.

**Returns:** `undefined`

#### listServices(name)

List all services for a given name. Services act as "subdomains" for a given name.

**Returns:** `array`

#### createServiceForName(obj)

Create a service for an existing name. Provide an object with the following properties:

- `longName`: the name as a string to create the service for. It should have been created at this point using `createName()` above.
- `serviceName`: the new service name as a string.
- `serviceHomeDirPath`: the service should map to this directory on the SAFE network. The path should have been created already using `SafeApp.nfs.createDirectory()`.
- `isPathShared`: was the directory provided above created in the user's SAFEDrive?

**Returns:** `undefined`


#### createServiceAndName(obj)

Create a service and a name. Provide an object with the same properties as the method detailed above. The only difference is that the provided name must not exist yet.

**Returns:** `undefined`

#### getServiceDir(service, name)

Fetches the mapped directory provided a service and name. Read response details in MaidSafe docs.

**Returns:** `object`

#### getFile(service, name, filePath, options = {})

Fetches the contents of the file using the provided service, name, and file path. `options` is an optional object allowing you to get a substring of the file. The object can contain an `offset` and/or `length`.

**Returns:** `string` with contents of file (will soon return an object containing `body` and `meta`)

#### deleteService(service, name)

Fetches the contents of the file using the provided service, name, and file path. `options` is an optional object allowing you to get a substring of the file. The object can contain an `offset` and/or `length`.

**Returns:** `undefined`

### NFS (SafeApp.nfs)

#### createDirectory(dir, options)

Creates a new directory.

- `dir`: directory string
- `options`: object with the following properties:
	- `isPrivate`: should the contents of files in this directory be encrypted? If so, only the currently authenticated user will be able to access them.
	- `metadata`: a base64-encoded string of metadata. Use `btoa()` to encode it.
	- `isVersioned`: boolean, whether or not directory changes should be versioned
	- `isPathShared`: boolean, whether or not to use the SAFEDrive directory as the root directory. The `SAFE_DRIVE_ACCESS` permission must be provided upon authentication in order to set this option to `true`.

**Returns:** `undefined`

#### getDirectory(dir, options)

Gets information about the provided directory. `options` should contain the `isPathShared` property.

#### deleteDirectory(dir, options)

Deletes the directory at the provided path. `options` should contain the `isPathShared` property.

**Returns:** `undefined`

#### createFile(filePath, options)

Creates an empty file at the given path. 

- `filePath`: file path string
- `options`: object with the following properties:
	- `metadata`: a base64-encoded string of metadata. Use `btoa()` to encode it.
	- `isVersioned`: boolean, whether or not directory changes should be versioned
	- `isPathShared`: boolean, whether or not to use the SAFEDrive directory as the root directory. The `SAFE_DRIVE_ACCESS` permission must be provided upon authentication in order to set this option to `true`.

**Returns:** `undefined`

#### updateFile(filePath, content, options)

Update a file at the given path with the provided content.

- `filePath`: file path string
- `content`: string or TypedArray with the content you wish to write to the file.
- `options`: 
	-  `isPathShared`: boolean, whether or not to use the SAFEDrive directory as the root directory. The `SAFE_DRIVE_ACCESS` permission must be provided upon authentication in order to set this option to `true`.
	- `offset`: (optional) integer from where to start writing the file. Characters will be replaced one-by-one. If not provided, the entire file is overwritten.

**Returns:** `undefined`

#### getFile(filePath, options)

Fetches the contents of the file using the provided file path. `options` is an object that contains `isPathShared` (required) and `offset` and `length` properties (optional), allowing you to get a substring of the file.

**Returns:** `string` with contents of file (will soon return an object containing `body` and `meta`)

#### deleteFile(filePath, options)

Deletes the file. `options` must contain `isPathShared`.

**Returns:** `undefined`

