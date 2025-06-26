export const eventsData = {
  Configuration: {
    ConfigurationCreatedEvent: {
      bg: "bg-blue-400",
      icon: "C+",
      text: "Configuration Created",
    },
    ConfigurationOpenedEvent: {
      bg: "bg-green-500",
      icon: "C▶",
      text: "Scheduling Window Start",
    },
    ConfigurationClosedEvent: {
      bg: "bg-red-500",
      icon: "C■",
      text: "Scheduling Window End",
    },
  },
  ToursCatalog: {
    TourItemCreatedEvent: {
      bg: "bg-yellow-500",
      icon: "T+",
      text: "Tour Item Created",
    },
    TourItemAvailabilityUpdatedEvent: {
      bg: "bg-yellow-600",
      icon: "T⇄",
      text: "Item Availability Updated",
    },
  },
  Basket: {
    BasketItemAddedEvent: {
      bg: "bg-indigo-400",
      icon: "B+",
      text: "Item Added to Basket",
    },
    AddBasketItemFailedEvent: {
      bg: "bg-rose-500",
      icon: "B×",
      text: "Add Item to Basket Failed",
    },
    BasketItemRemovedEvent: {
      bg: "bg-indigo-300",
      icon: "B−",
      text: "Item Removed from Basket",
    },
    BasketItemExpiredEvent: {
      bg: "bg-gray-500",
      icon: "B⏰",
      text: "Item Expired (Grace Period)",
    },
    BasketConfirmedEvent: {
      bg: "bg-green-600",
      icon: "B✔",
      text: "Basket Confirmed",
    },
  },
};
