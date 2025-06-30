export const eventsData = {
  Configuration: {
    ConfigurationSlotsGenerationRequestedIntegrationEvent: {
      bg: "bg-blue-400",
      icon: "C+",
      text: "Configuration Slot Generation Start",
    },
    ConfigurationSlotsGeneraedIntegrationEvent: {
      bg: "bg-blue-400",
      icon: "C+",
      text: "Configuration Created",
    },
    ConfigurationOpenedIntegrationEvent: {
      bg: "bg-green-500",
      icon: "C▶",
      text: "Scheduling Window Start",
    },
    ConfigurationClosedIntegrationEvent: {
      bg: "bg-red-500",
      icon: "C■",
      text: "Scheduling Window End",
    },
  },
  ToursCatalog: {
    TourItemCreatedIntegrationEvent: {
      bg: "bg-yellow-500",
      icon: "T+",
      text: "Tour Item Created",
    },
    SlotReservedIntegrationEvent: {
      bg: "bg-yellow-600",
      icon: "S+",
      text: "Slot Reserved",
    },
    SlotReleasedIntegrationEvent: {
      bg: "bg-yellow-600",
      icon: "S+",
      text: "Slot Released",
    },
    SlotConfirmedIntegrationEvent: {
      bg: "bg-yellow-600",
      icon: "S+",
      text: "Slot Confirmed",
    },
    SlotReservationFailureIntegrationEvent: {
      bg: "bg-yellow-600",
      icon: "S+",
      text: "Slot Reservation Failed",
    },
  },
  Basket: {
    BasketItemAddedIntegrationEvent: {
      bg: "bg-indigo-400",
      icon: "B+",
      text: "Item Added to Basket",
    },
    AddBasketItemFailedIntegrationEvent: {
      bg: "bg-rose-500",
      icon: "B×",
      text: "Add Item to Basket Failed",
    },
    BasketItemRemovedIntegrationEvent: {
      bg: "bg-indigo-300",
      icon: "B−",
      text: "Item Removed from Basket",
    },
    BasketItemExpiredIntegrationEvent: {
      bg: "bg-gray-500",
      icon: "B⏰",
      text: "Item Expired (Grace Period)",
    },
    BasketConfirmedIntegrationEvent: {
      bg: "bg-green-600",
      icon: "B✔",
      text: "Basket Confirmed",
    },
  },
};
