import { createContext, useContext } from "react";

type SearchCtx = { open: boolean; setOpen: (v: boolean) => void };

export const SearchContext = createContext<SearchCtx>({
  open: false,
  setOpen: () => {},
});

export function useSearchOpen() {
  return useContext(SearchContext);
}