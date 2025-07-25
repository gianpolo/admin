import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  fetchSelfSchedulings,
  openConfiguration,
  closeConfiguration,
  deleteConfiguration,
} from "../../store/selfschedulingsSlice.js";
import Spinner from "../../components/ui/spinner/Spinner";
import { useModal } from "../../hooks/useModal.js";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import SelfSchedulingList from "../../components/selfscheduling/SelfSchedulingList";

export default function SelfSchedulingListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const highlightId = location.state?.newId;
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const [deleteId, setDeleteId] = useState(null);

  const { list, status, error, actionStatus } = useSelector((state) => state.selfschedulings);

  const handleItemClick = (id) => navigate(`/self-schedulings/${id}`);
  const handleOpenClick = (id) => {
    dispatch(openConfiguration({ id: id }));
  };
  const handleCloseClick = (id) => {
    event.stopPropagation();
    dispatch(closeConfiguration({ id: id }));
  };
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (deleteId != null) {
      dispatch(deleteConfiguration({ id: deleteId }));
    }
    closeDeleteModal();
  };

  useEffect(() => {
    dispatch(fetchSelfSchedulings({ pageSize: 10, pageNumber: 1, cityId: 1 }));
  }, [dispatch]);

  return (
    <>
      <PageMeta title="Self Schedulings" description="List of Self Schedulings" />
      <PageBreadcrumb pageTitle="Self Schedulings" />
      <div className="mb-4">
        <a
          href="/self-schedulings/new"
          className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Add New
        </a>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {status === "loading" ? (
        <div className="flex h-full">
          <Spinner fullscreen size="md"></Spinner>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            <SelfSchedulingList
              list={list}
              actionStatus={actionStatus}
              highlightId={highlightId}
              onDelete={handleDeleteClick}
              onOpen={handleOpenClick}
              onClose={handleCloseClick}
              onItemSelection={handleItemClick}
            />
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        message="Deleting this configuration will remove all related items. Are you sure?"
      />
    </>
  );
}
