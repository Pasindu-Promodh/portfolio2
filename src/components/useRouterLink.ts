import { useHref, useLinkClickHandler, type To } from "react-router-dom";

// Lets any element that accepts href/onClick (e.g. MUI Button) act as a real
// router link: right-click / middle-click / ctrl-click work, plain clicks
// navigate client-side.
export function useRouterLink(to: To) {
  return {
    href: useHref(to),
    onClick: useLinkClickHandler<HTMLElement>(to),
  };
}
