import React, { useState } from "react";
import { updateUser } from "../../api/user";
import { useNotification } from "../../hooks";
import UserForm from "../form/UserForm";
import ModalContainer from "./ModalContainer";

export default function UpdateUser({
  visible,
  initialState,
  onSuccess,
  onClose,
}) {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);

    const { error, user } = await updateUser(initialState.id, data);

    setBusy(false);

    if (error) {
      return updateNotification("error", error);
    }

    onSuccess(user);
    updateNotification("success", "User updated!");
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <UserForm
        onSubmit={!busy ? handleSubmit : null}
        title="Update User"
        btnTitle="Update"
        busy={busy}
        initialState={initialState}
      />
    </ModalContainer>
  );
}
