zipfian
=======

Zipf Distribution Generation for Node.js

[![zipf distribution](https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Zipf_distribution_PMF.png/325px-Zipf_distribution_PMF.png)](https://en.wikipedia.org/wiki/Zipf's_law)

Usage
-----

To generate a zipf generator, create an instance of ZipfGenerator, and then get your numbers!

```javascript
var zipfGenerator = require('zipfian').getGenerator(1000);

console.log(zipfGenerator.next());
```

If you want more control over the generator parameters, you can create the generator yourself.

```javascript

var Generator = require('zipfian').ZipfGenerator;

var zipfGenerator = new Generator(min, max, zipfConstant);
```


Bugs + Contributing
-------------------

Please submit bugs or feature requests in github issues. In particular, this implementation
is missing the ability to resize the generator found in previous implementation. Contributions
are welcome!

Todo
----

 - Resizing a generator
 - Scrambled generator
