import React from 'react';
import DeleteAddonModal from '../manageApps/deleteAddonModal.jsx';

export const AddonList = ({appList, openPage, handleDelete}) => {
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
              <td
                className="text-center"
                id="delete-icon-wrapper"
                data-toggle="modal"
                data-target={`#formModal${app.folderName}`}
              >
                <i className="glyphicon glyphicon-trash text-danger delete-icon"/>
              </td>
              
              <DeleteAddonModal app={app} handleDelete={handleDelete} />
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
  handleDelete: React.PropTypes.func.isRequired,
};