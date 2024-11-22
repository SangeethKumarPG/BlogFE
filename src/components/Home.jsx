import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "../redux/blogSlice";
import { baseURL } from "../services/baseURL";
import EditIcon from "@mui/icons-material/Edit";
import TrashIcon from "@mui/icons-material/Delete";
import { BlinkBlur } from "react-loading-indicators";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const { posts, status } = useSelector((state) => state.blog);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      toast.error("Please login to access this page", {
        position: "top-center",
      });
      navigate("/");
    }
  }, []);

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  const handleOpenDialog = (post = null) => {
    setOpenDialog(true);
    if (post) {
      // Set dialog for editing
      setEditMode(true);
      setEditPostId(post._id);
      setTitle(post.title);
      setDescription(post.description);
      setPreview(`${baseURL}/uploads/${post.image}`);
    } else {
      // Set dialog for creating
      setEditMode(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setEditPostId(null);
    setTitle("");
    setDescription("");
    setFile(null);
    setPreview(null);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleSubmit = () => {
    if (!file && !editMode) {
      toast.error("Image is required", { position: "top-center" });
      return;
    }
    if (!description || !title) {
      toast.error("Title and description are required", {
        position: "top-center",
      });
      return;
    }

    const postData = { id: editPostId, title, description, image: file };
    if (editMode) {
      dispatch(updatePost(postData));
    } else {
      dispatch(createPost(postData));
    }

    handleCloseDialog();
  };

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          borderRadius: "50%",
          minWidth: "56px",
          minHeight: "56px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Button>
      {status === "loading" ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}><BlinkBlur color="#2782f2" size="medium" text="" textColor="" /></Box>
        
      ) : (
        posts.map((post) => (
          <Card key={post._id} sx={{ marginBottom: 2, marginTop:2 }}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2">{post.description}</Typography>
              {post.image && (
                <img
                  src={`${baseURL}/uploads/${post.image}`}
                  alt={post.title}
                  style={{ width: "100%" }}
                />
              )}
            </CardContent>
            <CardActions>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleOpenDialog(post)}
                >
                  <EditIcon sx={{ marginRight: 0.5 }} />
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(post._id)}
                >
                  <TrashIcon sx={{ marginRight: 0.5 }} />
                  Delete
                </Button>
              </Box>
            </CardActions>
          </Card>
        ))
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editMode ? "Edit Post" : "Create Post"}</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onChange={handleFileChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "300px",
                marginTop: "10px",
                objectFit: "contain",
              }}
            />
          )}
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
          >
            Clear
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;
