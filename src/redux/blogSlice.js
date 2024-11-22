import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPostAPI, getPostAPI, updatePostAPI, deletePostAPI } from "../services/allAPI";
import { toast } from "react-toastify";

export const createPost = createAsyncThunk("blog/createPost", async (post,{rejectWithValue})=>{
    try {
        if(sessionStorage.getItem('token')){
            const {image, description,title} = post;
            const reqBody = new FormData();
            reqBody.append('image', image);
            reqBody.append('description', description);
            reqBody.append('title', title);
            const response = await createPostAPI(reqBody);
            if(response.status === 201){
                return response.data;
            }else{
                return rejectWithValue({message:response?.response?.data});
            }
        }else{
            return rejectWithValue({message:'Please login to create post'})
        }
    } catch (error) {
        return rejectWithValue({message:'Something went wrong'})
    }
})

export const getPosts = createAsyncThunk("blog/getPosts", async (_, { rejectWithValue })=>{
    try{
        if(sessionStorage.getItem('token')){
            const response = await getPostAPI();
            if(response.status === 200){
                return response.data;
            }else{
                return rejectWithValue({message:response?.response?.data});
            }
        }
    }catch(error){
        return rejectWithValue({message:'Something went wrong'})
    }
})

export const updatePost = createAsyncThunk("blog/updatePost", async (post, { rejectWithValue })=>{
    try{
        if(sessionStorage.getItem('token')){
            const {id, image, description,title} = post;
            const reqBody = new FormData();
            reqBody.append('image', image);
            reqBody.append('description', description);
            reqBody.append('title', title);
            const response = await updatePostAPI(id, reqBody);
            if(response.status === 200){
                return response.data;
            }else{
                return rejectWithValue({message:response?.response?.data});
            }
        }else{
            return rejectWithValue({message:'Please login to update post'})
        }
    }catch(error){
        return rejectWithValue({message:'Something went wrong'})
    }
})

export const deletePost = createAsyncThunk("blog/deletePost", async (id, { rejectWithValue })=>{
    try{
        if(sessionStorage.getItem('token')){
            const response = await deletePostAPI(id);
            if(response.status === 200){
                return response.data;
            }else{
                return rejectWithValue({message:response?.response?.data});
            }
        }else{
            return rejectWithValue({message:'Please login to delete post'})
        }
    }catch(error){
        return rejectWithValue({message:'Something went wrong'})
    }
})


const blogSlice = createSlice({
    name:'blog',
    initialState:{
        posts:[],
        status:'idle',
        error:null
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(createPost.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(createPost.fulfilled, (state, action)=>{
            state.status = 'fulfilled';
            toast.success('Post created successfully');
            state.posts.push(action.payload);
        })
        .addCase(createPost.rejected, (state, action)=>{
            state.status ='rejected';
            state.error = action.payload?.message;
            toast.error(action.payload?.message);
        })
        .addCase(getPosts.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(getPosts.fulfilled, (state, action)=>{
            state.status = 'fulfilled';
            state.posts = action.payload;
        })
        .addCase(getPosts.rejected, (state, action)=>{
            state.status ='rejected';
            state.error = action.payload?.message;
            toast.error(action.payload?.message);
        })
        .addCase(updatePost.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(updatePost.fulfilled, (state, action)=>{
            state.status = 'fulfilled';
            toast.success('Post updated successfully');
            const index = state.posts.findIndex(post=>post._id === action.payload._id);
            state.posts[index] = action.payload;
        })
        .addCase(updatePost.rejected, (state, action)=>{
            state.status ='rejected';
            state.error = action.payload?.message;
            toast.error(action.payload?.message);
        })
        .addCase(deletePost.pending, (state)=>{
            state.status = 'loading'
        })
        .addCase(deletePost.fulfilled, (state, action)=>{
            state.status = 'fulfilled';
            toast.success('Post deleted successfully');
            const index = state.posts.findIndex(post=>post._id === action.payload._id);
            state.posts.splice(index,1);
        })
        .addCase(deletePost.rejected, (state, action)=>{
            state.status ='rejected';
            state.error = action.payload?.message;
            toast.error(action.payload?.message);
        })
    }

})

export default blogSlice.reducer;