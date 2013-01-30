# Pathfinder

Simple named routes for [Express](https://github.com/visionmedia/express).

[![Build Status](https://api.travis-ci.org/davidcornu/path-finder.png)](https://travis-ci.org/davidcornu/path-finder)

## Deprecation Warning

The following methods will print deprecation messages when used as extending the
express `app` variable is error prone and doesn't really provide a better interface,
especially when calling routes from controllers (`req.app.p('login')` is a lot
more verbose than simply requiring `path-finder`).

## Usage

1. Install via [npm](https://npmjs.org)

    ```
    $ npm install path-finder
    ```

2. Extend your Express `app`

    ```javascript
    var express = require('express');
    var app = express();
    var pathFinder = require('path-finder');
    pathFinder.extend(app);
    ```

3. Profit

    ```javascript
    // Standard Express routing does not change
    app.get('/users', function(){...})

    // Passing in a name stores the path
    app.get('/home', 'home', function(){...})
    app.post('/user/:id', 'user', function(){...});

    // Paths can be accessed via
    pathFinder.path('home');           //-> '/home'
    pathFinder.path('user', {id: 10}); //-> '/user/10'

    // Passing in additional options adds them to the query string
    pathFinder.path('home', {p: 1});   //-> '/home?p=1'

    // Ad-hoc paths can also be defined
    pathFinder.addPath('promotions', '/promotions');
    pathFinder.path('promotions');     //-> '/promotions'
    ```

    A `p` method is also made available to views

    ```
    a(href=p('promotions'))
      | View our promotions
    ```

## Development

Clone the repo

```
$ git clone git@github.com:davidcornu/path-finder.git
```

Install dependencies

```
$ npm install
```

Run the tests

```
$ npm test
```