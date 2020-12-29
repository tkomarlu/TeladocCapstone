import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import classes from './Message.module.css';

export default function Message(props) {
  const { items, isSelf, currentTime, onWordClick } = props;
  const [currWordIdx, setCurrWordIdx] = useState();

  useEffect(() => {
    const messageStartTime = items[0].start_time;
    const messageEndTime = items[items.length - 1].end_time;

    // Determine if the current time is within this message block, and set the
    // state variables accordingly.
    if (messageStartTime <= currentTime && currentTime < messageEndTime) {
      const currIdx = items.findIndex(
        (item) => item.start_time <= currentTime && currentTime < item.end_time
      );
      setCurrWordIdx(currIdx);
    } else {
      setCurrWordIdx(-1);
    }
  }, [currentTime, items]);

  return (
    <div
      className={clsx(classes.message, {
        [classes.self]: isSelf,
        [classes.other]: !isSelf,
      })}
    >
      {items
        ? items.map((item, idx) => {
            // Put span with " " before words (except for first)
            const spacing = idx === 0 ? null : <span> </span>;
            return (
              <>
                {spacing}
                <span
                  key={idx}
                  className={clsx(classes.item, {
                    [classes.highlight]: currWordIdx === idx,
                  })}
                  onClick={() => onWordClick(item)}
                >
                  {item.content}
                </span>
              </>
            );
          })
        : null}
    </div>
  );
}

Message.propTypes = {
  items: PropTypes.array.isRequired,
  isSelf: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  onWordClick: PropTypes.func.isRequired,
};
