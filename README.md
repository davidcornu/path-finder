# Pathfinder

Simple named routes for [Express](https://github.com/visionmedia/express).

![![Build Status](https://api.travis-ci.org/davidcornu/path-finder.png)](https://travis-ci.org/davidcornu/path-finder)

## Usage

1. Install via [npm](https://npmjs.org)

    ```
    $ npm install path-finder
    ```

2. Extend your Express `app`

    ```javascript
    var express = require('express');
    var app = express();
    require('path-finder').extend(app);
    ```

3. Profit

    ```javascript
    // Standard Express routing does not change
    app.get('/users', function(){...})

    // Passing in a name stores the path
    app.get('/home', 'home', function(){...})
    app.post('/user/:id', 'user', function(){...});

    // Paths can be accessed via
    app.path('home');           //-> '/home'
    app.path('user', {id: 10}); //-> '/user/10'

    // Passing in additional options adds them to the query string
    app.path('home', {p: 1});   //-> '/home?p=1'

    // Ad-hoc paths can also be defined
    app.addPath('/promotions', 'promotions');
    app.path('promotions');     //-> '/promotions'

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
