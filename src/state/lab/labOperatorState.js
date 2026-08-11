import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const labOperatorLoadingAtom = atom(createPersistedAtom("labOperatorLoadingAtom", false));

export const labOperatorErrorAtom = atom(createPersistedAtom("labOperatorErrorAtom", null));

export const labOperatorFormAtom = atom(createPersistedAtom("labOperatorFormAtom", {
    uniqueId: "",
    tests: [{ testName: "", report: null }]
}));
