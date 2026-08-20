// alertToast.js
import Swal from "sweetalert2";

// Keep your existing function for approvals
export const confirmAlert = (message) => {
  return Swal.fire({
    title: "Are you sure?",
    text: message || "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0be91d",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, Approve it!",
    cancelButtonText: "Cancel",
  });
};

// New dedicated function for rejections with reason
export const confirmRejectAlert = (message, options = {}) => {
  return Swal.fire({
    title: "Reject Report",
    text: message || "Please provide a reason for rejection:",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33", // Red for rejection
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, Reject it!",
    cancelButtonText: "Cancel",
    input: 'textarea',
    inputPlaceholder: options.placeholder || "Enter rejection reason...",
    inputAttributes: {
      'aria-label': 'Rejection reason',
      'required': true,
      'rows': 3
    },
    preConfirm: (value) => {
      if (!value || value.trim() === "") {
        Swal.showValidationMessage('Please enter a reason for rejection');
        return false;
      }
      return value.trim();
    },
    ...options // Allow overriding any option
  });
};