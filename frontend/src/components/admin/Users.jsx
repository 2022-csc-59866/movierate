import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteUser, getUsers, searchUser } from "../../api/user";
import { useNotification, useSearch } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateUser from "../modals/UpdateUser";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";

let currentPageNo = 0;
const limit = 20;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch, resultNotFound } = useSearch();

  const fetchUsers = async (pageNo) => {
    const { profiles, error } = await getUsers(pageNo, limit);

    if (error) {
      return updateNotification("error", error);
    }

    if (!profiles.length) {
      currentPageNo = pageNo - 1;

      return setReachedToEnd(true);
    }

    setUsers([...profiles]);
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) {
      return;
    }

    currentPageNo += 1;
    fetchUsers(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) {
      return;
    }

    if (reachedToEnd) {
      setReachedToEnd(false);
    }

    currentPageNo -= 1;

    fetchUsers(currentPageNo);
  };

  const handleOnEditClick = (profilee) => {
    setShowUpdateModal(true);
    setSelectedProfile(profilee);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOnSearchSubmit = (value) => {
    handleSearch(searchUser, value, setResults);
  };

  const handleSearchFormReset = () => {
    resetSearch();
    setResults([]);
  };

  const handleOnUserUpdate = (profilee) => {
    const updatedUsers = users.map((user) => {
      if (profilee.id === user.id) {
        return profilee;
      }

      return user;
    });

    setUsers([...updatedUsers]);
  };

  const handleOnDeleteClick = (profilee) => {
    setSelectedProfile(profilee);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);

    const { error, message } = await deleteUser(selectedProfile.id);

    setBusy(false);

    if (error) {
      return updateNotification("error", error);
    }

    updateNotification("success", message);

    hideConfirmModal();

    fetchUsers(currentPageNo);
  };

  const hideConfirmModal = () => setShowConfirmModal(false);

  useEffect(() => {
    fetchUsers(currentPageNo);
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="flex justify-end mb-5">
          <AppSearchForm
            onReset={handleSearchFormReset}
            onSubmit={handleOnSearchSubmit}
            placeholder="Search Users..."
            showResetIcon={results.length || resultNotFound}
          />
        </div>
        <NotFoundText visible={resultNotFound} text="User not found" />

        <div className="grid grid-cols-4 gap-5">
          {results.length || resultNotFound
            ? results.map((user) => (
                <UserProfile
                  profilee={user}
                  key={user.id}
                  onEditClick={() => handleOnEditClick(user)}
                  onDeleteClick={() => handleOnDeleteClick(user)}
                />
              ))
            : users.map((user) => (
                <UserProfile
                  profilee={user}
                  key={user.id}
                  onEditClick={() => handleOnEditClick(user)}
                  onDeleteClick={() => handleOnDeleteClick(user)}
                />
              ))}
        </div>

        {!results.length && !resultNotFound ? (
          <NextAndPrevButton
            className="mt-5"
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
        ) : null}
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        subtitle="This action will remove this user permanently!"
        busy={busy}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
      />

      <UpdateUser
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnUserUpdate}
      />
    </>
  );
}

const UserProfile = ({ profilee, onEditClick, onDeleteClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };

  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  const getName = (name) => {
    if (name.length <= acceptedNameLength) {
      return name;
    }

    return name.substring(0, acceptedNameLength) + "..";
  };

  const { name, email, role, googleId, githubId } = profilee;

  if (!profilee) {
    return null;
  }

  return (
    <div className="bg-custom-gray shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <div className="px-2">
          <h1 className="text-xl text-primary dark:text-custom-gray font-semibold whitespace-nowrap">
            {getName(name)}
          </h1>

          <h1 className="text-xl text-primary dark:text-custom-gray font-semibold whitespace-nowrap">
            {getName(email)}
          </h1>

          <h1 className="text-xl text-primary dark:text-custom-gray font-semibold whitespace-nowrap">
            {getName(role.charAt(0).toUpperCase() + role.slice(1))}
          </h1>
        </div>
        <Options
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          visible={showOptions}
        />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-custom-gray text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsTrash />
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-custom-gray text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
