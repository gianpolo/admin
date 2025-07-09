export const eventsData = {
  Configuration: {
    ConfigurationSlotsGenerationRequestedIntegrationEvent: {
      bg: "bg-blue-300",
      icon: "S+",
      render: (e) => (
        <div className="flex flex-col">
          <div>Slots Generation Requested</div>
          <div className="text-xs dark:text-gray-400">
            Snapshot Date: {new Date(e.content.snapshotDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    ConfigurationSlotsGeneratedIntegrationEvent: {
      bg: "bg-blue-400",
      icon: "S+",
      render: (e) => (
        <div className="flex flex-col">
          <div>Slots Generation Completed</div>
          <div className="text-xs dark:text-gray-400">
            Snapshot Date: {new Date(e.content.snapshotDate).toLocaleDateString()}
          </div>
          <div className="text-xs dark:text-gray-400">Total Slots: {e.content.totalInitialSlots}</div>
          <div className="text-xs dark:text-gray-400">
            Schedulable Tour Items: {e.content.totalSchedulableTourItems}
          </div>
        </div>
      ),
    },
    ConfigurationCreatedIntegrationEvent: {
      bg: "bg-blue-500",
      icon: "C🆕",
      render: (e) => <span>Configuration Created</span>,
    },
    ConfigurationOpenedIntegrationEvent: {
      bg: "bg-blue-600",
      icon: "C▶",
      render: (e) => <span>Scheduling Window Opened</span>,
    },
    ConfigurationClosedIntegrationEvent: {
      bg: "bg-blue-700",
      icon: "C■",
      render: (e) => <span>Scheduling Window Closed</span>,
    },
  },
  ToursCatalog: {
    TourItemCreatedIntegrationEvent: {
      bg: "bg-yellow-800",
      icon: "T+",
      render: (e) => (
        <div className="flex flex-col">
          <div>{e.content.initialSlots} Slots Generated</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.tourItemId}</div>
        </div>
      ),
    },
    SlotReservedIntegrationEvent: {
      bg: "bg-yellow-400",
      icon: "T▶",
      render: (e) => (
        <div className="flex flex-col">
          <div>Slot Reserved</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.tourItemId}</div>
        </div>
      ),
    },
    SlotReleasedIntegrationEvent: {
      bg: "bg-yellow-500",
      icon: "T◀",
      render: (e) => (
        <div className="flex flex-col">
          <div>Slot Released</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.tourItemId}</div>
        </div>
      ),
    },
    SlotConfirmedIntegrationEvent: {
      bg: "bg-yellow-600",
      icon: "T✔",
      render: (e) => (
        <div className="flex flex-col">
          <div>Slot Confirmed</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.tourItemId}</div>
        </div>
      ),
    },
    SlotReservationFailureIntegrationEvent: {
      bg: "bg-yellow-700",
      icon: "T×",
      render: (e) => (
        <div className="flex flex-col">
          <div>Slot Reservation Failed</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.tourItemId}</div>
        </div>
      ),
    },
  },
  Basket: {
    BasketItemAddedIntegrationEvent: {
      bg: "bg-indigo-300",
      icon: "B+",
      render: (e) => (
        <div className="flex flex-col">
          <div>Item Added to Basket</div>
          <div className="text-xs dark:text-gray-400">GuideId: {e.content.guideId}</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.itemId}</div>
        </div>
      ),
    },
    AddBasketItemFailedIntegrationEvent: {
      bg: "bg-indigo-400",
      icon: "B×",
      render: (e) => (
        <div className="flex flex-col">
          <div>Add to Basket Failure</div>
          <div className="text-xs dark:text-gray-400">GuideId: {e.content.guideId}</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.itemId}</div>
        </div>
      ),
    },
    BasketItemRemovedIntegrationEvent: {
      bg: "bg-indigo-500",
      icon: "B−",
      text: "Item Removed from Basket",
      render: (e) => (
        <div className="flex flex-col">
          <div>Item Removed from Basket</div>
          <div className="text-xs dark:text-gray-400">GuideId: {e.content.guideId}</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.itemId}</div>
        </div>
      ),
    },
    BasketItemExpiredIntegrationEvent: {
      bg: "bg-indigo-600",
      icon: "B⏰",
      text: "Item Expired",
      render: (e) => (
        <div className="flex flex-col">
          <div>Item Expired in Basket</div>
          <div className="text-xs dark:text-gray-400">GuideId: {e.content.guideId}</div>
          <div className="text-xs dark:text-gray-400">ItemId: {e.content.itemId}</div>
        </div>
      ),
    },
    BasketConfirmedIntegrationEvent: {
      bg: "bg-indigo-700",
      icon: "B✔",
      render: (e) => (
        <div className="flex flex-col">
          <div>Basket Confirmed</div>
          <div className="text-xs dark:text-gray-400">GuideId: {e.content.guideId}</div>
        </div>
      ),
    },
  },
  Snapshot: {
    SnapshotCompletedIntegrationEvent: {
      bg: "bg-indigo-700",
      icon: "B✔",
      render: (e) => (
        <div className="flex flex-col">
          <div>Snapshot Completed</div>
          <div className="text-xs dark:text-gray-400">SnapshotId: {e.content.snapshotId}</div>
        </div>
      ),
    },
    SnapshotOperationCompletedIntegrationEvent: {
      bg: "bg-indigo-700",
      icon: "B✔",
      render: (e) => (
        <div className="flex flex-col">
          <div>Snapshot Op Completed</div>
          <div className="text-xs dark:text-gray-400">SnapshotId: {e.content.snapshotId}</div>
        </div>
      ),
    },
  },
};
