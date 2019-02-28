export const replaceAtIndex = (arr, index, value) => {
  const x = [...arr.slice(0, index), value, ...arr.slice(index + 1)]
  console.log(x)
  return x
}
