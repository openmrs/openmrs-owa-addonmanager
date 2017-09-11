import React from 'react';

export const AddonList = ({appList, openPage}) => {
  return (
    <tbody>
      {
        appList.map((app, key) => {
          return (
            <tr key={key}>
              <td onClick={() => openPage(app)}>
                <img
                  src={`/${location.href.split('/')[3]}/owa/openmrs-addonmanager/${app.icons[48]}`}
                  alt="addon logo"
                />
              </td>
              <td onClick={() => openPage(app)}>
                <div className="addon-name">{app.name}</div>
                <div><h5  className="addon-description">{app.description}</h5></div>
              </td>
              <td onClick={() => openPage(app)}>
                {app.developer.name}
              </td>
              <td onClick={() => openPage(app)}>
                {app.version}
              </td>
              <td className="text-center">
                <a href="#">
                  <i className="glyphicon glyphicon-trash text-danger delete-icon"/>
                </a>
              </td>
            </tr>
          );
        })
      }
    </tbody>
  );
};

AddonList.propTypes = {
  appList: React.PropTypes.array.isRequired,
  openPage: React.PropTypes.func.isRequired,
};