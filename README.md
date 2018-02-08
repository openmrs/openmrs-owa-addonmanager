[![Build Status](https://travis-ci.org/openmrs/openmrs-owa-addonmanager.svg?branch=master)](https://travis-ci.org/openmrs/openmrs-owa-addonmanager)
[![Coverage Status](https://coveralls.io/repos/github/openmrs/openmrs-owa-addonmanager/badge.svg?branch=master)](https://coveralls.io/github/openmrs/openmrs-owa-addonmanager?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9177ef6ba94a4c6ea6887968bd298dc3)](https://www.codacy.com/app/openmrs/openmrs-owa-addonmanager?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=openmrs/openmrs-owa-addonmanager&amp;utm_campaign=Badge_Grade)

<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

# OpenMRS Add Ons Manager

This repository contains the openmrs-addOnManager OpenMRS Open Web App.

> The OpenMRS Add Ons Manager is a tool used for uploading, listing, and deleting existing OWAs and modules.

For further documentation about OpenMRS Open Web Apps see
[the wiki page](https://wiki.openmrs.org/display/docs/Open+Web+Apps+Module).

## Development

### Local Setup Instructions

```
# Get the project
git clone https://github.com/openmrs/openmrs-owa-addonmanager.git

# Move into the project directory
cd into openmrs-owa-addonmanager

# Install the dependencies
npm install

# Copy the webpack configuration from webpack.config.sample.js to webpack.config.js
cp webpack.sample.config.js webpack.config.js

# Locate the 'appdata/owa' directory and type the following command to get the path to the 'appdata/owa' directory and copy it to the clipboard.
pwd | pbcopy

An example of the path is: /Users/name/downloads/referenceapplication-standalone-2.6.0/appdata\owa

Modify the path to look like: /Users/name/downloads/referenceapplication-standalone-2.6.0/appdata\\owa/

Copy the path.

# Open the webpack.config.js file, locate the getConfig function and update the config object with the following
{
  "LOCAL_OWA_FOLDER": "PASTE_THE_PATH_YOU_COPIED_HERE",
  "APP_ENTRY_POINT": "http://localhost:8081/openmrs-standalone/owa/openmrs-addonmanager/index.html"
}

Note: Start your cohort builder standalone server locally. Make sure you tomcat port is 8081, if not, change the APP_ENTRY_POINT localhost port to be the same as your tomcat port.

# Run the app
npm run watch
```

### Production Build

You will need NodeJS 4+ installed to do this. See the install instructions [here](https://nodejs.org/en/download/package-manager/).

Once you have NodeJS installed, install the dependencies (first time only):

```sh
npm install
```

Build the distributable using [Webpack](https://webpack.github.io/) as follows:

````sh
npm run build:prod
````

This will create a file called `openmrs-addonmanager.zip` file in the `root` directory,
which can be uploaded to the OpenMRS Open Web Apps module.

### Local Deploy

To deploy directly to your local Open Web Apps directory, run:

````
npm run build:deploy
````

This will build and deploy the app to the `/Users/name/downloads/referenceapplication-standalone-2.6.0/appdata/owa`
directory. To change the deploy directory, edit the `LOCAL_OWA_FOLDER` entry in
`config.json`. If this file does not exists, create one in the root directory
that looks like:

```js
{
  "LOCAL_OWA_FOLDER": "/home/sims01/openmrs/openmrs-server/owa/",
  "APP_ENTRY_POINT": "http://localhost:8081/openmrs/owa/openmrs-addonmanager/index.html"
}
```

### Live Reload

To use [BrowserSync](https://www.browsersync.io/) to watch your files and reload
the page, inject CSS or synchronize user actions across browser instances, you
will need the `APP_ENTRY_POINT` entry in your `config.json` file:

```js
{
  "LOCAL_OWA_FOLDER": "/home/sims01/openmrs/openmrs-server/owa/",
  "APP_ENTRY_POINT": "http://localhost:8081/openmrs/owa/openmrs-addonmanager/index.html"
}
```
Run Browsersync as follows:

```
npm run watch
```

### Extending

Install [npm](http://npmjs.com/) packages dependencies as follows:

````sh
npm install --save <package>
````

To use the installed package, import it as follows:

````js
//import and assign to variable
import variableName from 'package';
````

To contain package in vendor bundle, remember to add it to vendor entry point array, eg.:

````js
entry: {
  app : `${__dirname}/app/js/owa.js`,
  css: `${__dirname}/app/css/owa.css`,
  vendor : [
    'package',
    ...//other packages in vendor bundle
  ]
},
````

Any files that you add manually must be added in the `app` directory.

### Troubleshooting

##### [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

You may experience problems due to the `Access-Control-Allow-Origin` header not
being set by OpenMRS. To fix this you'll need to enable Cross-Origin Resource
Sharing in Tomcat.

See instructions [here](http://enable-cors.org/server_tomcat.html) for Tomcat 7 and [here](https://www.dforge.net/2013/09/16/enabling-cors-on-apache-tomcat-6/) for Tomcat 6.

## Releasing

In order to release, set a new version in package.json, bintray.json and app/manifest.webapp. Once you commit and push changes to github, go to https://github.com/openmrs/openmrs-owa-addonmanager/releases and create a new release named after the version you want to release. Travis CI should pick up a newly created tag and deploy the release to Bintray at https://bintray.com/openmrs/owa/openmrs-owa-addonmanager

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/)
