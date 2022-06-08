const HeadingNavigationItem = ({ level = 2, text }) => {
  const HeadingElement = `h${level}` as React.ElementType

  // TODO apply styles. Same for both levels
  return <HeadingElement>{text}</HeadingElement>
}

export default HeadingNavigationItem
