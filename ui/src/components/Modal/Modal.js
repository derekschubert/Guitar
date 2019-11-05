import React, { useRef, useLayoutEffect } from 'react';
import { SettingsModal, ProfileModal, } from './Modals';
import './Modal.css';

/**
 * Modal props:
 * - open: bool = false   (whether modal should be opened or closed)
 * - closeFn: func*       (function to close modal)
 * - position: {          (relative modal position, or fullscreen if null)
 *     x: int = 0,          (pos = refEl.pos + x)
 *     y: int = 0,
 *   } = null
 * - edgeMargin: int = 0  (px between content modal and edge of screen)
 * - fixed: string = left (default fixed position direction to prioritize)
 * - refEl: refID = null  (only required if using specific position)
 * - focus: bool = false  (true = darken bg // false = transparent bg)
 * - children             (standard react children)
 */
export default (props) => {
  const {
    open = false,
    position = null,
    refEl = null,
    focus = false,
    fixed = 'left',
    edgeMargin = 0,
    closeFn,
    children,
  } = props;
  if (!closeFn) return console.error('Modal requires a closeFn prop!');
  
  const contentRef = useRef(null);

  /* Position the modal content window relative to the button calling it
   * if content would go offscreen, fix to edge (with slight margin)
   * - only want to use if defined relEl
   * - skip first mounting pass, as contentRef not ready (didMountRef)
   */
  /* eslint-disable react-hooks/exhaustive-deps */
  const didMountRef = useRef(false);
  useLayoutEffect(() => {
    if (refEl && refEl.current) {
      if (didMountRef.current && contentRef.current) {
        const el = contentRef.current; // save some space :)
        el.style.position = 'absolute';

        if (fixed === 'left') {
          // position content (will be used if it doesnt overflow screen)
          let left = refEl.current.offsetLeft;
          if (position.x) left += position.x;
         
          // if content overflows horizontally, fix to right edge w/ edgeMarginpx margin
          if (left + el.offsetWidth > window.innerWidth - edgeMargin) {
            el.style.right = edgeMargin + 'px';
          } else el.style.left = left + 'px';
        } else if (fixed === 'right') {
          let right = position.x ? position.x + edgeMargin : edgeMargin;
          el.style.right = right + 'px';
        }

        let top = refEl.current.offsetHeight + refEl.current.offsetTop;
        if (position.y) top += position.y;
        // if content overflows vertically, fix to bottom edge w/ edgeMarginpx margin
        if (top + el.offsetHeight > window.innerHeight - edgeMargin) el.style.bottom = edgeMargin + 'px';
        else el.style.top = top + 'px';

      } else didMountRef.current = true;
    }
  }, [contentRef.current]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Stop event from being propagated to parent
  // - ie: prevent onClick of outer .Modal div
  const noProp = (e) => e.stopPropagation();

  const modalStyles = {
    display: open ? 'flex' : 'none',
    backgroundColor: focus ? 'rgba(0,0,0,.4)' : 'transparent'
  };

  return (
    <div onClick={closeFn} className='Modal' style={modalStyles}>
      <div onClick={(e) => noProp(e)} className='content' 
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};

export {
  SettingsModal,
  ProfileModal,
}