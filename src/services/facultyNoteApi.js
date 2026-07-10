import api from "./api";

// ================================
// GET ALL NOTES
// ================================

export const getAllNotes = async () => {
  const { data } = await api.get("/faculty-notes");
  return data.data;
};

// ================================
// GET MY NOTES
// ================================

export const getMyNotes = async () => {
  const { data } = await api.get("/faculty-notes/my-notes");
  return data.data;
};

// ================================
// CREATE NOTE
// ================================

export const createNote = async (formData) => {
  const { data } = await api.post("/faculty-notes", formData);

  return data.data;
};

// ================================
// UPDATE NOTE
// ================================

export const updateNote = async (
  id,
  formData
) => {
  const { data } = await api.put("/faculty-notes", formData);

  return data.data;
};

// ================================
// DELETE NOTE
// ================================

export const deleteNote = async (
  id
) => {
  const { data } = await api.delete(
    `/faculty-notes/${id}`
  );

  return data.data;
};

// ================================
// SEARCH NOTES
// ================================

export const searchNotes = async (
  filters
) => {
  const { data } = await api.get(
    "/faculty-notes/search",
    {
      params: filters,
    }
  );

  return data.data;
};