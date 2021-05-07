## [0.13.2](https://github.com/rocketbase-io/skeleton-key/compare/v0.13.1...v0.13.2) (2021-05-07)


### Bug Fixes

* resolve urls relative to current origin if not absolute ([c1e64c8](https://github.com/rocketbase-io/skeleton-key/commit/c1e64c826724c010b9a91f1d4e710331a0068729))

## [0.13.1](https://github.com/rocketbase-io/skeleton-key/compare/v0.13.0...v0.13.1) (2021-05-07)


### Bug Fixes

* change paths in package.json to point to existing files ([fc85822](https://github.com/rocketbase-io/skeleton-key/commit/fc8582226049580b112bc0324027cb02e978e263))

# [0.13.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.12.5...v0.13.0) (2021-05-07)


### Features

* add rudimentary openid connect support ([53087ab](https://github.com/rocketbase-io/skeleton-key/commit/53087ab2046ba34560964748906757053988c551))

## [0.12.5](https://github.com/rocketbase-io/skeleton-key/compare/v0.12.4...v0.12.5) (2021-01-26)


### Bug Fixes

* change scope of output var in atob polyfill ([8a3b85d](https://github.com/rocketbase-io/skeleton-key/commit/8a3b85d3649dc69dd6775822282eba95ad5e9837))

## [0.12.4](https://github.com/rocketbase-io/skeleton-key/compare/v0.12.3...v0.12.4) (2021-01-26)


### Bug Fixes

* refactor b64 polyfills ([dff3fbe](https://github.com/rocketbase-io/skeleton-key/commit/dff3fbe03ce6c8ae636207fa8def6cd6dbef3730))

## [0.12.3](https://github.com/rocketbase-io/skeleton-key/compare/v0.12.2...v0.12.3) (2021-01-21)


### Bug Fixes

* only initialize store with localStorage if localStorage exists ([b809973](https://github.com/rocketbase-io/skeleton-key/commit/b809973381136338884c58bafa471d916119c80f))

## [0.12.2](https://github.com/rocketbase-io/skeleton-key/compare/v0.12.1...v0.12.2) (2021-01-20)


### Bug Fixes

* make skipFirst return undefined if no array was given ([1915cb3](https://github.com/rocketbase-io/skeleton-key/commit/1915cb31d740b40ba3ef9cbf0ade65e0a5b90393))
* resolve linter errors, update linter definitions ([35b5c17](https://github.com/rocketbase-io/skeleton-key/commit/35b5c17fb0b9ae1e7d692222c4f2dc0be3826ec9))

## [0.12.1](https://github.com/rocketbase-io/skeleton-key/compare/v0.12.0...v0.12.1) (2021-01-20)


### Bug Fixes

* update deps, make server side compatible ([ace6c37](https://github.com/rocketbase-io/skeleton-key/commit/ace6c37ef1265c5bf097fd3ed3e5d06f46cfdfd0))
* url resolution in tests ([0e6c731](https://github.com/rocketbase-io/skeleton-key/commit/0e6c731c36b05dc964680aaf3ff6b0b5f68bb006))

# [0.12.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.11.1...v0.12.0) (2020-05-29)


### Bug Fixes

* base url in auth header client config ([2a51971](https://github.com/rocketbase-io/skeleton-key/commit/2a51971984b4567fa4148d064d8a123d48276f6c))


### Features

* allow for changing root url post initialization ([ca2780d](https://github.com/rocketbase-io/skeleton-key/commit/ca2780d87027e7ec1fc8ecaf16997beb57316b07))

## [0.11.1](https://github.com/rocketbase-io/skeleton-key/compare/v0.11.0...v0.11.1) (2020-03-30)


### Bug Fixes

* canRefresh with optional refreshToken ([d1b2625](https://github.com/rocketbase-io/skeleton-key/commit/d1b262577adde667fea099f57c5761fa99ee3a30))

# [0.11.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.10.0...v0.11.0) (2020-03-30)


### Features

* enable sourcemaps, fix loginWithToken emitter logic ([c8c235d](https://github.com/rocketbase-io/skeleton-key/commit/c8c235dff08d400f11830f97875153e68be5d60b))

# [0.10.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.9.0...v0.10.0) (2020-03-30)


### Features

* allow for logging in with a given token, make refresh optional ([b7981de](https://github.com/rocketbase-io/skeleton-key/commit/b7981de17d9e274a83542141b5ab404c823d596a))

# [0.9.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.8.0...v0.9.0) (2020-03-23)


### Features

* enable asynchronous store implementations ([0e0dd3e](https://github.com/rocketbase-io/skeleton-key/commit/0e0dd3ee72c7cb8d6d85a1d7f102e24c7d43ef93))

# [0.8.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.7.5...v0.8.0) (2020-03-23)


### Features

* enable external storage aside from localStorage ([9287abe](https://github.com/rocketbase-io/skeleton-key/commit/9287abe6cfd72f6c1c993b54f4cbb86ab06e10b6))

## [0.7.5](https://github.com/rocketbase-io/skeleton-key/compare/v0.7.4...v0.7.5) (2020-03-18)


### Bug Fixes

* invite verify url ([0f39899](https://github.com/rocketbase-io/skeleton-key/commit/0f39899f061d60f960c63e6cc7613065b0d82db8))

## [0.7.4](https://github.com/rocketbase-io/skeleton-key/compare/v0.7.3...v0.7.4) (2020-03-18)


### Bug Fixes

* disable github asset upload on release ([8dddef0](https://github.com/rocketbase-io/skeleton-key/commit/8dddef0104df13eb854e17461b1374e51bd98cda))

## [0.7.3](https://github.com/rocketbase-io/skeleton-key/compare/v0.7.2...v0.7.3) (2020-03-18)


### Bug Fixes

* invalid invite url ([20b74c0](https://github.com/rocketbase-io/skeleton-key/commit/20b74c051401f996dd66330ea70d259b68fff2a8))

## [0.7.2](https://github.com/rocketbase-io/skeleton-key/compare/v0.7.1...v0.7.2) (2020-03-10)


### Bug Fixes

* rename verificationUrl to resetPasswordUrl ([6258acc](https://github.com/rocketbase-io/skeleton-key/commit/6258accb4b445105adb9232baac48241a6d326ab))

## [0.7.1](https://github.com/rocketbase-io/skeleton-key/compare/v0.7.0...v0.7.1) (2020-02-12)


### Bug Fixes

* update validation request payloads ([b6288b4](https://github.com/rocketbase-io/skeleton-key/commit/b6288b49ad87ae5d1061358fc3caafa27348bdd6))

# [0.7.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.6.1...v0.7.0) (2020-02-10)


### Bug Fixes

* changed model to actual api ([85dae76](https://github.com/rocketbase-io/skeleton-key/commit/85dae76051eb3f67dc6b3574bb69e4b82010e6c2))
* refresh token if necessary before initial login check ([22ea8cb](https://github.com/rocketbase-io/skeleton-key/commit/22ea8cb48a9f3ab928606a8270b255bb3805cb6b))


### Features

* added invite methods + improved return-types ([a064847](https://github.com/rocketbase-io/skeleton-key/commit/a0648471037d7501bd4c5bb15bcfe47fd908365d))
* added invite models ([73bea76](https://github.com/rocketbase-io/skeleton-key/commit/73bea7622c090a8aea1bffe7c3df75e710df5500))

## [0.6.1](https://github.com/rocketbase-io/skeleton-key/compare/v0.6.0...v0.6.1) (2020-01-28)


### Bug Fixes

* refresh once on 401 ([f376ca2](https://github.com/rocketbase-io/skeleton-key/commit/f376ca2d071d0f30974a34927dfe8c4593583ab2))
* refresh once on 401 ([647c547](https://github.com/rocketbase-io/skeleton-key/commit/647c547ffc363fd7e4c68b24c49b7e1a47277e3f))

# [0.6.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.5.0...v0.6.0) (2020-01-27)


### Features

* add ensureInitialized method ([1133f11](https://github.com/rocketbase-io/skeleton-key/commit/1133f11ba6d38c07d04e6cef343282ab822a61bc))
* add ensureInitialized method ([ae5f3e1](https://github.com/rocketbase-io/skeleton-key/commit/ae5f3e166fe8f7e386518d6c0e45cd9530ad4783))

# [0.5.0](https://github.com/rocketbase-io/skeleton-key/compare/v0.4.3...v0.5.0) (2020-01-27)


### Features

* trigger a release ([5737cee](https://github.com/rocketbase-io/skeleton-key/commit/5737cee2eb9d01a20d92d6eb9b9df80535d5d4ee))
* trigger a release ([627f728](https://github.com/rocketbase-io/skeleton-key/commit/627f728dd9e9e72fbc6b614088c42d9df4557835))

## [0.4.3](https://github.com/rocketbase-io/skeleton-key/compare/v0.4.2...v0.4.3) (2020-01-27)


### Bug Fixes

* include 400 status in status check ([13f72d7](https://github.com/rocketbase-io/skeleton-key/commit/13f72d7c4084adfb6d56d61c45cdb0177eef53ff))
