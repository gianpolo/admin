import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta.jsx";
import useGoBack from "../../hooks/useGoBack.js";
import { ChevronLeftIcon } from "../../icons";
import { fetchItemDetails } from "../../store/itemSlice.js";
// import LogStream from "../../components/logviewer/LogStream.jsx";

export default function SelfSchedulingItemDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const goBack = useGoBack();
  const { item, status, error } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItemDetails(id));
  }, [dispatch, id]);

  return (
    <>
      <PageMeta
        title="Tour Item Details"
        description="Schedulable item overview"
      />
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goBack();
          }}
          className="text-gray-400 text-2xl flex mr-10 hover:text-gray-800"
        >
          <ChevronLeftIcon className="inline-block" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Tour Item Details
        </h2>
      </div>
      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {item && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
            {item.name}
          </h3>
          <p className="text-gray-500">ID: {item.id}</p>
          <p className="text-gray-500">Tour Date: {item.tourDate}</p>
          <p className="text-gray-500">Available Slots: {item.initialSlots}</p>
          <p className="text-gray-500">
            Reserved Slots: {item.reservedSlots ? item.reservedSlots.length : 0}
          </p>
          <p className="text-gray-500">
            Confirmed Slots:{" "}
            {item.confirmedSlots ? item.confirmedSlots.length : 0}
          </p>
        </div>
      )}
      {/* <div className="mt-6">
        <LogStream itemId={id} />
      </div> */}
    </>
  );
}
