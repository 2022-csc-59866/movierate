import React from "react";
import { AiFillTrophy, AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

export default function CastModal({
  casts = [],
  visible,
  onClose,
  onRemoveClick,
}) {
  return (
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      <div className="space-y-2 dark:bg-primary bg-custom-gray rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {casts.map(({ profile, roleAs, leadActor }) => {
          const { name, id } = profile;
          return (
            <div
              key={id}
              className="flex space-x-3 dark:bg-secondary bg-custom-gray drop-shadow-md rounded"
            >
              <img
                className="w-16 h-16 aspect-square rounded object-cover"
                src={profile.profile}
                alt={name}
              />
              <div className="w-full flex flex-col justify-between">
                <div>
                  <p className="font-semibold dark:text-custom-gray text-primary">
                    {name}
                  </p>
                  <p className="text-sm dark:text-highlight text-primary">
                    {roleAs}
                  </p>
                </div>
                {leadActor && (
                  <AiFillTrophy className="text-custom-gold dark:text-custom-gold" />
                )}
              </div>
              <button
                onClick={() => onRemoveClick(id)}
                className="dark:text-red-600 text-red-600 hover:opacity-80 transition p-2"
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}
