import { configureStore } from "@reduxjs/toolkit";
import drawerReducer from "./slices/drawerSlice";
import userReducer from "./slices/userSlice";
import modalAddTaskListReducer from "./slices/modals/modalAddTaskListSlice";
import modalConfirmationReducer from "./slices/modals/modalConfirmationSlice";
import loadingOverlayReducer from "./slices/loadingOverlaySlice";
import modalTaskInfoReducer from "./slices/modals/modalTaskInfoSlice";

const reducers = {
  drawer: drawerReducer,
  user: userReducer,
  loadingOverlay: loadingOverlayReducer,
};
const modalReducers = {
  modalAddTaskList: modalAddTaskListReducer,
  modalConfirmation: modalConfirmationReducer,
  modalTaskInfo: modalTaskInfoReducer,
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      ...reducers,
      ...modalReducers,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
