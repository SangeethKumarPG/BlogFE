import { baseURL } from "./baseURL";
import { commonApi } from "./commonAPI";

export const registerAPI = async (data)=>{
    return await commonApi("POST", `${baseURL}/register`, data, "");
}

export const loginAPI = async (data)=>{
    return await commonApi("POST", `${baseURL}/login`, data, "");
}

export const getTokenHeader = (formData=false)=>{
    if(sessionStorage.getItem("token")){
        const token = JSON.parse(sessionStorage.getItem("token"));
        if(formData){
            return {
                Authorization: `Bearer ${token}`,
                'Content-Type':'multipart/form-data'
            }
        }else{
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    }
}

export const createPostAPI = async (data)=>{
    return await commonApi("POST", `${baseURL}/create`, data, getTokenHeader(true))
}

export const getPostAPI = async ()=>{
    return await commonApi("GET", `${baseURL}/all`, {}, getTokenHeader())
}

export const updatePostAPI = async (id, data)=>{
    return await commonApi("PUT", `${baseURL}/update/${id}`, data, getTokenHeader(true))
}

export const deletePostAPI = async (id)=>{
    return await commonApi("DELETE", `${baseURL}/delete/${id}`, {}, getTokenHeader())
}