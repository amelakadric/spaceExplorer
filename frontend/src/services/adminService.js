import { httpService } from "./httpService";

export const getPosts = async () => {
  const response = await httpService.get(`forum/admin/posts`);

  return response.data;
};

export const getPost = async (postId) => {
  const response = await httpService.get(`forum/posts/${postId}`);

  return response.data;
};

export const deletePost = async (postId) => {
  const response = await httpService.delete(`forum/posts/${postId}`);

  return response.data;
};

export const updatePost = async (postId, status) => {
  const response = await httpService.patch(`forum/posts/${postId}`, { status: status });
  return response.data;
};
