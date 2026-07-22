[![Build Latest](https://github.com/openmrs/openmrs-owa-addonmanager/actions/workflows/build-latest.yml/badge.svg)](https://github.com/openmrs/openmrs-owa-addonmanager/actions/workflows/build-latest.yml)
[![Coverage Status](https://coveralls.io/repos/github/openmrs/openmrs-owa-addonmanager/badge.svg?branch=master)](https://coveralls.io/github/openmrs/openmrs-owa-addonmanager?branch=master)

<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS" />

# OpenMRS Add On Manager

This repository contains the OpenMRS Add On Manager Open Web App.

> The OpenMRS Add On Manager is a tool used for uploading, listing, installing, and deleting Open
> Web Apps and OpenMRS modules.

The Add On Manager searches the [OpenMRS Add-On Index](https://addons.openmrs.org/) and supports
installing OMODs and OWAs.

For further documentation about OpenMRS Open Web Apps, see
[the Open Web Apps Module wiki page](https://openmrs.atlassian.net/wiki/spaces/docs/pages/25461755/Open%2BWeb%2BApps%2BModule).

## Features

- Lists installed Open Web Apps and OpenMRS modules, including their status and version.
- Uploads and installs OWA ZIP files and OMOD files.
- Searches the OpenMRS Add-On Index for installable OWAs and OMODs.
- Checks installed add-ons for available updates.
- Starts, stops, and deletes individual modules, and starts all installed modules.
- Deletes installed OWAs and opens their launch pages.

Module operations can restart OpenMRS and interrupt scheduled tasks and background processes.

## Runtime Requirements

The Add On Manager runs inside an OpenMRS installation and uses endpoints provided by the
[REST Web Services module](https://github.com/openmrs/openmrs-module-webservices.rest) and the
[Open Web Apps module](https://github.com/openmrs/openmrs-module-owa). The browser must be able to
reach [addons.openmrs.org](https://addons.openmrs.org/) for catalog searches and update checks. When
installing from the catalog, the OpenMRS server must also be able to reach the selected add-on's
download URL.

When present, the optional App UI module lets the Add On Manager read and update the session
location. The optional Legacy UI module enables dependent-module warnings before module actions.

## Permissions and Administration

Users must be signed in. The Add On Manager UI requires either the `Manage Modules` privilege or
the `System Developer` role. Managing OWAs also requires the `Manage OWA` privilege, which the Open
Web Apps module enforces. The OpenMRS runtime property `module.allow_web_admin` must also be enabled
to expose uploads, update checks, settings, and the **Start all Modules** control in this UI.

The add-on catalog API URL is currently fixed at `https://addons.openmrs.org/api/v1/addon` in
`app/js/helpers/apiHelper.js`. The App Store URL shown on the in-app Settings page does not change
the catalog used by search, installation, or update checks.

## Development

### Prerequisites

Use Node.js 14 to match the GitHub Actions workflows. The setup and tests were verified with Node.js
14.21.3. The legacy test tooling does not work with current Node.js releases, so use a version
manager to select Node.js 14 for this project. Node.js 14 is available from the
[official release archive](https://nodejs.org/download/release/latest-v14.x/).

### Local Setup Instructions

```sh
# Get the project
git clone https://github.com/openmrs/openmrs-owa-addonmanager.git

# Move into the project directory
cd openmrs-owa-addonmanager

# Install the dependencies
npm install
```

Create a `config.json` file in the project root to point the deploy and live-reload tasks at your
local OpenMRS server:

```json
{
  "LOCAL_OWA_FOLDER": "/path/to/openmrs/appdata/owa/",
  "APP_ENTRY_POINT": "http://localhost:8080/openmrs/owa/addonmanager/index.html"
}
```

`LOCAL_OWA_FOLDER` must be the Open Web Apps directory used by your local OpenMRS server and must
end with a trailing slash. Webpack appends `addonmanager` directly to this value. For example, use
a path like `/path/to/openmrs/appdata/owa/`.

`APP_ENTRY_POINT` should match your local OpenMRS host, port, and context path.

Start your local OpenMRS server before running the app. Make sure the port and context path in
`APP_ENTRY_POINT` match the configuration of your local Tomcat or other servlet container.

```sh
npm run watch
```

### Production Build

After installing the dependencies, build the distributable using
[Webpack](https://webpack.js.org/) as follows:

```sh
npm run build:prod
```

This creates a ZIP file named `addonmanager-${version}.zip` in the project root, where `${version}`
comes from `app/manifest.webapp`. For example, the current snapshot build creates
`addonmanager-1.2.0-SNAPSHOT.zip`, which can be installed using the OpenMRS Open Web Apps module.

### Local Deploy

To deploy directly to your local Open Web Apps directory, run:

```sh
npm run build:deploy
```

This builds and deploys the app to the `addonmanager` folder under `LOCAL_OWA_FOLDER`. For example,
if `LOCAL_OWA_FOLDER` is `/path/to/openmrs/appdata/owa/`, the app is deployed to
`/path/to/openmrs/appdata/owa/addonmanager`. To change the destination, edit `LOCAL_OWA_FOLDER` in
the `config.json` file created during local setup.

### Live Reload

To use [Browsersync](https://www.browsersync.io/) to watch your files, reload the page, inject CSS,
and synchronize user actions across browser instances, configure both `LOCAL_OWA_FOLDER` and
`APP_ENTRY_POINT` in the `config.json` file created during local setup. Then run:

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

Install and save an [npm](https://www.npmjs.com/) runtime dependency as follows:

```sh
npm install --save <package-name>
```

To use the installed package, import it as follows:

```js
// Import the package and assign it to a variable.
import variableName from 'package-name';
```

To include a package in the vendor bundle, add its package name to the `vendor` entry array in
`webpack.config.js`. For example:

```js
entry: {
  app: `${__dirname}/app/js/openmrs-addonmanager`,
  css: `${__dirname}/app/css/openmrs-addonmanager.css`,
  vendor: [
    'package-name',
    // Other vendor packages
  ],
},
```

Place application source files and static assets in the `app` directory.

## Releasing

Releases are deployed by the GitHub Actions release workflow in `.github/workflows/release.yml`.

Before creating a release, replace the `-SNAPSHOT` versions in `pom.xml` and
`app/manifest.webapp` with the same release version. Webpack names the archive using the manifest
version, while Maven looks for an archive named with the project version, so these versions must
stay in sync.

To publish a release,
[create a GitHub release](https://github.com/openmrs/openmrs-owa-addonmanager/releases). The release
workflow runs the production build and tests, then deploys the ZIP artifact to the OpenMRS OWA
repository in JFrog Artifactory.

## License

[MPL 2.0 with Healthcare Disclaimer](LICENSE)
