import React, { useRef, useState } from 'react';
import './ProfileNav.css';

import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import Modal, { ProfileModal } from 'components/Modal';
import { useAuth0 } from 'util/auth0';

const ProfileNav = () => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [openModal, setOpenModal] = useState(false);
  const profileNavRef = useRef(null);

  if (!isAuthenticated) {
    return (
      <div className='LoginButton'>
        <button onClick={() => loginWithRedirect({})}>
          Login
          <span><IoIosArrowForward /></span>
        </button>
      </div>
    );
  }

  console.log({user})

  return (
    <React.Fragment>
      <div className='ProfileNav' ref={profileNavRef}
        onClick={() => setOpenModal(!openModal)}
      >
        {user && <img src={user.picture} alt='Profile' />}
        <span className={`dropdown ${openModal ? 'open' : ''}`}>
          <IoIosArrowDown />
        </span>
      </div>
      <Modal open={openModal}
        closeFn={() => setOpenModal(false)}
        refEl={profileNavRef} position={{y: 29}}
        fixed='right' edgeMargin={8}
      >
        <ProfileModal />
      </Modal>
    </React.Fragment>
  );
};

export default ProfileNav;