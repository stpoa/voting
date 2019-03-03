import React from 'react'
import IdenticonModule from 'identicon.js'

export const Identicon = ({
  value,
  width = 100,
  height = 100,
  alt = '',
  ...rest
}) => {
  const dimmension = width > height ? width : height
  const src = 'data:image/png;base64,' + new IdenticonModule(value, dimmension)
  // eslint-disable-next-line
  return <img {...{ src, alt, width, height, ...rest }} />
}
