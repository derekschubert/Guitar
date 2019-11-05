import store from 'store';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// SAVE STATE TO LOCALSTORAGE & SERVER
const saveState = (state, isAuthenticated, user) => {
  _saveAllToLocal(state);
  // save to server
  if (isAuthenticated && user.sub) {
    axios({
      url: `${API_URL}/user`,
      method: 'POST',
      data: _prepStateForServer(state),
      headers: {
        'X-Auth0-ID': `${user.sub}`,
      },
    });
  }
};

const _saveAllToLocal = (data) => {
  // data must be an object
  if (typeof(data) !== 'object' || data.length !== undefined) {
    console.error('Save to local storage failed - passed in non-object:', data);
    return false;
  }

  Object.entries(data).forEach(([key, value]) => store.set(key, value));
  return true;
};

const _prepStateForServer = state => {
  return {
    capo: state.capo,
    frets: state.frets,
    scaleNotes: `${state.scaleNotes}`,
    selectedScale: state.selectedScale,
    showFretsBeforeCapo: state.showFretsBeforeCapo,
    strings: state.strings,
    tuning: `${state.tuning}`,
    useScale: state.useScale,
  };
};


// LOAD STATE FROM LOCALSTORAGE & SERVER
const loadState = async userId => {
  let serverData;
  const localData = _getAllFromLocal();

  // if user is logged in, get data from server
    // if user has previous data on server then...
      // - if localData is from same user or guest (presumably same user b4 they made account)
      //   combine localData w/ serverData,
      // - else just use serverData
    // else user has just been created, 
      // if local publicID exists (and doesn't match server)
      //    don't use any data (fresh start), except add publicID
      // else local publicID doesnt exist - use localData + publicID
  if (userId) {
    try {
      serverData = await _getAllFromServer(userId);
    } catch (err) {
      console.error(err);
    }

    if (typeof(serverData) === 'object') {
      // Previous data in localStorage is from current user or from guest
      // TODO: add last_updated fields into local & db,
      // if local was more recently updated, ask if they'd like to push
      // localData to server or overwrite local data from cloud
      if ((localData && localData.publicID === serverData.publicID)
        || (localData && !localData.publicID) 
      ) return {
        ...localData,
        ...serverData,
      }
      
      return serverData;
    } else if (localData && localData.publicID) return {
      publicID: serverData,
    }; 
    else return {
      ...localData,
      publicID: serverData,
    }
  }
  
  return localData;
};

const _getAllFromLocal = () => {
  let allLocal = {};
  let changed = false;

  store.each((value, key) => {
    changed = true;
    allLocal[key] = value;
  });

  if (changed) return allLocal;
  return null;
};

const _getAllFromServer = userId => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/user`, {
      headers: {
        'X-Auth0-ID': `${userId}`,
      }
    }).then(res => {
      // 200 regular success || 201 created user && success
      // 201 ? don't need to do anything!
      if (res.status === 200) {
        const data = _parseUserPreferences(res.data)
        resolve(data);
      } else {
        resolve(res.data.publicID);
      }
    }, err => {
      reject(err);
    });
  });
};

const _parseUserPreferences = data => {
  return {
    capo: data.capo,
    frets: data.frets,
    lastUpdated: data.lastUpdated,
    scaleNotes: JSON.parse(data.scaleNotes),
    selectedScale: data.selectedScale,
    showFretsBeforeCapo: data.showFretsBeforeCapo,
    strings: data.strings,
    tuning: JSON.parse(data.tuning),
    useScale: data.useScale,
  };
};


export {
  saveState,
  loadState,
}