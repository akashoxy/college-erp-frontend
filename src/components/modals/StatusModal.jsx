import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const StatusModal = ({
  isOpen,
  type = "info",
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  const iconMap = {
    success: (
      <CheckCircle2
        size={52}
        className="text-success"
      />
    ),

    error: (
      <AlertCircle
        size={52}
        className="text-error"
      />
    ),

    warning: (
      <AlertTriangle
        size={52}
        className="text-warning"
      />
    ),

    info: (
      <Info
        size={52}
        className="text-info"
      />
    ),
  };

  return (
    <dialog className="modal modal-open">

      <div className="modal-box">

        <div className="flex gap-5">

          <div>

            {iconMap[type]}

          </div>

          <div className="flex-1">

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
            className="btn btn-primary"
            onClick={onClose}
          >
            OK
          </button>

        </div>

      </div>

      <form
        method="dialog"
        className="modal-backdrop"
      >
        <button onClick={onClose}>
          close
        </button>
      </form>

    </dialog>
  );
};

export default StatusModal;