import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

// Patient data atom
export const patientDataAtom = atom(createPersistedAtom("patientDataAtom", null));

// Patient search results
export const patientSearchResultsAtom = atom(createPersistedAtom("patientSearchResultsAtom", []));

// Patient medical history
export const patientHistoryAtom = atom(createPersistedAtom("patientHistoryAtom", []));

// Current treatment
export const currentTreatmentAtom = atom(createPersistedAtom("currentTreatmentAtom", null));

// Lab tests
export const labTestsAtom = atom(createPersistedAtom("labTestsAtom", []));

// Departments
export const departmentsAtom = atom(createPersistedAtom("departmentsAtom", []));

// Doctors list
export const doctorsListAtom = atom(createPersistedAtom("doctorsListAtom", []));

// Loading state
export const patientLoadingAtom = atom(createPersistedAtom("patientLoadingAtom", false));

// Error state
export const patientErrorAtom = atom(createPersistedAtom("patientErrorAtom", null));

// Selected patient ID (for navigation)
export const selectedPatientIdAtom = atom(createPersistedAtom("selectedPatientIdAtom", null));

// Treatment form data (for multi-step forms)
export const treatmentFormDataAtom = atom(createPersistedAtom("treatmentFormDataAtom", {
    symptoms: '',
    diagnosis: '',
    prescription: [],
    labTests: [],
    assignedTo: '',
    notes: ''
}));