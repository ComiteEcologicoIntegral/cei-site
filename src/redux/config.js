import formReducer from "./formSlice";
import { configureStore } from "@reduxjs/toolkit";

export default () => {
  let store = configureStore({
    reducer: {
      form: formReducer,
    },
  });
  return { store };
};
