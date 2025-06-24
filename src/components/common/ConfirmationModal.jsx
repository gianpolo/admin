import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-4 max-w-xs">
      <div className="p-6">
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">{message}</p>
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
