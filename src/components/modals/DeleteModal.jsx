import ConfirmModal from "./ConfirmModal";

const DeleteModal = ({
  isOpen,
  onConfirm,
  onCancel,
  itemName = "this item",
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Delete Confirmation"
      message={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
      confirmText="Delete"
      confirmColor="btn-error"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default DeleteModal;