import { useEffect, useContext } from 'react';
import ReducerCtx from 'contexts/reducer';
import { loadState } from 'reducer/storage';
import { useAuth0 } from 'util/auth0';

/* eslint-disable react-hooks/exhaustive-deps */
const StateStorage = () => {
  const {dispatch} = useContext(ReducerCtx);
  const { loading, isAuthenticated, user } = useAuth0();

  // Load state from local storage & db
  const loaded = (data) => dispatch({type: 'loadState', loadedState: data});
  useEffect(() => {
    async function fetchData() {
      console.log('FETCHING DATA...')
      const userId = isAuthenticated ? user.sub : null;
      const data = await loadState(userId, dispatch);
      console.log("-- data:", data)
      loaded(data);
    };
    if (!loading) fetchData();
  }, [loading]);

  // Unload state -> save to local storage & db
  const unload = () => dispatch({type: 'saveState', isAuthenticated, user});
  useEffect(() => {
    if (!loading) {
      window.addEventListener('beforeunload', unload);
    }
    
    return () => {
      if (!loading) {
        console.log("CNEAING UP.... ", user)
        window.removeEventListener('beforeunload', unload);
      }
    }
  }, [loading]);

  return null;
}
/* eslint-enable react-hooks/exhaustive-deps */

export default StateStorage;