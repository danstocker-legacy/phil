Phil
====

*ES5 polyfill*

Provides ECMAScript 5 compatibility on specific methods of native JavaScript objects. Some are full rewrites, like `Object.create` or `Function.bind`, others are workarounds for browser quirks, like argument handling in `Array.sort`, or negative indexes for `String.substr`.

Getters and setters are only partially emulated in browsers where no substitute is available (eg. IE8). Here the chosen behavior is that getters and setters are accepted by `Object.defineProperty`, but the getter is immediately evaluated and its result assigned to the property as value.

At this point Phil is not a complete polyfill, as it implements only those methods that are required by [Troop](https://github.com/production-minds/troop)-based [libraries](https://github.com/danstocker?tab=repositories).
