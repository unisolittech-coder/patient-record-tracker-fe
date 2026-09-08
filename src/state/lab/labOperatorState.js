import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const labOperatorLoadingAtom = atom(createPersistedAtom("labOperatorLoadingAtom", false));

export const labOperatorErrorAtom = atom(createPersistedAtom("labOperatorErrorAtom", null));

export const labOperatorFormAtom = atom(createPersistedAtom("labOperatorFormAtom", {
    uniqueId: "",
    tests: [{ testName: "", report: null }]
}));

export const labPatientSearchAtom = atom(createPersistedAtom("labPatientSearchKey", null));

export const labRejectedReportsAtom = atom(createPersistedAtom("labRejectedReportsAtom", null));

export const labRejectedReportAtom = atom(createPersistedAtom("labRejectedReportAtom", null));

export const labRejectedReportUpdateAtom = atom(createPersistedAtom("labRejectedReportUpdateAtom", null));

export const labAllReportsLoadingAtom = atom(createPersistedAtom("labAllReportsLoadingAtom", false));

export const labAllReportsErrorAtom = atom(createPersistedAtom("labAllReportsErrorAtom", null));

export const labAllReportsAtom = atom(createPersistedAtom("labAllReportsAtom", null));

export const labReportDetailsLoadingAtom = atom(createPersistedAtom("labReportDetailsLoadingAtom", false));

export const labReportDetailsErrorAtom = atom(createPersistedAtom("labReportDetailsErrorAtom", null));

export const labReportDetailsAtom = atom(createPersistedAtom("labReportDetailsAtom", null));
