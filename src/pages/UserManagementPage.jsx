// --- Archivo: src/pages/UserManagementPage.jsx ---
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api.js';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const UserModal = ({ user, onClose, refreshUsers }) => {
    const [formData, setFormData] = useState({
        name: user ? user.name : '',
        email: user ? user.email : '',
        role: user ? user.role : 'viewer',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (user) {
                const { name, email, role } = formData;
                await apiClient.put(`/users/${user.id}`, { name, email, role });
            } else {
                await apiClient.post('/users/', formData);
            }
            refreshUsers();
            onClose();
        } catch (error) {
            console.error("Error al guardar el usuario", error);
            alert(error.response?.data?.detail || 'Error al guardar');
        }
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-white">{user ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Nombre</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    {!user && (
                         <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Contraseña</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Rol</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="viewer">Visor</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/users/');
            setUsers(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = async (userId) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este usuario?')){
            try {
                await apiClient.delete(`/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error("Error al eliminar el usuario", error);
                alert(error.response?.data?.detail || 'Error al eliminar');
            }
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusCircle size={20} className="mr-2"/>
                    Crear Usuario
                </button>
            </div>

            {isModalOpen && <UserModal user={editingUser} onClose={handleCloseModal} refreshUsers={fetchUsers} />}

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Rol</th>
                                <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center p-8">Cargando...</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-4">{user.id}</td>
                                        <td className="p-4">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${user.role === 'admin' ? 'bg-red-500 text-white' : user.role === 'editor' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleOpenModal(user)} className="text-blue-400 hover:text-blue-300"><Edit size={18}/></button>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default UserManagementPage;