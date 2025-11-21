import {create} from 'zustand';
const useAuthStore = create((set)=>({
    user: JSON.parse(localStorage.getItem("user")) || null,

    login : (userData)=> {
        localStorage.setItem("user",JSON.stringify(userData));
        set({user : userData})
    },

    logout : () => {
        localStorage.removeItem("user");
        set({user: null})
    },
    updateUser : (updatedField) => {
        set((state)=> {
            if(!state.user) return {};
            const newUser = {...state.user, ...updatedField};
            localStorage.setItem("user", JSON.stringify(newUser))
            return {user: newUser};
        });
    },
}))

export default useAuthStore;