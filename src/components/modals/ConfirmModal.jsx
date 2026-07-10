import { TriangleAlert } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "btn-primary",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">

      <div className="modal-box">

        <div className="flex gap-5">

          <TriangleAlert
            size={50}
            className="text-warning"
          />

          <div>

            <h3 className="font-bold text-2xl">

              {title}

            </h3>

            <p className="mt-3">

              {message}

            </p>

          </div>

        </div>

        <div className="modal-action">

          <button
            className="btn"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={`btn ${confirmColor}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </dialog>
  );
};

export default ConfirmModal;