export const Button = (props: { children: string; test: boolean }) => {
  console.log(props)
  return (
    <button hx-post='/clicked' hx-swap='outerHTML' {...props}>
      Click Me {props.children}
    </button>
  )
}
