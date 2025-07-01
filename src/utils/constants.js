export const eventsData = {
  Configuration: {
    ConfigurationSlotsGenerationRequestedIntegrationEvent: {
      bg: "bg-blue-300",
      icon: "S+",
      text: "Slots Generation Requested",
    },
    ConfigurationSlotsGeneratedIntegrationEvent: {
      bg: "bg-blue-400",
      icon: "S+",
      text: "Slots Generated",
    },
    ConfigurationCreatedIntegrationEvent: {
      bg: "bg-blue-500",
      icon: "C🆕",
      text: "Configuration Created",
    },
    ConfigurationOpenedIntegrationEvent: {
      bg: "bg-blue-600",
      icon: "C▶",
      text: "Scheduling Window Opened",
    },
    ConfigurationClosedIntegrationEvent: {
      bg: "bg-blue-700",
      icon: "C■",
      text: "Scheduling Window Closed",
    },
  },
  ToursCatalog: {
    TourItemCreatedIntegrationEvent: {
      bg: "bg-yellow-300",
      icon: "T+",
      text: "Tour Item Created",
    },
    SlotReservedIntegrationEvent: {
      bg: "bg-yellow-400",
      icon: "T▶",
      text: "Slot Reserved",
    },
    SlotReleasedIntegrationEvent: {
      bg: "bg-yellow-500",
      icon: "T◀",
      text: "Slot Released",
    },
    SlotConfirmedIntegrationEvent: {
      bg: "bg-yellow-600",
      icon: "T✔",
      text: "Slot Confirmed",
    },
    SlotReservationFailureIntegrationEvent: {
      bg: "bg-yellow-700",
      icon: "T×",
      text: "Slot Reservation Failed",
    },
  },
  Basket: {
    BasketItemAddedIntegrationEvent: {
      bg: "bg-indigo-300",
      icon: "B+",
      text: "Item Added to Basket",
    },
    AddBasketItemFailedIntegrationEvent: {
      bg: "bg-indigo-400",
      icon: "B×",
      text: "Add to Basket Failed",
    },
    BasketItemRemovedIntegrationEvent: {
      bg: "bg-indigo-500",
      icon: "B−",
      text: "Item Removed from Basket",
    },
    BasketItemExpiredIntegrationEvent: {
      bg: "bg-indigo-600",
      icon: "B⏰",
      text: "Item Expired",
    },
    BasketConfirmedIntegrationEvent: {
      bg: "bg-indigo-700",
      icon: "B✔",
      text: "Basket Confirmed",
    },
  },
};
