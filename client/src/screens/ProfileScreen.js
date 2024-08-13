import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser, updateProfile } from "../API";
import { useContext, useEffect, useState } from "react";
import Navigationsidebaruser from "../components/NAvigationSideBarUser/Navigationsidebaruser";
import { Store } from "../Context/CartContext";
import PasswordInput from "../components/PasswordInput";

const ProfileScreen = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");


  const {state} =useContext(Store)
  const { userInfo} = state



  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    telephone: "",
    Country: "",
    profilePicture: null,
    logo: null,
    nameBrand: "",
    description: "",
    Address: "",
    password: "",
    confirmPassword: "",
  });

  const { data: fetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    cacheTime: 10000,
    staleTime: 10000 * 60 * 5,
  });

  const [previewProfilePicture, setPreviewProfilePicture] = useState(
    fetch?.profilePicture || ""
  );

  useEffect(() => {
    if (fetch) {
      setFormData({
        name: fetch.name || "",
        email: fetch.email || "",
        telephone: fetch?.telephone || "",
        Country: fetch?.Country || "",
        nameBrand: fetch?.nameBrand || "",
        Address: fetch?.Address || "",
        description: fetch?.description || "",
        password:  "",
        profilePicture: null,
        logo: null,
      });
      setPreviewProfilePicture(fetch?.profilePicture || "");
    }
  }, [fetch]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      alert("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile"]);
    },
    onError: (error) => {
      alert(`Error updating profile: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password match validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] !== null &&
        formData[key] !== undefined &&
        key !== "profilePicture" &&
        key !== "logo"
      ) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append file fields
    if (formData.profilePicture) {
      formDataToSubmit.append("profilePicture", formData.profilePicture);
    }

    if (formData.logo) {
      formDataToSubmit.append("logo", formData.logo);
    }

    mutation.mutate(formDataToSubmit);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files) {
      const file = files[0];
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));

      // Update preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div className=" profile-container">
      <div className="dash-user">
        <Navigationsidebaruser />
      </div>
      <div className="profile-content">
        <h2>Account Setting</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile">
            <div className="profile-image-container">
              <label htmlFor="profilePicture" className="profile-image-label">
                <img
                  src={previewProfilePicture || "/images/default-profile.png"}
                  alt="Profile"
                  className="profile-image"
                />
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleChange}
                  className="profile-image-input"
                />
                <div className="profile-image-overlay">Upload Image</div>
              </label>
            </div>
            <div style={{ width: "70%" }}>
              <div className="profile-fields">
                <div className="profile-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="profile-form-group">
                <label>Phone Number</label>
                <input
                  type="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Country/Region</label>
                <input
                  type="text"
                  name="Country"
                  value={formData.Country}
                  onChange={handleChange}
                  required
                />
              </div>
              {userInfo?.isSeller ? (
                <>
                <div className="profile-form-group">
                <label>Name of brand</label>
                <input
                  type="text"
                  name="nameBrand"
                  value={formData.nameBrand}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="profile-form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="profile-form-group">
              <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
              </div>
                </>
              ) : null}
            </div>
          </div>
          <button type="submit" className="profile-save-button">
            Save Changes
          </button>
        </form>

        <h2>Change Password</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile">
          <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="profile-save-button">
            Save Changes
          </button>
          {message && <p style={{ color: "red" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;
