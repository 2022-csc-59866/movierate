import React, { useState, useEffect } from "react";
import { getActorProfile } from "../../api/actor";
import { useNotification } from "../../hooks";
import ModalContainer from "./ModalContainer";

export default function ProfileModal({ visible, profileId, onClose }) {
  const [profilee, setProfilee] = useState({});

  const { updateNotification } = useNotification();

  const fetchActorProfile = async () => {
    const { error, actor } = await getActorProfile(profileId);

    if (error) {
      return updateNotification("error", error);
    }

    setProfilee(actor);
  };

  useEffect(() => {
    if (profileId) {
      fetchActorProfile();
    }
  }, [profileId]);

  const { name, about, profile } = profilee;

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className="w-72 p-5 rounded flex flex-col items-center bg-custom-gray dark:bg-primary space-y-3">
        <img className="w-28 h-28 rounded-full" src={profile} alt="" />
        <h1 className="dark:text-custom-gold text-custom-gold font-semibold font-mono">
          {name}
        </h1>
        <p className="dark:text-custom-gray text-primary">{about}</p>
      </div>
    </ModalContainer>
  );
}
