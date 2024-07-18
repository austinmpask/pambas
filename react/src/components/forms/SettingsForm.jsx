//React
import { useContext, useEffect, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { UserContext } from "src/context/UserContext";

//Toasts
import { ToastContainer } from "react-toastify";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import toastRequest from "../../utils/toastRequest";
import { Validators, DataFields } from "../../utils/validations";

//Form for changing user info && viewing login credentials
export default function SettingsForm() {
  //Subscribe to user context
  const { userData, setUserData } = useContext(UserContext);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Form setup
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  //Whenever user data is updated, reset the form
  useEffect(() => {
    reset();
  }, [userData]);

  //Make request to update user information
  async function updateData(data) {
    await toastRequest({
      method: "PUT",
      route: "/userdata",
      data: { first_name: data.firstName, last_name: data.lastName },
      setLoading,
      success: "Profile updated!",
      successCB: (message) => {
        //If successful, update user context
        setUserData((prev) => ({
          ...prev,
          firstName: message.first_name,
          lastName: message.last_name,
        }));
      },
    });
  }

  return (
    <>
      <ToastContainer />
      <h2 className="subtitle">Account Options</h2>

      <section className="section">
        <form onSubmit={handleSubmit((data) => updateData(data))}>
          <div className="block mb-2">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <span>{userData.username}</span>
            </span>
          </div>
          <div className="block mb-5">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <span>{userData.email}</span>
            </span>
          </div>
          <div className="inline">
            <div className="mr-6">
              <FormField
                field="firstName"
                error={errors.firstName?.message}
                label={DataFields.FIRST_NAME_LABEL}
                validations={Validators.FirstName}
                placeHolder={userData.firstName}
                loading={loading}
                register={register}
              />
            </div>

            <FormField
              field="lastName"
              error={errors.lastName?.message}
              label={DataFields.LAST_NAME_LABEL}
              validations={Validators.LastName}
              placeHolder={userData.lastName}
              loading={loading}
              register={register}
            />
          </div>

          <SubmitAlt
            submitLabel="Save Changes"
            altLabel="Discard"
            altAction={() => {
              reset();
              clearErrors();
            }}
            loading={loading}
          />
        </form>
      </section>
    </>
  );
}
