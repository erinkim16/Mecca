import React, { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, explanation: string) => void;
  targetType: "Blog Post" | "Comment"; // Specify whether the target is a blog post or comment
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  targetType,
}) => {
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }
    onSubmit(reason, explanation.trim());
    setReason("");
    setExplanation("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="report-modal">
      <div className="modal-content">
        <h2>Report {targetType}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Reason for reporting:
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="Abusive Content">Abusive Content</option>
              <option value="Spam">Spam</option>
              <option value="Hate Speech">Hate Speech</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Additional Explanation (optional):
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Provide more details about your report..."
            />
          </label>
          <div className="modal-actions">
            <button type="submit" className="submit-button">
              Submit Report
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
