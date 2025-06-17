import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [
    {
      id: 1,
      name: "Eye Examination",
      description: "Comprehensive eye examination with our expert optometrists",
      price: 500,
      duration: 30, // in minutes
      image: "/images/services/eye-exam.jpg"
    },
    {
      id: 2,
      name: "Contact Lens Fitting",
      description: "Professional contact lens fitting and consultation",
      price: 800,
      duration: 45,
      image: "/images/services/contact-lens.jpg"
    },
    {
      id: 3,
      name: "Frame Selection",
      description: "Personalized frame selection with style consultation",
      price: 300,
      duration: 30,
      image: "/images/services/frame-selection.jpg"
    },
    {
      id: 4,
      name: "Lens Customization",
      description: "Custom lens options including blue light protection and transitions",
      price: 1200,
      duration: 20,
      image: "/images/services/lens-custom.jpg"
    }
  ],
  selectedService: null
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    clearSelectedService: (state) => {
      state.selectedService = null;
    }
  }
});

export const { setSelectedService, clearSelectedService } = servicesSlice.actions;
export default servicesSlice.reducer; 