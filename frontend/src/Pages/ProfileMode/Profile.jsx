import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Profile.css'

const API_URL = '/api/users';
const host_name = 'http://localhost';

function Profile() {
    const { id } = useParams(); 

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get(`${host_name}:8000/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then(response => setUserInfo(response.data.userInfo))
            .catch(error => console.log("Ошибка загрузки пользователя", error));

        axios.get(`${host_name}:8000/api/user/image`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then(response => setImage(response.data.imageUrl))
            .catch(error => console.log("Ошибка загрузки изображения", error));
    }, [id]);

    const handleChange = async (field, value) => {
        const user = userInfo;
        user[field] = value;
        await axios.put(`${host_name}:8000${API_URL}/${user.id}`, user);
        fetchUser();
      };

      const fetchUser = async () => {
        const res = await axios.get(`${host_name}:8000/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        setUserInfo(res.data.userInfo);
      };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            uploadImage(file);
        }
    };

    const uploadImage = (file) => {
        const formData = new FormData();
        formData.append("image", file);
        console.log(formData);
        axios.post(`${host_name}:8000/api/upload/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => setImage(response.data.imagePath))
        .catch(error => console.log("Ошибка загрузки файла", error));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    return (
        <>
            <div className={`profile-container`}>
                <div className="profile-info-container">
                    <div className="profile-info">
                        <h3>Имя</h3>
                        <input type="text" value={userInfo === null ? "" : userInfo.name} onChange={(e) => handleChange('name', e.target.value)}/>
                    </div>
                    <div className="profile-info">
                        <h3>Фамилия</h3>
                        <input type="text" value={userInfo === null ? "" : userInfo.surname} onChange={(e) => handleChange('surname', e.target.value)}/>
                    </div>
                    <div className="profile-info">
                        <h3>Дата рождения</h3>
                        <input type="date" value={userInfo === null || userInfo.birth_date === null ? "" : formatDate(userInfo.datebirth)} onChange={(e) => handleChange('datebirth', e.target.value)}/>
                    </div>
                    <div className="profile-info">
                        <h3>Роль</h3>
                        <input type="text" value={userInfo === null ? "" : userInfo.role} readOnly={true}/>
                    </div>
                    <div className="profile-info">
                        <h3>Почта</h3>
                        <input type="text" value={userInfo === null || userInfo.email == null ? "" : userInfo.email} onChange={(e) => handleChange('email', e.target.value)}/>
                    </div>
                    <div className="profile-info">
                        <h3>Номер телефона</h3>
                        <input type="text" value={userInfo === null || userInfo.phone == null ? "" : userInfo.phone} onChange={(e) => handleChange('phone', e.target.value)}/>
                    </div>
                    {
                        userInfo && userInfo.role == "teacher" && (
                        <div className="profile-info">
                            <h3>Ссылка на Google Meet</h3>
                            <input type="text" value={userInfo.google_meet_url || ""} onChange={(e) => handleChange('google_meet_url', e.target.value)}/>
                        </div>
                        )
                    }
                </div>
                <div>
                    <label className="profile-image" htmlFor="imageUpload">
                        <img src={preview || image || "default-avatar.png"} alt="Profile" />
                    </label>
                    <input type="file" id="imageUpload" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                </div>
            </div>
        </>
    );
}

export default Profile;
