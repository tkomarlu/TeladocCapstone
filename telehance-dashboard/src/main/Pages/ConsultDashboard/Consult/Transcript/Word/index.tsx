import React, { useEffect } from 'react';
import clsx from 'clsx';
import classes from './Word.module.css';

export default function Word({
  isEditing,
  isCurrent,
  startTime,
  onClick,
  attributes,
  children,
}: WordProps) {

  useEffect(() => {
    console.log(`[ WORD ] ${children}`)
  }, [])

  return (
    <span
      className={clsx({
        [classes.readonly]: !isEditing,
        [classes.highlight]: isCurrent,
      })}
      onMouseDown={() => {
        if (!isEditing) onClick(startTime);
      }}
      onDoubleClick={() => {
        if (isEditing) onClick(startTime);
      }}
      {...attributes}
    >
      {children}
    </span>
  );
}

export type WordProps = {
  isEditing: boolean;
  isCurrent: boolean;
  startTime: number;
  onClick: (newTime: number) => void;
  attributes: {
    'data-slate-leaf': true,
  }
  children: any,
};

export type WordData = {
  start: number;
  end: number;
  text: string;
  confidence: number;
  splitIdx?: number;
}