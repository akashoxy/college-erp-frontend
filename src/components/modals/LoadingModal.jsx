import { Loader2 } from "lucide-react";

const LoadingModal = ({
  isOpen,
  title = "Please Wait",
  message = "Processing...",
}) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">

      <div className="modal-box text-center">

        <Loader2
          size={70}
          className="mx-auto animate-spin text-primary"
        />

        <h2 className="font-bold text-2xl mt-5">

          {title}

        </h2>

        <p className="mt-3">

          {message}

        </p>

      </div>

    </dialog>
  );
};

export default LoadingModal;