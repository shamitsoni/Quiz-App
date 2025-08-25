import "./Quiz.css";

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Leave Quiz?</h3>
        <p>
          Are you sure you want to leave this page? Quiz progress will be lost.
        </p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="modal-btn confirm">
            Leave page
          </button>
          <button onClick={onCancel} className="modal-btn cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
