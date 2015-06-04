[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

# Description

This component is responsible for creating the HTML necessary for a common Encore layout. It builds out the main navigation, plus breadcrumbs and page titles.

# Usage

For apps that want to use the default Encore navigation, usage is pretty simple. In your index.html file, add the `rx-app` directive inside your app:

    <body ng-app="myApp">
        <rx-app>
            <ng-view></ng-view>
        </rx-app>
    </body>

By including `ng-view`, your view content will be added inside the directive. This makes setting up views for each page much simpler, since you don't have to include `rx-app` in each view.

Inside your view, you'll likely want to use `rx-page` to wrap your content. See the `rx-page` docs for more information on this.

# rxApp Navigation

By default, the EncoreUI left-hand navigation is loaded at runtime from a separate resource. This source can be changed, and there are many options to control the navigation from an app level.

## Accessing route information

Sometimes it's helpful to have the current route information available for menu items. For example, re-using the current params for path building.

To help with this, $route is exposed on the scope of all menu items. [`$route` provides many details on the current view](http://devdocs.io/angular/ngroute.$route), including the ability to access the current controller and scope for the view.

To see this in action, check out the 'childVisibility' property for Account-level Tool in `encoreNav`.

## Accessing properties on $rootScope

If you have a property available on the `$rootScope` of your app that the menu data needs to access, [you can reference `$rootScope` via `$root`](http://stackoverflow.com/questions/22216441/what-is-the-difference-between-scope-root-and-rootscope-angular-js). See the demo for an example of this.

## Dynamically updating the menu

By default, rxApp will create the navigation menu based on the routes defined in the 'encoreNav' value. This menu is built using the rxAppRoutes service.

To update a route, use the `setRouteByKey` function on the rxAppRoutes service:

    rxAppRoutes.setRouteByKey('myKey', {
        linkText: 'myUpdatedRoute'
    })

You would normally either set this in your app's `.run` function, or in a specific controller.

## Custom Menus

If you'd like to create an entirely custom menu, you can pass that data in to the `rx-app` directive via the `menu` attribute. View the demo for an example of this.

# Sub-directives

## rx-page

You'll likely want to use `rx-page` inside your template view. For example, inside a 'myView.html' file:

    <rx-page title="'Example Page'">
        Here is my content
    </rx-page>

`rx-page` is used to create a common wrapper for specific page views. It automatically adds the breadcrumbs and page title/subtitle (if specified), along with the correct styling.

Both the `title` and `subtitle` attributes accept an Angular expression, which can be a string (shown in the previous example) or a scope property. This string/property can accept other expressions, enabling you to build custom titles. The demo has an example of this usage.

If you wish to use arbitrary HTML in your title, you can use the `unsafe-html-title` attribute instead of `title`. This is considered "unsafe" because it is
capable of executing arbitrary Javascript, so you must ensure that you trust the source of the title. The "Customized Page Title" in the demo shows the use of HTML tags.

In either case (`title` or `unsafe-html-title`), the document title (i.e. visible in the browser tab) will be set to your chosen title. If you use `unsafe-html-title`, all HTML tags will be stripped before setting the document title.

### Account Info below Breadcrumbs

`rxPage` integrates the [rxAccountInfo](#/component/rxAccountInfo) component, to draw the Account Info box directly underneath the `rxBreadcrumbs`. This is opt-in. By default, it will not appear. To enable it, pass the `account-number="..."` attribute to `<rx-page>` in your template, i.e

    <rx-page account-number="{{ accountNumber }}">

As noted on the [rxAccountInfo](#/component/rxAccountInfo) demo page, this directive requires that `SupportAccount`, `Encore` and `Teams` services are available to the Angular Dependency Injection system. These are *not* provided by EncoreUI, but are available in an internal Rackspace repository.


### Status tags

A final attribute that `rx-page` accepts is `status`. This takes a string, and has the effect of drawing a status "tag" beside the page title. The "Customized rxApp" demo shows the use of this with the `"alpha"` tag.

The framework currently provides `"alpha"` and `"beta"` tags, but any product can specify their own custom tags using the `rxStatusTagsProvider`. It currently
has one method, `addStatus`, which takes an unique `key` for the new tag, the `class` it should use in the HTML, and the `text` that will be drawn. All custom
tags are drawn inside of a `<span>`, essentially as:

    <span class="status-tag {{ class }}">{{ text }}</span>

To use this, do the following in your application's `.config()` method:

    rxStatusTagsProvider.addStatus({ key: 'gamma', class: 'alpha-status', text: 'Hello World!' });

This will create a new status tag called `"gamma"`, which you can pass to `rx-page` as:

    <rx-page title="'Some Title'" status="gamma">

And the title will appear with a `Hello World!` tag beside it, styled the same way as our `"alpha"` status tag is styled. You can also define your own CSS style in your application and use those instead, passing it as the `class` value to `addStatus()`.

All the tags are accessible inside of [rxBreadcrumbs](./#/component/rxBreadcrumbs) as well. Any breadcrumb that was created with `useStatusTag: true` will automatically receive the same status tag as you passed to `<rx-page>`.

### .page-actions

A `page-actions` class is provided by rx-app to easily add custom page actions to the top right of a page. For example:

    <rx-page title="'Servers Overview'">
        <div class="page-actions">
            <a href="/create" class="link-action msg-action">Create New Server</a>
        </div>
        <img src="http://cdn.memegenerator.net/instances/500x/48669250.jpg" alt="Look at all these servers there are so many"
    </rx-page>

## rx-app-nav and rx-app-nav-item

These two directives are responsible for creating the menu in the left sidebar. They're not intended for use outside of the rx-app template code.

# Common Styling

The rxApp common.less file defines many base CSS rules and classes for app use. Included in this is [normalize.css](http://necolas.github.io/normalize.css/). This helps create a consistent starting point for styles across all browsers.

## Fonts

The EncoreUI default font is Roboto. This is used for all text on the page and is loaded via Google Fonts. Be sure your app includes the following line:

```
<link href="https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,700,700italic" rel="stylesheet" type="text/css" />
```

# Navigation Menu JSON Structure
EncoreUI applications, by default, load the navigation menu from JSON defined in the [encore-ui-nav project](https://github.com/rackerlabs/encore-ui-nav). You can specify that a different JSON file be used (see the demo below), but a certain structure is expected for the JSON.

## Outer structure/Sections
The JSON consists of an array of objects, with each object representing a "section" in the nav. The two demos at the bottom of this page each only have one section, `"All Tools"` and `"Example Menu"`, respectively. As such, the JSON for each of them is an array with one object in it. The default EncoreUI nav menu only has one section `"All Tools"`, and individual products should not be expecting to add their own sections.

The application that this documentation lives in has three sections, which you can see if you look at the current left nav menu. They are `EncoreUI`, `Design Styleguide` and `All Components`.

### `title` (required)

Each section specified in this array is required to have a `title` attribute, i.e.

```
navJSON = [
    {
        "title": "Section 1"
    }, { 
        "title": "Section 2"
    }
]
```

### `type` (optional)
Each section can optionally have a `type` attribute. If present, a class with the value `nav-section-TYPE` will be applied in the nav, otherwise `nav-section-all` will be applied.

```
navJSON = [
    {
        "title": "Section 1",
        "type": "highlight"
    }, { 
        "title": "Section 2"
    }
]
```

In this example, `Section 1` will have a `nav-section-highlight` class applied to it, while `Section 2` will receive the default `nav-section-all` class.

The default Encore nav menu does not currently use the `type` property, and products being added to Encore should avoid it.

### `children` (optional)

A section's `children` attribute details the first level of navigation items that live within the section. This is defined as an array of objects, where each object represents an "item" to be displayed in the nav (and the structure of the objects/items themselves will be defined in the Navigation Items section below). As an example, this could look like:

```
navJSON = [
    {
        "title": "Section 1",
        "type": "highlight",
        "children": [
            {
                "href": "/overview",
                "key": "overview",
                "linkText": "Overview"
            }, {
                "href": "/about",
                "key": "about"
                "linkText": "About"
            },
        ]
    }, { 
        "title": "Section 2",
        "children": [
            {
                "href": "/overview2",
                "linkText": "Section 2 Overview"
            }
        ]
    }
]
```

These `children` will be able to have further `children` nested inside them, accessible via an expand/collapse chevron, but it is important to note that the top level `children` in each section will _always_ be displayed.

## Navigation Items
A Navigation Item is an object that exists in a `children` array, and represents a clickable item. These items have many optional attributes, and can themselves contain `children` attributes.

Their only required attribute is `linkText`. The object will also need _one_ of the `href` or `children` attributes, but these two should be mutually exclusive.

### `linkText` (required)

The `linkText` attribute defines what text will be shown for the item in the nav menu. This was shown in the example above,

```
    {
        "title": "Section 1",
        "type": "highlight",
        "children": [
            {
                "href": "/overview",
                "key": "overview",
                "linkText": "Overview"
            }, {
                "href": "/about",
                "key": "about",
                "linkText": "About"
            },
        ]
```

These items will be displayed in the nav with `Overview` and `About` text.

### `key` (required for top-level items)
The `key` attribute is used to provide an unique identifier for individual navigation items. If you are introducing a new top-level item into the nav menu, then the `key` is required. It is optional for any nested items. There are two possible reasons you would want to provide this for nested items:

 1. A nav item with a `key` will have the class `rx-app-key-{{ item.key }}` applied to it
 2. `rxAppRoutes` exposes a few methods for working with the key, including `isActiveByKey()` and `setRouteByKey()`

In general, you should not need to provide a `key` attribute for any nested children. We try to avoid custom styling inside the nav, so the automatic class application shouldn't be necessary. And the `rxAppRoutes` methods are _generally_ only used internally by EncoreUI.


### `href` (optional)

The `href` attribute is used to assign a URL to the item, which will be navigated to when clicked. If the item has a `children` attribute, you normally would not include `href`, because you want the children to expand/collapse when this item is clicked, rather than navigating away to somewhere else.

For Encore products within Rackspace, we keep the products on the same domain (encore.rackspace.com), but give each product its own top-level path, i.e. `encore.rackspace.com/foo`, `encore.rackspace.com/bar`. By doing this, the `href` values can simply be entered as `/foo` and `/bar`. And more importantly, `/foo` and `/bar` can be _completely separate Angular applications_. Both applications are available in the nav, but clicking on `/foo` will load a new Angular application, while clicking on `/bar` loads a brand new Angular application.

This allows applications to be developed and deployed independently from each other. The nav is aware of all the applications, but they do not have to be aware of each other.

An extra feature of `href` is that you can put variables into it, that will be interpolated with the current `$route.current.pathParams`. Thus, you can do something like:

```
    {
        "title": "Section 1",
        "type": "highlight",
        "children": [
            {
                "href": "/overview",
                "key": "overview",
                "linkText": "Overview"
            }, {
                "href": "/about/{{foobar}}",
                "key": "about",
                "linkText": "About"
            },
        ]
```
If `foobar` is currently in `$route.current.pathParams`, then its value will automatically be inserted into the final URL.


### `children` (optional)
If an item doesn't have an `href` attribute, it's probably because it has child items via the `children` attribute.

```
    {
        "title": "Section 1",
        "type": "highlight",
        "children": [
            {
                "href": "/overview",
                "key": "overview",
                "linkText": "Overview"
            }, {
                "href": "/about",
                "key": "about",
                "linkText": "About"
            }, {
                "linkText": "People",
                "children": [
                    {
                        "href": "/people/bob",
                        "linkText": "Bob",
                    }, {
                        "href": "/people/sue",
                        "linkText": "Sue"
                    }
        
                ]
            }
        ]
```

This example shows a new item `People`, which has no `href` of its own, but does have `children`, which contains two new items, each with their own unique `href`.

By default, the `Bob` and `Sue` items will not be visible, and in the nav, `People` will automatically have a chevron attached. When clicked, it will expand to show the `children` items.

As an aside, in this example, there will likely be one Angular application at `/people`, which is resonsible for routing `/people/bob` and `/people/sue`, while `/overview` and `/about` would probably be two different Angular applications.


### `visibility` and `childVisibility` (optional)
The `visibility` attribute is used to control whether or not an individual nav item is visible to the user. If `visibility` is not specified, then by default the item is always visible. The `childVisibility` attribute takes all the same possible values as `visibility`, but is used to determine whether the items in `children` should be visible.

`visibility` can take a few types of values. The original form used in EncoreUI was to pass an expression, filtering values with `rxEnvironmentMatch`, i.e.

```
"visibility": "('unified-preprod' | rxEnvironmentMatch) || ('local' | rxEnvironmentMatch)",
```

This expression would be evaluated, checking if the user is currently viewing the app in the `unified-preprod` environment or the `local` environment, and only display the item if one of those was true. (See [rxEnvironment](#/rxEnvironment) for more details on environemnts). This was used to prevent items from being displayed in a production environment if they were only currently available in staging.

This use has somewhat tailed off. We now have different JSON files for each environment, so checking the current environment is not necessary.

Another technique for visibility is to use a predefined set of visibility functions that exist in the framework. These include `rxPathParams` and `rxHideIfUkAccount`. 

To use these, you pass an array to `visibility`, with the first argument being the name of the function to use (as a string), and the second argument as an optional object describing the parameters to pass to the function.

For instance, `rxPathParams` is used to check if a particular parameter is present in the current route. The syntax is as follows:

```
"visibility": ["rxPathParams", { "param": "accountNumber" }], 
```

This means "only show this item if `accountNumber` is present in the current route.

`rxPathParams` is typically used with `childVisibility`, not `visibility`. For instance, the `Account` section in Encore will by default show a search directive (discussed later), and none of its children are visible. After entering a search term, an account number is found, and inserted into the route. At that point, all of the children under `Account` will be visible, as they all require an `accountNumber` to correctly operate.

### `childHeader` (optional)

The `childHeader` attribute is used to specify an HTML header to be placed above the `children` in an expanded area (and thus having a `childHeader` attribute requires having a `children` attribute).

`childHeader` receives HTML content as a string, and uses [rxCompile](#/component/rxCompile) to compile and insert the content above the `children` items. The compiled content will be linked against the current scope, allowing you to do things like:

```
    {
        "title": "Section 1",
        "type": "highlight",
        "childHeader": "<strong>Current Account:</strong><span class='current-result'>#{{route.current.pathParams.accountNumber}}</span>",
        "children": [
            {
                "href": "/overview",
                "key": "overview",
                "linkText": "Overview"
            }, {
                "href": "/about",
                "key": "about",
                "linkText": "About"
            }, {
                "linkText": "People",
                "children": [
                    {
                        "href": "/people/bob",
                        "linkText": "Bob"
                    }, {
                        "href": "/people/sue",
                        "linkText": "Sue"
                    }
        
                ]
            }
        ]
```

This example will pull the `accountNumber` from the `pathParams`, and insert `Current Account: 1234` above the children.



### `roles` (optional)

In addition to the `visibility` criteria described above, you can also restrict which items are shown to a user based on the LDAP roles of that user. This is done via the `roles` attribute, which takes a single object as its value. This object can be used to specify that a user requires _all_ roles from a certain set, or _any_ role from a certain set, to see an item. For example:

```
    {
        "title": "Section 1",
        "type": "highlight",
        "childHeader": "<strong>Current Account:</strong><span class='current-result'>#{{route.current.pathParams.accountNumber}}</span>",
        "children": [
            {
                "href": "/overview",
                "key": "overview",
                "linkText": "Overview"
            }, {
                "href": "/about",
                "key": "about",
                "linkText": "About"
            }, {
                "linkText": "People",
                "children": [
                    {
                        "href": "/people/bob",
                        "linkText": "Bob",
                        "roles": { "all": ["role1", "role2"] }
                    }, {
                        "href": "/people/sue",
                        "linkText": "Sue"
                        "roles": { "any": ["role1", "role2", "role3"] }
                    }
        
                ]
            }
        ]
```

In this example, the `Bob` item can only be seen by users who have _both_ `role1` and `role2` in their LDAP roles, while the `Sue` item can only be seen by users who have _at least one_ of `role1`, `role2`, or `role3`. Please keep in mind that you [can't do real security in front-end JavaScript](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/). Do not rely on `roles` as a security feature. `roles` is purely to enhance user experience, to prevent them from seeing items that they won't have permissions to access anyway. All the data is still sent to the browser. A user who knows how to use the dev tools will be able to see the full list. LDAP role-based security must still happen on the server-side.


### `directive` (optional)
The optional `directive` attribute receives the name of a directive in its dash-delimited format (i.e. uses `"rx-account-search"` instead of `"rxAccountSearch"`). If this directive is available, then the navigation menu will have that directive inserted and rendered directly under the `linkText` for the nav item.

The most important line in the previous paragraph is `If this directive is available...`. Let's say we add a new `Support` item to the nav, where each of its children are supposed to render its own custom search directive:

```
   }, {
        "linkText": "Support",
        "children": [
            {
                "linkText": "People Support",
                "directive": "people-search"
            }, {
                "linkText": "Machine Support",
                "directive": "machine-search"
            }
        ]
    }
```

The _intent_ is that when the user clicks on "Support", the menu will expand to show "People Support" and "Machine Support" child items, and each will contain a search box, defined by the `people-search` and `machine-search` directives, respectively.

But where do those directives come from? `rxApp` provides some legacy directives that are available to the nav, including `rxAppSearch`, `rxAccountUsers`, etc. But `people-search` does not come from `rxApp`. And recall from the `href` section that the nav might be defining multiple different Angular applications. What if "Support" is defined in your application, ad that's where `people-search` comes from, but the user is currently in a different application? That different application won't have `people-search` defined anywhere, so when the user clicks on "Support", the directives won't be available.

The solution to this is to ensure that these elements with directives _also_ have an `href`, and those URLs belong to Angular applications that define those directives. i.e.


```
   }, {
        "linkText": "Support",
        "key": "support",
        "children": [
            {
                "linkText": "People Support",
                "directive": "people-search"
                "href": "/support/people-support",
            }, {
                "linkText": "Machine Support",
                "directive": "machine-search"
                "href": "/support/machine-support",
            }
        ]
    }
```

In fact, recall that we said all items _must_ have one of `href` or `children`, so the `href` is necessary anyway. But they key here is that by having an `href`, the browser will navigate to `/support/people-support` / `/support/machine-support`, which should be defined in Angular apps that have `people-search` and `machine-search` available as directives.

With this configuration, clicking on `Support` will expand the `children`, and the user will see `People Support` and `Machine Support`, but they will not see the directives. But if they then click on one of `People Support` or `Machine Support`, then the `/support` Angular application will be loaded, the and the directives will become available.


