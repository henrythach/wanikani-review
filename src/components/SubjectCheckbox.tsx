import React, { ReactNode } from "react";

const SubjectCheckbox = (props: {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  children: ReactNode
}) => (
  <label>
    <input
      type='checkbox'
      name='kanji'
      id='kanji'
      checked={props.checked}
      onChange={props.onChange}
    />
    {props.children}
  </label>
)

export default SubjectCheckbox
