import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.jsx";
import PageMeta from "../../components/common/PageMeta.jsx";
import {
  fetchConfigurations,
  openConfiguration,
  closeConfiguration,
  deleteConfiguration,
} from "../../store/configurationsSlice.js";

import { useModal } from "../../hooks/useModal.js";
import ConfirmationModal from "../../components/common/ConfirmationModal.jsx";
import ConfigurationList from "../../components/configuration/ConfigurationList.jsx";

export default function SelfSchedulingConfigurations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const highlightId = location.state?.newId;
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const [deleteId, setDeleteId] = useState(null);

  const { list, status, error, actionStatus } = useSelector(
    (state) => state.configurations
  );

  const handleItemClick = (id) =>
    navigate(`/self-scheduling-configurations/${id}`);
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
    dispatch(fetchConfigurations({ pageSize: 10, pageNumber: 1, cityId: 1 }));
  }, [dispatch]);
 
  return (
    <>
      <PageMeta
        title="Self Scheduling Configurations"
        description="List of Self Scheduling Configurations"
      />
      <PageBreadcrumb pageTitle="Self Scheduling Configurations" />
      <div className="mb-4">
        <a
          href="/self-scheduling-configurations/new"
          className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Add New
        </a>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {status === "loading" ? (
            <p>Loading...</p>
          ) : (
            <ConfigurationList
              list={list}
              actionStatus={actionStatus}
              highlightId={highlightId}
              onDelete={handleDeleteClick}
              onOpen={handleOpenClick}
              onClose={handleCloseClick}
              onItemSelection={handleItemClick}
            />
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        message="Deleting this configuration will remove all related items. Are you sure?"
      />
    </>
  );
}
