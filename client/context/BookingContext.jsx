import { createContext, useContext, useState } from "react";

const BookingContext = createContext({
  isOpen: false,
  selectedService: "",
  openBookingModal: () => {},
  closeBookingModal: () => {},
});

export const BookingProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openBookingModal = (service = "") => {
    setSelectedService(service);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
    setSelectedService("");
  };

  return (
    <BookingContext.Provider value={{ isOpen, selectedService, openBookingModal, closeBookingModal }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingModal = () => useContext(BookingContext);
