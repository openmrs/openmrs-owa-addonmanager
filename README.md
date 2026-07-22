[![Test Pull Request](https://github.com/openmrs/openmrs-owa-addonmanager/actions/workflows/pull-request.yml/badge.svg)](https://github.com/openmrs/openmrs-owa-addonmanager/actions/workflows/pull-request.yml)
[![Build Latest](https://github.com/openmrs/openmrs-owa-addonmanager/actions/workflows/build-latest.yml/badge.svg)](https://github.com/openmrs/openmrs-owa-addonmanager/actions/workflows/build-latest.yml)
[![Coverage Status](https://coveralls.io/repos/github/openmrs/openmrs-owa-addonmanager/badge.svg?branch=master)](https://coveralls.io/github/openmrs/openmrs-owa-addonmanager?branch=master)

<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

# OpenMRS Add On Manager

This repository contains the OpenMRS Add On Manager Open Web App.

> The OpenMRS Add On Manager is a tool used for uploading, listing, installing, and deleting Open Web Apps and OpenMRS modules.

Add On Manager manages installable OMODs and OWAs. It searches [addons.openmrs.org](https://addons.openmrs.org/) for installable add-ons, but it does not install other addonindex catalog types, such as OpenMRS 3 frontend modules or content packages.

For further documentation about OpenMRS Open Web Apps, see
[the wiki page](https://wiki.openmrs.org/display/docs/Open+Web+Apps+Module).

## Features

- Lists installed Open Web Apps and OpenMRS modules, including their status and version.
- Uploads and installs OWA zip files and OMOD files.
- Searches the OpenMRS Add-On Index for installable OWAs and OMODs.
- Checks installed add-ons for available updates.
- Starts, stops, and deletes individual modules, and starts all installed modules.
- Deletes installed OWAs and opens their launch pages.

Module operations can restart OpenMRS and interrupt scheduled tasks and background processes.

## Runtime Requirements

Add On Manager runs inside an OpenMRS installation and uses endpoints provided by the [REST Web Services module](https://github.com/openmrs/openmrs-module-webservices.rest) and the [Open Web Apps module](https://github.com/openmrs/openmrs-module-owa). A network connection to [addons.openmrs.org](https://addons.openmrs.org/) is required to search for add-ons, install them from the catalog, and check for updates.

The App UI module is optional and is used for session-location support when present. The Legacy UI module is also optional and enables dependency warnings before module actions.

## Permissions and Administration

Users must be signed in and must either have the `Manage Modules` privilege or the `System Developer` role to view and manage add-ons. The OpenMRS runtime property `module.allow_web_admin` must also be enabled for web-based upload and module-management controls.

The add-on catalog API URL is currently fixed at `https://addons.openmrs.org/api/v1/addon` in `app/js/helpers/apiHelper.js`. The App Store URL shown on the in-app Settings page does not change the catalog used by search, installation, or update checks.

## Development

### Prerequisites

Use Node.js 14, matching the GitHub Actions workflows. The setup was verified with Node.js 14.21.3. The legacy test tooling is not compatible with current Node.js releases, so use a version manager to select Node.js 14 for this project. Node.js 14 is available from the [official release archive](https://nodejs.org/download/release/latest-v14.x/).

### Local Setup Instructions

```sh
# Get the project
git clone https://github.com/openmrs/openmrs-owa-addonmanager.git

# Move into the project directory
cd openmrs-owa-addonmanager

# Install the dependencies
npm install
```

Create a `config.json` file in the root directory to point the deploy and live-reload tasks at your local OpenMRS server:

```json
{
  "LOCAL_OWA_FOLDER": "/path/to/openmrs/appdata/owa/",
  "APP_ENTRY_POINT": "http://localhost:8080/openmrs/owa/addonmanager/index.html"
}
```

`LOCAL_OWA_FOLDER` should be the Open Web Apps directory used by your local OpenMRS server, including the trailing slash. For example, a Reference Application standalone server may use a path like `/Users/name/downloads/referenceapplication-standalone-2.6.0/appdata/owa/`.

`APP_ENTRY_POINT` should match your local OpenMRS host, port, and context path.

Start your local OpenMRS server before running the app. Make sure the port and context path in `APP_ENTRY_POINT` match your local Tomcat or servlet container configuration.

```sh
npm run watch
```

### Production Build

After installing the dependencies, build the distributable using [Webpack](https://webpack.js.org/) as follows:

```sh
npm run build:prod
```

This will create a zip file named `addonmanager-${version}.zip` in the root directory,
where `${version}` comes from `app/manifest.webapp`. For example, the current snapshot build creates `addonmanager-1.2.0-SNAPSHOT.zip`,
which can be uploaded to the OpenMRS Open Web Apps module.

### Local Deploy

To deploy directly to your local Open Web Apps directory, run:

```sh
npm run build:deploy
```

This will build and deploy the app to the `addonmanager` folder under `LOCAL_OWA_FOLDER`.
For example, if `LOCAL_OWA_FOLDER` is `/Users/name/downloads/referenceapplication-standalone-2.6.0/appdata/owa/`,
the app is deployed to `/Users/name/downloads/referenceapplication-standalone-2.6.0/appdata/owa/addonmanager`.
To change the deploy directory, edit the `LOCAL_OWA_FOLDER` entry in
`config.json`. If this file does not exist, create one in the root directory
that looks like:

```json
{
  "LOCAL_OWA_FOLDER": "/home/sims01/openmrs/openmrs-server/owa/",
  "APP_ENTRY_POINT": "http://localhost:8080/openmrs/owa/addonmanager/index.html"
}
```

### Live Reload

To use [BrowserSync](https://www.browsersync.io/) to watch your files and reload
the page, inject CSS or synchronize user actions across browser instances, you
will need the `APP_ENTRY_POINT` entry in your `config.json` file:

```json
{
  "LOCAL_OWA_FOLDER": "/home/sims01/openmrs/openmrs-server/owa/",
  "APP_ENTRY_POINT": "http://localhost:8080/openmrs/owa/addonmanager/index.html"
}
```

Run Browsersync as follows:

```sh
npm run watch
```

### Verifying Changes

Run the same build and test commands used by the pull-request workflow:

```sh
npm run build:prod
npm test
npm run coverage
```

### Extending

Install [npm](https://www.npmjs.com/) package dependencies as follows:

```sh
npm install --save <package>
```

To use the installed package, import it as follows:

```js
//import and assign to variable
import variableName from 'package';
```

To include a package in the vendor bundle, add it to the vendor entry point array, e.g.:

```js
entry: {
  app : `${__dirname}/app/js/openmrs-addonmanager`,
  css: `${__dirname}/app/css/openmrs-addonmanager.css`,
  vendor : [
    'package',
    ...//other packages in vendor bundle
  ]
},
```

Any files that you add manually must be added in the `app` directory.

## Releasing

Releases are deployed by the GitHub Actions release workflow in `.github/workflows/release.yml`.

Before creating a release, make sure the version in `pom.xml` matches the version in `app/manifest.webapp`. Webpack creates `addonmanager-${app/manifest.webapp version}.zip`, and Maven deploys `addonmanager-${project.version}.zip`, so these versions must stay in sync.

To publish a release, [create a GitHub release](https://github.com/openmrs/openmrs-owa-addonmanager/releases). The release workflow runs the production build and tests, then deploys the zip artifact to the OpenMRS OWA repository in JFrog Artifactory.

## License

[MPL 2.0 w/ HD](https://openmrs.org/license/)
