## Changelog

### v0.4.4
- Merge pull request #19 from rocketbase-io/dev [[6197cc]](f377153c21ed0825640d415d8ee178af596197cc)
- log out on invalid refresh [[33f156]](0370a62c9410a4091dddbe673119d64fbe33f156)
- fix test file [[2d4f1e]](f5ff7c1b2b67323a027901343d14b7ab312d4f1e)
- add option for interval refreshing [[c29899]](fcb9ea1721bebe03bcce5b1bf534a38b70c29899)
- fix route for password change [[3ff5f5]](5ec0e9de1e61b087ebad2c3fb33843cc443ff5f5)
- organize imports, check result of logout [[b64ffe]](1154abf6fdc0951915063ad92206ae5a74b64ffe)
- update badge links [[4ab80d]](f41fd751a418729528747e6ad09c7f4de84ab80d)

### v0.4.2
- Merge pull request #18 from rocketbase-io/dev [[57e20d]](d45b803a01596fd4d8ec4a63fcd3f4c6d157e20d)
- add unit tests for fetch, bigfixes [[6c11d9]](6c943eeaedb6233f1ee606ac82c7063f046c11d9)
- add unit tests for refreshToken() [[09c5bd]](d101a704e4ba9bf5f09834399afb74a35d09c5bd)

### v0.4.1
- Merge pull request #17 from rocketbase-io/dev [[4eccc2]](3f84d66db2f67465a410114926b03a41de4eccc2)
- add unit tests for login and logout [[8d87f7]](dcd561f227841f26042a216b9f16da907a8d87f7)
- add unit tests for onAction() [[eb6a8e]](ad254939d1cd0281a396dead42abb16a1deb6a8e)
- add unit tests for #isLoggedIn [[aa24d1]](92e1532d675c3ee1bfe191f1447f03d260aa24d1)
- add unit tests for load() [[663201]](606def14a92c6e00ad233d63949a32e239663201)
- unit tests [[fd2849]](9a26ad1f561cf1cdb1aebfeb78e1cc76e2fd2849)
- emit events synchronously if possible [[b59885]](eb190d6e9e16163ac57e7fa4bfbefc88a1b59885)
- add url matching and unit tests [[2c0b26]](e606febb77f30699f2b42d5e34c3cb35972c0b26)
- generalize eventing parameters and remove unused methods [[160276]](e1573a83d35f49394b37cf7fd2eb222fea160276)
- add url matching util, fix renew detection [[8c8307]](ea412420d1973c64bb97d89a776e8709df8c8307)
- prevent infinite renew loop [[396302]](48bde1e7c83faa2a7a96397619825592da396302)

### v0.4.0
- Merge pull request #16 from rocketbase-io/dev [[c6292b]](a4e2c465994bfc7e89b732105ea5f69e3cc6292b)
- Add examples to readme [[19385e]](731b1d82b74eee1f0f835d646db4989a2119385e)
- 0.3.11 [[0cb248]](a8d1ebb91edd32bad428077eef3f4c76b20cb248)
- Merge pull request #15 from rocketbase-io/dev [[1279c6]](69215ba8df92f4bfbb0dbc33fd29b998b31279c6)
- ignore auth client in coverage (only requests) [[8feab1]](703ac586bf9dfcd482be6b80486dda2f918feab1)
- add unit tests for interceptFunction and installInterceptors [[9c9c5e]](36a6878175d64693dda751ec8f144f3f149c9c5e)
- add support for partial interceptors, middleware unit tests [[9c9d2c]](ef924a4c1a8c12b970eca006f3c9e4aa4b9c9d2c)
- add __headers and __openArgs fields to xmlhttprequest [[85778f]](ef1e7b79966b00dc5922eb61213360f89685778f)
- 0.3.10 [[3df6e7]](ce15f20895505a1dd03b3e7e0ab39fff283df6e7)
- Merge pull request #14 from rocketbase-io/dev [[8cf441]](f93f372c815c65eda4fe951f785385dee68cf441)
- fix skipFirst not handling array-likes correctly [[cd124e]](668205183a4e7f7a738ff4d4565215dfe3cd124e)

### v0.3.9
- Merge pull request #13 from rocketbase-io/dev [[809a40]](664244591c0a9528930d1c3087db245360809a40)
- export library [[85d055]](905ce0123cde476de5e005ac271721518e85d055)
- add badges to readme [[f9116d]](61bfc23ed75174cea93c97c6314f48737af9116d)

### v0.3.8
- Merge pull request #12 from rocketbase-io/dev [[99b77b]](2e5a0a88adb21f185c1d21abff2f50730799b77b)
- reause threshold for duplicate code once more [[27faa4]](1e4c0ca4cff96b80770992d868715dea1327faa4)
- raise threshold for duplicate code [[9c2568]](c950a1cddf81fada10f66b229273dd88fe9c2568)
- add unit tests for middleware skipFirst and executeRelevantInterceptors [[9e1f88]](488be05f039b37e094b812eb06586e17289e1f88)
- add unit tests for eventing [[7d8c3e]](83bc3b2f9f451b8e61f2b095aae9ec09297d8c3e)
- ignore polyfills in code coverage [[27791a]](70004878d9e48876ac80fd43e65eafe18727791a)
- add unit tests for jwt decode [[67ba67]](404472c704a867f488c3f608e682a7548567ba67)
- fix generated d.ts bundle [[e4656a]](d55acc5a8bfc6dd423f4a4b63e7737e393e4656a)
- ignore generated docs [[7a26da]](254ad2c4f7b835e0851144e677096f58037a26da)
- include src and docs in deployment [[7526d1]](285cb88ed3a0f9333db342191e37a451517526d1)
- update npm scripts [[a3b5a8]](c351002516de84f2aa25df6281f41f0ca5a3b5a8)
- add travis ci configuration [[040ffc]](4eb9c04467fe8f27724b3d43226615b62b040ffc)
- add ci/cd compatible karma config [[d1acb1]](c879e09d40c89a7d1b1583a262a77494b6d1acb1)
- add basic unit tests for domain and util [[deb8b8]](25166ead5dcf189e2ad6aeac97490bf69fdeb8b8)
- add istanbul instrumenter + coverage [[feae99]](037c9ecf1a15530a071ec742d850f0becbfeae99)
- add karma config [[9aa558]](2786c79ce70a01094e007885e5b86aefca9aa558)
- add webpack config, dts bundle for typings [[604bf7]](c5da45a2e0ea3730c397412e8873beb0a6604bf7)
- Merge branch 'master' of github.com:rocketbase-io/skeleton-key into dev [[1580e0]](2ccf670edf3d167cec841f294e6302ad661580e0)
- change unit test stack to webpack + karma + typescript + istanbul + jasmine [[c10363]](8fd2897a7e74bf690ce839f8395e766a02c10363)
- refactor middleware calls [[e53f88]](d13962a1cc08983083742d1e83710b47c8e53f88)
- update authors and changelog [[ce4ce1]](9aef9ced87f0f50fbb575eb48961d28190ce4ce1)

### v0.3.7
- Merge pull request #11 from rocketbase-io/dev [[f8f2d6]](ca684861fd2394f1adee877614052e290ef8f2d6)
- wrap handler functions of interceptors [[811185]](913e04d2059d9e141b6e8f445cf6215c08811185)
- update authors and changelog [[5d69d6]](28bb07a351b913520d8db20fee7fee4ef05d69d6)

### v0.3.6
- Merge pull request #10 from rocketbase-io/dev [[f6ff28]](2bafaa2ec2034665305086786e0db2e68af6ff28)
- reduce complexity of eventing mixin [[3eb03b]](e00de11ab88083694e050e22d7b05066753eb03b)
- shift arguments by one for middleware [[90e558]](ae812609c0815b8de416d9d41c89a521b390e558)
- add documentation to jwt model class [[7f15d3]](ec929e03443560f3c8fc26f3a9d571647a7f15d3)
- add async execution of events (eventing mixin), refactor header value [[55edff]](6f69ecb20bd5afae888de6fc93cbe3ac9655edff)
- update authors and changelog [[9d4f71]](81d93ad9f4d9df26df42d5e2e0555b82799d4f71)

### v0.3.5
- Merge pull request #9 from rocketbase-io/dev [[6dfb40]](4a195ffd42885c04ca9c44d48b209f6ab86dfb40)
- add user and token data to skeleton key [[6a4d1b]](a6fcfed6ae1afdc4cc74239ea2ee25af6e6a4d1b)
- update authors and changelog [[ee9e25]](17ab6ae4e5601e7b6030670eeec683e36dee9e25)

### v0.3.4
- Merge pull request #8 from rocketbase-io/dev [[a3fbbd]](d643c05fb7d424b6556ddc665e38469f07a3fbbd)
- Fix expiry ratio validation [[5f0529]](857437cd850a2df699c66b29bec568e8d55f0529)
- update authors and changelog [[313e73]](b48f2f197a69f4c9f8a47ae956558c7b6f313e73)

### v0.3.3
- Merge pull request #7 from rocketbase-io/dev [[3c939b]](2769fbc2e649a75e9d51cba53c5c10a3d63c939b)
- set axios contet type to json [[8f2375]](7cf30a5bd2a3db32ea545d12d1c46980268f2375)
- update authors and changelog [[998048]](f8855e05231032a4a4a57c0f19052ed72b998048)

### v0.3.2


### v0.3.11
- Merge pull request #15 from rocketbase-io/dev [[1279c6]](69215ba8df92f4bfbb0dbc33fd29b998b31279c6)
- ignore auth client in coverage (only requests) [[8feab1]](703ac586bf9dfcd482be6b80486dda2f918feab1)
- add unit tests for interceptFunction and installInterceptors [[9c9c5e]](36a6878175d64693dda751ec8f144f3f149c9c5e)
- add support for partial interceptors, middleware unit tests [[9c9d2c]](ef924a4c1a8c12b970eca006f3c9e4aa4b9c9d2c)
- add __headers and __openArgs fields to xmlhttprequest [[85778f]](ef1e7b79966b00dc5922eb61213360f89685778f)

### v0.3.10
- Merge pull request #14 from rocketbase-io/dev [[8cf441]](f93f372c815c65eda4fe951f785385dee68cf441)
- fix skipFirst not handling array-likes correctly [[cd124e]](668205183a4e7f7a738ff4d4565215dfe3cd124e)
- 0.3.9 [[443a86]](dfd9ff1dfc64388a4fdb504ae89eeda8bf443a86)
- Merge pull request #13 from rocketbase-io/dev [[809a40]](664244591c0a9528930d1c3087db245360809a40)
- export library [[85d055]](905ce0123cde476de5e005ac271721518e85d055)
- 0.3.8 [[09ce3d]](3343ad37c58bf9657debe64c829bd0184209ce3d)
- add badges to readme [[f9116d]](61bfc23ed75174cea93c97c6314f48737af9116d)
- Merge pull request #12 from rocketbase-io/dev [[99b77b]](2e5a0a88adb21f185c1d21abff2f50730799b77b)
- reause threshold for duplicate code once more [[27faa4]](1e4c0ca4cff96b80770992d868715dea1327faa4)
- raise threshold for duplicate code [[9c2568]](c950a1cddf81fada10f66b229273dd88fe9c2568)
- add unit tests for middleware skipFirst and executeRelevantInterceptors [[9e1f88]](488be05f039b37e094b812eb06586e17289e1f88)
- add unit tests for eventing [[7d8c3e]](83bc3b2f9f451b8e61f2b095aae9ec09297d8c3e)
- ignore polyfills in code coverage [[27791a]](70004878d9e48876ac80fd43e65eafe18727791a)
- add unit tests for jwt decode [[67ba67]](404472c704a867f488c3f608e682a7548567ba67)
- fix generated d.ts bundle [[e4656a]](d55acc5a8bfc6dd423f4a4b63e7737e393e4656a)
- ignore generated docs [[7a26da]](254ad2c4f7b835e0851144e677096f58037a26da)
- include src and docs in deployment [[7526d1]](285cb88ed3a0f9333db342191e37a451517526d1)
- update npm scripts [[a3b5a8]](c351002516de84f2aa25df6281f41f0ca5a3b5a8)
- add travis ci configuration [[040ffc]](4eb9c04467fe8f27724b3d43226615b62b040ffc)
- add ci/cd compatible karma config [[d1acb1]](c879e09d40c89a7d1b1583a262a77494b6d1acb1)
- add basic unit tests for domain and util [[deb8b8]](25166ead5dcf189e2ad6aeac97490bf69fdeb8b8)
- add istanbul instrumenter + coverage [[feae99]](037c9ecf1a15530a071ec742d850f0becbfeae99)
- add karma config [[9aa558]](2786c79ce70a01094e007885e5b86aefca9aa558)
- add webpack config, dts bundle for typings [[604bf7]](c5da45a2e0ea3730c397412e8873beb0a6604bf7)
- Merge branch 'master' of github.com:rocketbase-io/skeleton-key into dev [[1580e0]](2ccf670edf3d167cec841f294e6302ad661580e0)
- change unit test stack to webpack + karma + typescript + istanbul + jasmine [[c10363]](8fd2897a7e74bf690ce839f8395e766a02c10363)
- refactor middleware calls [[e53f88]](d13962a1cc08983083742d1e83710b47c8e53f88)
- update authors and changelog [[ce4ce1]](9aef9ced87f0f50fbb575eb48961d28190ce4ce1)
- 0.3.7 [[6aafaa]](7a3cc886ec41ac1070b02a573bf16061946aafaa)
- Merge pull request #11 from rocketbase-io/dev [[f8f2d6]](ca684861fd2394f1adee877614052e290ef8f2d6)
- wrap handler functions of interceptors [[811185]](913e04d2059d9e141b6e8f445cf6215c08811185)
- update authors and changelog [[5d69d6]](28bb07a351b913520d8db20fee7fee4ef05d69d6)
- 0.3.6 [[6c859f]](f5ff95ad1c9a397724d1d508750af5c0a26c859f)
- Merge pull request #10 from rocketbase-io/dev [[f6ff28]](2bafaa2ec2034665305086786e0db2e68af6ff28)
- reduce complexity of eventing mixin [[3eb03b]](e00de11ab88083694e050e22d7b05066753eb03b)
- shift arguments by one for middleware [[90e558]](ae812609c0815b8de416d9d41c89a521b390e558)
- add documentation to jwt model class [[7f15d3]](ec929e03443560f3c8fc26f3a9d571647a7f15d3)
- add async execution of events (eventing mixin), refactor header value [[55edff]](6f69ecb20bd5afae888de6fc93cbe3ac9655edff)
- update authors and changelog [[9d4f71]](81d93ad9f4d9df26df42d5e2e0555b82799d4f71)
- 0.3.5 [[3a2c8d]](c86fe44a82b287522e363d6d500fed7ed93a2c8d)
- Merge pull request #9 from rocketbase-io/dev [[6dfb40]](4a195ffd42885c04ca9c44d48b209f6ab86dfb40)
- add user and token data to skeleton key [[6a4d1b]](a6fcfed6ae1afdc4cc74239ea2ee25af6e6a4d1b)
- update authors and changelog [[ee9e25]](17ab6ae4e5601e7b6030670eeec683e36dee9e25)
- 0.3.4 [[f15836]](5d8a20a34a35cc4a7381052b47726959aff15836)
- Merge pull request #8 from rocketbase-io/dev [[a3fbbd]](d643c05fb7d424b6556ddc665e38469f07a3fbbd)
- Fix expiry ratio validation [[5f0529]](857437cd850a2df699c66b29bec568e8d55f0529)
- update authors and changelog [[313e73]](b48f2f197a69f4c9f8a47ae956558c7b6f313e73)
- 0.3.3 [[6748c4]](672bb3a2e336c0c1b38ee239096cb2edd96748c4)
- Merge pull request #7 from rocketbase-io/dev [[3c939b]](2769fbc2e649a75e9d51cba53c5c10a3d63c939b)
- set axios contet type to json [[8f2375]](7cf30a5bd2a3db32ea545d12d1c46980268f2375)
- update authors and changelog [[998048]](f8855e05231032a4a4a57c0f19052ed72b998048)
- 0.3.2 [[fb698d]](b1fcd92ec83a639c1b04f9c9e3bfab746cfb698d)
- Merge pull request #6 from rocketbase-io/dev [[2b7dd8]](06ee80a7b6a4acf9abaad53580533f1cfb2b7dd8)
- raise method threshold [[334378]](19e75aab63a6afc4e52eeec0784b357aed334378)
- bind request interceptor handers [[020f16]](1e150d211cb4a39c774814b9b821615b4b020f16)
- update authors and changelog [[0cdb41]](56ad89e4a37b037c8c87e6ba890450e1400cdb41)

### v0.3.1
- Merge pull request #5 from rocketbase-io/dev [[cdf509]](c54e0d6113e9d54370e19057daa3492c93cdf509)
- join jwt payload types and check for null and undefined in interceptors [[97287f]](0be184090fd1596d2d9e1f9ae04ea3661f97287f)
- make sure requests without headers pass [[07564f]](e77f32212f0aae9aa219ffe817d1cd393607564f)
- update authors and changelog [[85e85f]](8889064ff12c91fe01a7ffe058fc9588d485e85f)

### v0.3.0
- Merge pull request #4 from rocketbase-io/dev [[fac97f]](a3ec4b2d48a7c6b8277bb3134c0fd981aafac97f)
- raise identical code threshold [[7ca7ab]](acabd6901b76688c6edb48cb6756df77357ca7ab)
- set similar code thresholds [[935a39]](4f719fd5e4f63a50cb63ccae31330cf2a9935a39)
- ignore polyfills [[e0df0e]](06dc80587ba6b35de18d6009a81c42faafe0df0e)
- add codeclimate config [[5e94f1]](70174d36d554f21163da78aa06909737795e94f1)
- add maintainability badge [[8230c0]](cb69aa977f26e3ebac07621d029c4caa628230c0)
- finalize rework [[ac2e33]](228580cfd346c001796afd2b02dd671d0bac2e33)
- start rework [[ce46d6]](30c4436910cc5015dbb14d8c3d4e1419f6ce46d6)
- update authors and changelog [[8a83d6]](7caceb44a2abee9f0118499595263363528a83d6)
- 0.2.31 [[70186d]](b500b72e798beab8e62912efc306bdaf1e70186d)
- make isLoggedIn async [[6a3433]](1db2b6ab2e554b04c670d11a9542c9cc3d6a3433)
- update authors and changelog [[4a905e]](3f25ab9d696f54fbe61947b6a669fb39584a905e)
- 0.2.30 [[ebbee6]](da709f8986eb8fd474219e534fa5fd5e8cebbee6)
- change maxinactivems logig from timespan to date [[ae4af6]](348db3d0f702c8ccbd6e7bf95c81544bebae4af6)
- update authors and changelog [[2ec3df]](2b9d607fcf4545f895b8486a676e54cb412ec3df)
- update authors and changelog [[d2449b]](86ec0596025beb676653a94c4efb04c795d2449b)
- 0.2.29 [[2121e3]](6756ce695f67a24e2f9e2661c3e9ed336e2121e3)
- update authors and changelog [[2618d2]](9b37e0edc06f14ac273e85be13cf5781952618d2)
- refresh token on expiry [[f0fc91]](794a83dd6e809686c41020c4bde6b8896cf0fc91)
- update authors and changelog [[13211f]](236943d7d80a7763e142571f2432c1bd1f13211f)
- 0.2.28 [[51ac59]](1976abc42336dd1910a435185dc468ac7751ac59)
- remove register stub [[0ace8a]](e3ec76128a8f80e902ac86bed462301dbd0ace8a)
- remove register stub [[92eafc]](84d826ab2ad05b51a8f9685d93da2494f292eafc)
- 0.2.27 [[fbf001]](f78907c5c7ce00b3c77c52e21fc4476b57fbf001)
- persist on logout [[d1fabf]](97a3f4e742e6f15a7b0fe03b27d78abebfd1fabf)
- update authors and changelog [[8eac50]](1f4983be3c0b718149fd1b1e601efcfe838eac50)
- 0.2.26 [[1dae8c]](3a97fc2b72b69f6f1ff4d10a22069dc4fd1dae8c)
- persist logout [[6ba1a6]](4b70eb7c81e76cb61c31ea2fb3287af8846ba1a6)
- update authors and changelog [[8ecca9]](7cd16938e70b0e78edb923747e139aeaac8ecca9)
- 0.2.25 [[660179]](bbfb39b19d1410104a440288f7fcb1d7d7660179)
- revive json dates [[1a89cd]](445c0066fff477b630341926d5bccb0e161a89cd)
- update authors and changelog [[ce665d]](580c4a6c85ffca3ee12feda3f5a049262fce665d)
- 0.2.24 [[95d148]](a8ffadcda6bd447d0924fbcada34b0b9c995d148)
- persist user reliably to localStorage [[7f2e4d]](20d683f5dfa6c8775826bddc4306d3c8347f2e4d)
- update authors and changelog [[7c24af]](23404952e0f635994ace45b9ed9c1f53567c24af)
- 0.2.23 [[f9fca9]](86844e7c311dc4180be8bb501b142dbf19f9fca9)
- cache open arguments for url checking [[820e2b]](a43c03dfc08dbf88e63ed72cc98cda3ac9820e2b)
- update authors and changelog [[1c292a]](f485c303c01002debd392ff6e0d6b991e41c292a)
- 0.2.22 [[bd0872]](a972bc8593ce9d7c2362e7ce2f123ca4b4bd0872)
- persist user info to local storage [[d2ac4b]](908a62639456f9c29785b7dabd0223884cd2ac4b)
- update authors and changelog [[52fb72]](eaff053d7ab63b9a1c864b1457d3c8c5a852fb72)
- 0.2.21 [[29ab16]](0cc7feed5365facf23dd8cac6beacc975629ab16)
- streamline user validation checks [[04f0f1]](2b5af2bf43b023e283800050e9c50554b304f0f1)
- update authors and changelog [[19c13a]](e398b6b6b91fcfdc1ceddaa3ceee4d96bc19c13a)
- 0.2.20 [[27f184]](678b7f188d9340dfa61d0cd4d338cb8e4127f184)
- exit waitForLogin immediately if the user is already logged in [[d2ae0f]](c2cec3ab7232ffc3ba2b8a514c10513a05d2ae0f)
- update authors and changelog [[613329]](83f71627341cae3745fb7d62f58c707b83613329)
- 0.2.19 [[68b76a]](d073b0c4674c7916e74f270d4889790a4468b76a)
- fix validation comparison [[a6529e]](fabc65b4bc5c7ff785a13ffe1a1f26d173a6529e)
- update authors and changelog [[42b5e0]](95f805c419b314a783d262f3b981e0a23d42b5e0)
- 0.2.18 [[a3f205]](392b443391605797e0762bdff2b5945a4fa3f205)
- fix typing path [[0bd9c1]](943fb3080b1e2c4e20523425e7c99d978c0bd9c1)
- update authors and changelog [[2c1789]](c8098cde941c6e8f653e25fc90ffb360742c1789)
- 0.2.17 [[53f766]](0eae0b88b8420f3d6911c4711c3573754d53f766)
- add typings to package.json [[f6be05]](769c7e95ecf19758530514dbc8aee742acf6be05)
- update authors and changelog [[e6e095]](938cdb9a9a040d161553b900e784463811e6e095)
- 0.2.16 [[62ffdd]](a72dfdafbb6190ac13720ea7ff7daffee862ffdd)
- allow for empty request body [[92211d]](d04c516b74ab580bd1b37cbf571a8c092a92211d)
- update authors and changelog [[03fd54]](91b2d3f8a57b1aeb7d6d40d3078acad04903fd54)
- 0.2.15 [[afd80f]](694d34d16942f2567edb19ef67a18d4cebafd80f)
- typo fix [[41e58e]](d7c761fa3db7c4afceeeac76adfe876c6341e58e)
- update authors and changelog [[2cb70f]](7856938e03a362c573c682d2dea1d8a6702cb70f)
- 0.2.14 [[563587]](926fe69e1b24fa56977595f1e419be8c38563587)
- typo fix [[a5c29d]](a235885ca369688daeed315c82acf7d7c9a5c29d)
- update authors and changelog [[8304f3]](54a439c8c896dc8c09426659df8fe0ece08304f3)
- 0.2.13 [[cbd7a0]](7fddeedab2c24ebc054f9f354921a1e988cbd7a0)
- pass body without array [[2ff314]](31ac8aa5305186d070d904ec223e8bcfb32ff314)
- update authors and changelog [[ff34ae]](4b895b26a3fc2f32651103c2443a6c7256ff34ae)
- 0.2.12 [[abf6fe]](0f045dfbce11f341fb916d640f336322a8abf6fe)
- move header def to onXHRSend [[e10403]](2a542ef6ffcbc53238ec638753cfdb9140e10403)
- update authors and changelog [[696042]](099d2b2e67692748b06743e1732587adc8696042)
- 0.2.11 [[51929c]](b7055511a8d4be0a292b172666045bbf7a51929c)
- fix typo [[4979ea]](2332124c8ff76df102b8b5a0944572642f4979ea)
- update authors and changelog [[99a6ae]](54d84118ccffaea8e1a20fb7acaa71332299a6ae)
- 0.2.10 [[9e051a]](2e28f190de5644611705c7987548dd45ab9e051a)
- wrap args as array [[10b714]](dc401a40186e597ee0c12e673d89d23f5710b714)
- update authors and changelog [[701d7c]](571f2e9ad9e4c9f93e6e1c7f3ca1292775701d7c)
- Merge pull request #3 from rocketbase-io/dev [[bc7ec9]](7eecb4eead3d7ce06f3f2e29dacf3d706dbc7ec9)
- Merge pull request #2 from rocketbase-io/dev [[acbce6]](08631a7aa45b6b08439abb299dbd1f0658acbce6)
- Merge pull request #1 from rocketbase-io/dev [[c49c70]](3b3c6fd5fa74be6ae27375a0f7cbf0bb61c49c70)

### v0.2.9
- remove whitespace from login request [[1fa584]](b8cdffc52d934e7f8bed061838e994b1c71fa584)
- update authors and changelog [[0862d7]](7cabff110d7edc041e41fe1fde33dec1180862d7)

### v0.2.8
- move header def after req open [[293313]](65c57fc62059988e6642a8284b39436aab293313)
- update authors and changelog [[6d6f28]](499fdfa9a4ef637a5b72cad0ae1c8fa2b16d6f28)

### v0.2.7
- add content type header to login request [[599d28]](b32bd54bfc5630848c9f2f492feed2e8e9599d28)
- update authors and changelog [[f8de8b]](44d42f77ab25bdec456dcc8857474be265f8de8b)

### v0.2.6


### v0.2.5
- use call instead of apply [[8c1663]](133e530bf5e08a7e63effc375dda6adbf28c1663)
- update authors and changelog [[61599c]](4aabf0decf3b09c8362e1e823f38b9734c61599c)

### v0.2.4


### v0.2.31
- make isLoggedIn async [[6a3433]](1db2b6ab2e554b04c670d11a9542c9cc3d6a3433)
- update authors and changelog [[4a905e]](3f25ab9d696f54fbe61947b6a669fb39584a905e)

### v0.2.30
- change maxinactivems logig from timespan to date [[ae4af6]](348db3d0f702c8ccbd6e7bf95c81544bebae4af6)
- update authors and changelog [[2ec3df]](2b9d607fcf4545f895b8486a676e54cb412ec3df)
- update authors and changelog [[d2449b]](86ec0596025beb676653a94c4efb04c795d2449b)
- 0.2.29 [[2121e3]](6756ce695f67a24e2f9e2661c3e9ed336e2121e3)
- update authors and changelog [[2618d2]](9b37e0edc06f14ac273e85be13cf5781952618d2)
- refresh token on expiry [[f0fc91]](794a83dd6e809686c41020c4bde6b8896cf0fc91)
- update authors and changelog [[13211f]](236943d7d80a7763e142571f2432c1bd1f13211f)
- 0.2.28 [[51ac59]](1976abc42336dd1910a435185dc468ac7751ac59)
- remove register stub [[0ace8a]](e3ec76128a8f80e902ac86bed462301dbd0ace8a)
- remove register stub [[92eafc]](84d826ab2ad05b51a8f9685d93da2494f292eafc)
- 0.2.27 [[fbf001]](f78907c5c7ce00b3c77c52e21fc4476b57fbf001)
- persist on logout [[d1fabf]](97a3f4e742e6f15a7b0fe03b27d78abebfd1fabf)
- update authors and changelog [[8eac50]](1f4983be3c0b718149fd1b1e601efcfe838eac50)
- 0.2.26 [[1dae8c]](3a97fc2b72b69f6f1ff4d10a22069dc4fd1dae8c)
- persist logout [[6ba1a6]](4b70eb7c81e76cb61c31ea2fb3287af8846ba1a6)
- update authors and changelog [[8ecca9]](7cd16938e70b0e78edb923747e139aeaac8ecca9)
- 0.2.25 [[660179]](bbfb39b19d1410104a440288f7fcb1d7d7660179)
- revive json dates [[1a89cd]](445c0066fff477b630341926d5bccb0e161a89cd)
- update authors and changelog [[ce665d]](580c4a6c85ffca3ee12feda3f5a049262fce665d)
- 0.2.24 [[95d148]](a8ffadcda6bd447d0924fbcada34b0b9c995d148)
- persist user reliably to localStorage [[7f2e4d]](20d683f5dfa6c8775826bddc4306d3c8347f2e4d)
- update authors and changelog [[7c24af]](23404952e0f635994ace45b9ed9c1f53567c24af)
- 0.2.23 [[f9fca9]](86844e7c311dc4180be8bb501b142dbf19f9fca9)
- cache open arguments for url checking [[820e2b]](a43c03dfc08dbf88e63ed72cc98cda3ac9820e2b)
- update authors and changelog [[1c292a]](f485c303c01002debd392ff6e0d6b991e41c292a)
- 0.2.22 [[bd0872]](a972bc8593ce9d7c2362e7ce2f123ca4b4bd0872)
- persist user info to local storage [[d2ac4b]](908a62639456f9c29785b7dabd0223884cd2ac4b)
- update authors and changelog [[52fb72]](eaff053d7ab63b9a1c864b1457d3c8c5a852fb72)
- 0.2.21 [[29ab16]](0cc7feed5365facf23dd8cac6beacc975629ab16)
- streamline user validation checks [[04f0f1]](2b5af2bf43b023e283800050e9c50554b304f0f1)
- update authors and changelog [[19c13a]](e398b6b6b91fcfdc1ceddaa3ceee4d96bc19c13a)
- 0.2.20 [[27f184]](678b7f188d9340dfa61d0cd4d338cb8e4127f184)
- exit waitForLogin immediately if the user is already logged in [[d2ae0f]](c2cec3ab7232ffc3ba2b8a514c10513a05d2ae0f)
- update authors and changelog [[613329]](83f71627341cae3745fb7d62f58c707b83613329)
- 0.2.19 [[68b76a]](d073b0c4674c7916e74f270d4889790a4468b76a)
- fix validation comparison [[a6529e]](fabc65b4bc5c7ff785a13ffe1a1f26d173a6529e)
- update authors and changelog [[42b5e0]](95f805c419b314a783d262f3b981e0a23d42b5e0)
- 0.2.18 [[a3f205]](392b443391605797e0762bdff2b5945a4fa3f205)
- fix typing path [[0bd9c1]](943fb3080b1e2c4e20523425e7c99d978c0bd9c1)
- update authors and changelog [[2c1789]](c8098cde941c6e8f653e25fc90ffb360742c1789)
- 0.2.17 [[53f766]](0eae0b88b8420f3d6911c4711c3573754d53f766)
- add typings to package.json [[f6be05]](769c7e95ecf19758530514dbc8aee742acf6be05)
- update authors and changelog [[e6e095]](938cdb9a9a040d161553b900e784463811e6e095)
- 0.2.16 [[62ffdd]](a72dfdafbb6190ac13720ea7ff7daffee862ffdd)
- allow for empty request body [[92211d]](d04c516b74ab580bd1b37cbf571a8c092a92211d)
- update authors and changelog [[03fd54]](91b2d3f8a57b1aeb7d6d40d3078acad04903fd54)
- 0.2.15 [[afd80f]](694d34d16942f2567edb19ef67a18d4cebafd80f)
- typo fix [[41e58e]](d7c761fa3db7c4afceeeac76adfe876c6341e58e)
- update authors and changelog [[2cb70f]](7856938e03a362c573c682d2dea1d8a6702cb70f)
- 0.2.14 [[563587]](926fe69e1b24fa56977595f1e419be8c38563587)
- typo fix [[a5c29d]](a235885ca369688daeed315c82acf7d7c9a5c29d)
- update authors and changelog [[8304f3]](54a439c8c896dc8c09426659df8fe0ece08304f3)
- 0.2.13 [[cbd7a0]](7fddeedab2c24ebc054f9f354921a1e988cbd7a0)
- pass body without array [[2ff314]](31ac8aa5305186d070d904ec223e8bcfb32ff314)
- update authors and changelog [[ff34ae]](4b895b26a3fc2f32651103c2443a6c7256ff34ae)
- 0.2.12 [[abf6fe]](0f045dfbce11f341fb916d640f336322a8abf6fe)
- move header def to onXHRSend [[e10403]](2a542ef6ffcbc53238ec638753cfdb9140e10403)
- update authors and changelog [[696042]](099d2b2e67692748b06743e1732587adc8696042)
- 0.2.11 [[51929c]](b7055511a8d4be0a292b172666045bbf7a51929c)
- fix typo [[4979ea]](2332124c8ff76df102b8b5a0944572642f4979ea)
- update authors and changelog [[99a6ae]](54d84118ccffaea8e1a20fb7acaa71332299a6ae)
- 0.2.10 [[9e051a]](2e28f190de5644611705c7987548dd45ab9e051a)
- wrap args as array [[10b714]](dc401a40186e597ee0c12e673d89d23f5710b714)
- update authors and changelog [[701d7c]](571f2e9ad9e4c9f93e6e1c7f3ca1292775701d7c)
- 0.2.9 [[7638f2]](db200adca41299336dadd41cfb5d23f9027638f2)
- remove whitespace from login request [[1fa584]](b8cdffc52d934e7f8bed061838e994b1c71fa584)
- update authors and changelog [[0862d7]](7cabff110d7edc041e41fe1fde33dec1180862d7)
- 0.2.8 [[0dc593]](b32b2d97935c5dcf4fa40105b944452c3d0dc593)
- move header def after req open [[293313]](65c57fc62059988e6642a8284b39436aab293313)
- update authors and changelog [[6d6f28]](499fdfa9a4ef637a5b72cad0ae1c8fa2b16d6f28)
- 0.2.7 [[08e5c7]](5466d69d26ee7881ac8fbd3ec415f072c508e5c7)
- add content type header to login request [[599d28]](b32bd54bfc5630848c9f2f492feed2e8e9599d28)
- update authors and changelog [[f8de8b]](44d42f77ab25bdec456dcc8857474be265f8de8b)
- 0.2.6 [[d0a43a]](d885a7f65265d2a6dc5caa2d5c107c6aeed0a43a)
- 0.2.5 [[bf3078]](684d01861965089ff110ee7dbe7e0b57f2bf3078)
- use call instead of apply [[8c1663]](133e530bf5e08a7e63effc375dda6adbf28c1663)
- update authors and changelog [[61599c]](4aabf0decf3b09c8362e1e823f38b9734c61599c)
- 0.2.4 [[2b3a4f]](631521cc2b0022ff4e28f42b28ca02509f2b3a4f)
- fix typo [[d7007c]](dd0097f557d963f85c83c5679d49757835d7007c)
- update authors and changelog [[df0413]](b2ae96fdbc267079b0e19678269bc2db8fdf0413)

### v0.2.3


### v0.2.29
- update authors and changelog [[2618d2]](9b37e0edc06f14ac273e85be13cf5781952618d2)
- refresh token on expiry [[f0fc91]](794a83dd6e809686c41020c4bde6b8896cf0fc91)
- update authors and changelog [[13211f]](236943d7d80a7763e142571f2432c1bd1f13211f)

### v0.2.28
- remove register stub [[0ace8a]](e3ec76128a8f80e902ac86bed462301dbd0ace8a)
- remove register stub [[92eafc]](84d826ab2ad05b51a8f9685d93da2494f292eafc)

### v0.2.27
- persist on logout [[d1fabf]](97a3f4e742e6f15a7b0fe03b27d78abebfd1fabf)
- update authors and changelog [[8eac50]](1f4983be3c0b718149fd1b1e601efcfe838eac50)

### v0.2.26
- persist logout [[6ba1a6]](4b70eb7c81e76cb61c31ea2fb3287af8846ba1a6)
- update authors and changelog [[8ecca9]](7cd16938e70b0e78edb923747e139aeaac8ecca9)

### v0.2.25
- revive json dates [[1a89cd]](445c0066fff477b630341926d5bccb0e161a89cd)
- update authors and changelog [[ce665d]](580c4a6c85ffca3ee12feda3f5a049262fce665d)

### v0.2.24
- persist user reliably to localStorage [[7f2e4d]](20d683f5dfa6c8775826bddc4306d3c8347f2e4d)
- update authors and changelog [[7c24af]](23404952e0f635994ace45b9ed9c1f53567c24af)

### v0.2.23
- cache open arguments for url checking [[820e2b]](a43c03dfc08dbf88e63ed72cc98cda3ac9820e2b)
- update authors and changelog [[1c292a]](f485c303c01002debd392ff6e0d6b991e41c292a)

### v0.2.22
- persist user info to local storage [[d2ac4b]](908a62639456f9c29785b7dabd0223884cd2ac4b)
- update authors and changelog [[52fb72]](eaff053d7ab63b9a1c864b1457d3c8c5a852fb72)

### v0.2.21
- streamline user validation checks [[04f0f1]](2b5af2bf43b023e283800050e9c50554b304f0f1)
- update authors and changelog [[19c13a]](e398b6b6b91fcfdc1ceddaa3ceee4d96bc19c13a)

### v0.2.20
- exit waitForLogin immediately if the user is already logged in [[d2ae0f]](c2cec3ab7232ffc3ba2b8a514c10513a05d2ae0f)
- update authors and changelog [[613329]](83f71627341cae3745fb7d62f58c707b83613329)
- 0.2.19 [[68b76a]](d073b0c4674c7916e74f270d4889790a4468b76a)
- fix validation comparison [[a6529e]](fabc65b4bc5c7ff785a13ffe1a1f26d173a6529e)
- update authors and changelog [[42b5e0]](95f805c419b314a783d262f3b981e0a23d42b5e0)
- 0.2.18 [[a3f205]](392b443391605797e0762bdff2b5945a4fa3f205)
- fix typing path [[0bd9c1]](943fb3080b1e2c4e20523425e7c99d978c0bd9c1)
- update authors and changelog [[2c1789]](c8098cde941c6e8f653e25fc90ffb360742c1789)
- 0.2.17 [[53f766]](0eae0b88b8420f3d6911c4711c3573754d53f766)
- add typings to package.json [[f6be05]](769c7e95ecf19758530514dbc8aee742acf6be05)
- update authors and changelog [[e6e095]](938cdb9a9a040d161553b900e784463811e6e095)
- 0.2.16 [[62ffdd]](a72dfdafbb6190ac13720ea7ff7daffee862ffdd)
- allow for empty request body [[92211d]](d04c516b74ab580bd1b37cbf571a8c092a92211d)
- update authors and changelog [[03fd54]](91b2d3f8a57b1aeb7d6d40d3078acad04903fd54)
- 0.2.15 [[afd80f]](694d34d16942f2567edb19ef67a18d4cebafd80f)
- typo fix [[41e58e]](d7c761fa3db7c4afceeeac76adfe876c6341e58e)
- update authors and changelog [[2cb70f]](7856938e03a362c573c682d2dea1d8a6702cb70f)
- 0.2.14 [[563587]](926fe69e1b24fa56977595f1e419be8c38563587)
- typo fix [[a5c29d]](a235885ca369688daeed315c82acf7d7c9a5c29d)
- update authors and changelog [[8304f3]](54a439c8c896dc8c09426659df8fe0ece08304f3)
- 0.2.13 [[cbd7a0]](7fddeedab2c24ebc054f9f354921a1e988cbd7a0)
- pass body without array [[2ff314]](31ac8aa5305186d070d904ec223e8bcfb32ff314)
- update authors and changelog [[ff34ae]](4b895b26a3fc2f32651103c2443a6c7256ff34ae)
- 0.2.12 [[abf6fe]](0f045dfbce11f341fb916d640f336322a8abf6fe)
- move header def to onXHRSend [[e10403]](2a542ef6ffcbc53238ec638753cfdb9140e10403)
- update authors and changelog [[696042]](099d2b2e67692748b06743e1732587adc8696042)
- 0.2.11 [[51929c]](b7055511a8d4be0a292b172666045bbf7a51929c)
- fix typo [[4979ea]](2332124c8ff76df102b8b5a0944572642f4979ea)
- update authors and changelog [[99a6ae]](54d84118ccffaea8e1a20fb7acaa71332299a6ae)
- 0.2.10 [[9e051a]](2e28f190de5644611705c7987548dd45ab9e051a)
- wrap args as array [[10b714]](dc401a40186e597ee0c12e673d89d23f5710b714)
- update authors and changelog [[701d7c]](571f2e9ad9e4c9f93e6e1c7f3ca1292775701d7c)
- 0.2.9 [[7638f2]](db200adca41299336dadd41cfb5d23f9027638f2)
- remove whitespace from login request [[1fa584]](b8cdffc52d934e7f8bed061838e994b1c71fa584)
- update authors and changelog [[0862d7]](7cabff110d7edc041e41fe1fde33dec1180862d7)
- 0.2.8 [[0dc593]](b32b2d97935c5dcf4fa40105b944452c3d0dc593)
- move header def after req open [[293313]](65c57fc62059988e6642a8284b39436aab293313)
- update authors and changelog [[6d6f28]](499fdfa9a4ef637a5b72cad0ae1c8fa2b16d6f28)
- 0.2.7 [[08e5c7]](5466d69d26ee7881ac8fbd3ec415f072c508e5c7)
- add content type header to login request [[599d28]](b32bd54bfc5630848c9f2f492feed2e8e9599d28)
- update authors and changelog [[f8de8b]](44d42f77ab25bdec456dcc8857474be265f8de8b)
- 0.2.6 [[d0a43a]](d885a7f65265d2a6dc5caa2d5c107c6aeed0a43a)
- 0.2.5 [[bf3078]](684d01861965089ff110ee7dbe7e0b57f2bf3078)
- use call instead of apply [[8c1663]](133e530bf5e08a7e63effc375dda6adbf28c1663)
- update authors and changelog [[61599c]](4aabf0decf3b09c8362e1e823f38b9734c61599c)
- 0.2.4 [[2b3a4f]](631521cc2b0022ff4e28f42b28ca02509f2b3a4f)
- fix typo [[d7007c]](dd0097f557d963f85c83c5679d49757835d7007c)
- update authors and changelog [[df0413]](b2ae96fdbc267079b0e19678269bc2db8fdf0413)
- 0.2.3 [[d4b35a]](8501ab861075520e2b435670ffb223088ad4b35a)
- update authors and changelog [[b15595]](5095cd023c66414aba4733c62e37c953ddb15595)

### v0.2.2


### v0.2.19
- fix validation comparison [[a6529e]](fabc65b4bc5c7ff785a13ffe1a1f26d173a6529e)
- update authors and changelog [[42b5e0]](95f805c419b314a783d262f3b981e0a23d42b5e0)

### v0.2.18
- fix typing path [[0bd9c1]](943fb3080b1e2c4e20523425e7c99d978c0bd9c1)
- update authors and changelog [[2c1789]](c8098cde941c6e8f653e25fc90ffb360742c1789)

### v0.2.17
- add typings to package.json [[f6be05]](769c7e95ecf19758530514dbc8aee742acf6be05)
- update authors and changelog [[e6e095]](938cdb9a9a040d161553b900e784463811e6e095)

### v0.2.16
- allow for empty request body [[92211d]](d04c516b74ab580bd1b37cbf571a8c092a92211d)
- update authors and changelog [[03fd54]](91b2d3f8a57b1aeb7d6d40d3078acad04903fd54)

### v0.2.15
- typo fix [[41e58e]](d7c761fa3db7c4afceeeac76adfe876c6341e58e)
- update authors and changelog [[2cb70f]](7856938e03a362c573c682d2dea1d8a6702cb70f)

### v0.2.14
- typo fix [[a5c29d]](a235885ca369688daeed315c82acf7d7c9a5c29d)
- update authors and changelog [[8304f3]](54a439c8c896dc8c09426659df8fe0ece08304f3)

### v0.2.13
- pass body without array [[2ff314]](31ac8aa5305186d070d904ec223e8bcfb32ff314)
- update authors and changelog [[ff34ae]](4b895b26a3fc2f32651103c2443a6c7256ff34ae)

### v0.2.12
- move header def to onXHRSend [[e10403]](2a542ef6ffcbc53238ec638753cfdb9140e10403)
- update authors and changelog [[696042]](099d2b2e67692748b06743e1732587adc8696042)

### v0.2.11
- fix typo [[4979ea]](2332124c8ff76df102b8b5a0944572642f4979ea)
- update authors and changelog [[99a6ae]](54d84118ccffaea8e1a20fb7acaa71332299a6ae)

### v0.2.10
- wrap args as array [[10b714]](dc401a40186e597ee0c12e673d89d23f5710b714)
- update authors and changelog [[701d7c]](571f2e9ad9e4c9f93e6e1c7f3ca1292775701d7c)
- 0.2.9 [[7638f2]](db200adca41299336dadd41cfb5d23f9027638f2)
- remove whitespace from login request [[1fa584]](b8cdffc52d934e7f8bed061838e994b1c71fa584)
- update authors and changelog [[0862d7]](7cabff110d7edc041e41fe1fde33dec1180862d7)
- 0.2.8 [[0dc593]](b32b2d97935c5dcf4fa40105b944452c3d0dc593)
- move header def after req open [[293313]](65c57fc62059988e6642a8284b39436aab293313)
- update authors and changelog [[6d6f28]](499fdfa9a4ef637a5b72cad0ae1c8fa2b16d6f28)
- 0.2.7 [[08e5c7]](5466d69d26ee7881ac8fbd3ec415f072c508e5c7)
- add content type header to login request [[599d28]](b32bd54bfc5630848c9f2f492feed2e8e9599d28)
- update authors and changelog [[f8de8b]](44d42f77ab25bdec456dcc8857474be265f8de8b)
- 0.2.6 [[d0a43a]](d885a7f65265d2a6dc5caa2d5c107c6aeed0a43a)
- 0.2.5 [[bf3078]](684d01861965089ff110ee7dbe7e0b57f2bf3078)
- use call instead of apply [[8c1663]](133e530bf5e08a7e63effc375dda6adbf28c1663)
- update authors and changelog [[61599c]](4aabf0decf3b09c8362e1e823f38b9734c61599c)
- 0.2.4 [[2b3a4f]](631521cc2b0022ff4e28f42b28ca02509f2b3a4f)
- fix typo [[d7007c]](dd0097f557d963f85c83c5679d49757835d7007c)
- update authors and changelog [[df0413]](b2ae96fdbc267079b0e19678269bc2db8fdf0413)
- 0.2.3 [[d4b35a]](8501ab861075520e2b435670ffb223088ad4b35a)
- update authors and changelog [[b15595]](5095cd023c66414aba4733c62e37c953ddb15595)
- 0.2.2 [[92922c]](1c7c9a81ea996e0503641b03f0bd380f5992922c)
- update authors and changelog [[ce7f52]](466b275944f2bea338810ccbd1c1e5988fce7f52)
- update authors and changelog [[c4d097]](4b229d1ceb738bca240c2a4512894d94c4c4d097)

### v0.2.1
- compile to es6 compliance level [[8f1661]](a94362760bde322048ed1487023f9a05e78f1661)
- update authors and changelog [[ff3d57]](156cce8e1257323330990cff1c18694362ff3d57)
- add mailmap file to remove duplicate authors [[65ce5a]](f411328c90a6e9a2f6edbda4c9792fccef65ce5a)
- update authors and changelog [[5cc26a]](4cde07a3c2eb7b64f84d092345995b37155cc26a)

### v0.2.0
- add options for auto refresh commons auth jwt [[524c95]](1289b9cec369c9f2fc184739510252df92524c95)
- add commons auth login strategy, jwt parsing [[edb373]](9083ebd73d68cc0a40eb964e13907de31fedb373)
- update authors and changelog [[dccf85]](a3041f3a667256e14992e616f72c5f2fc8dccf85)

### v0.1.1
- make tslint rules a dev dep [[4390b8]](d7b7dfa3f77c6849733c1071f50237dd534390b8)
- update authors and changelog [[220db4]](5a7839b4eb0f0051a53b52e19333220d15220db4)
- linter fixes [[48d003]](70afa6e25852abcfadedb11c4872b7589848d003)
- update authors and changelog [[2047d0]](ae23e4d9e2d3a0313b15b1d35a1298ab822047d0)

### v0.1.0
- add login strategy, eventing [[a66084]](ca73e720b8eeeeae3be588c835e6a21f84a66084)
- update authors and changelog [[c92453]](94eb65da92e360c10e8a0d6737f4e9ab00c92453)
- change npm registry [[cd8cea]](d725d92033ed67e34ef7824614222bf8bbcd8cea)
- update authors and changelog [[3f7725]](48fde35c319092dbe3d1853ee2f9f9d1933f7725)
- add registry config to package.json [[67c13f]](3c60b9d27ac7283093371d2366925015a367c13f)

### v0.0.3
- 0.0.2 [[e2d6e6]](173c1518623098a9492d692fa2d99dbc21e2d6e6)
- add prepublish hook [[ae18ac]](3b4e79753f952b8e6e8f2263cd70c0437fae18ac)

### v0.0.2
- Update authors and changelog [[43b707]](7a85bf0e29644f34dbfd1c49bf629c4cb543b707)
- add skeleton user interface and class [[047c0f]](987915f548c559f5949d7f16c02343e103047c0f)
- add rocketbase linter rules [[eb7700]](651f8a678082ec73191045e42aa93bf657eb7700)
- update project files [[41d2ef]](ddd41a4765339bc5da26bf9e3a356838d941d2ef)
- update gitignore [[584322]](88266bf8dd9b36680863e9a3796c7c146f584322)
- Add request interceptor logic, skeletonkey class [[a11655]](21d6fbf5fa3d109ba93e24edb01a42ff1fa11655)
- Initial commit [[6183b2]](e8b63334be9b51e465e6f780f355bb7a7d6183b2)

###### Generated on 2019-10-17T07:09:19.684Z | Made with @propero/ngm