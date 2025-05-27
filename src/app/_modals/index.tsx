"use client";

import { ModalAddTaskList } from "./ModalAddTaskList";
import ModalConfirmation from "./ModalConfirmation";
import ModalTaskInfo from "./ModalTaskInfo";

export function Modals() {
  return (
    <>
      <ModalAddTaskList />
      <ModalConfirmation />
      <ModalTaskInfo />
    </>
  );
}
