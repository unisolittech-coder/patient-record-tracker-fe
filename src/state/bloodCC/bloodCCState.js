import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const bloodTestAtom = atom(createPersistedAtom("bloodTestkey", []));