import React, { useState} from "react";
import "../Members.css";

const Members = () => {

   const [ showModal, setShowModal] = useState(false);
   const [ formData, setFormData] = useState ({
    fullName: "",
    email: "",
    role:"",
   });

   const handleChange = (e) => {
    setFormdata({
        ...formData,
        [e.target.name] : e.target.value,
    });
   };

   const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Member:", formData);

    setFormData ({
        fullName: "",
        email: "",
        role: "",
    });
    setShowModal(false);
   };

   return (
    <div className="members-container">
        <h2>My Groups</h2>
        <p>Manage your group  members and their roles.</p>


        <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add member
        </button>

        {showModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h3>Add Member</h3>
                        <span
                        className="close-btn"
                        onClick={() => setShowModal(false)}
                        >
                            x
                        </span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label>Full name</label>
                        <input
                        type="text"
                        name="fullName"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                        />

                        <label>Email</label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />

                        <label>Role</label>
                        <select               
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        >
                            <option value="">Select role</option>
                             <option value="Admin">Admin</option>
                              <option value="Member">Member</option>
                               <option value="Viewer">Viewer</option>
                            </select>

                            <button type="submit" className="submit-btn">
                                Add member
                                </button>   
                    </form>
                </div>
             </div>   
           )}
    </div>
   );
};

export default Members