import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  Image,
  Folder,
  Camera,
  Star,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  RefreshCw,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

export default function PhotoGalleryControl() {

  /* ==========================================================
      STATES
  ========================================================== */

  const [
    gallery,
    setGallery,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    statusModal,
    setStatusModal,
  ] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [
    newYear,
    setNewYear,
  ] = useState("");

  const [
    featuredForm,
    setFeaturedForm,
  ] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [
    editingFeatured,
    setEditingFeatured,
  ] = useState(null);

  const [
    albumForm,
    setAlbumForm,
  ] = useState({
    yearId: "",
    title: "",
    eventDate: "",
    coverImage: null,
  });

  const [
    editingAlbum,
    setEditingAlbum,
  ] = useState(null);

  /* ==========================================================
      IMAGE HELPER
  ========================================================== */

  const getImageUrl = (
    url
  ) => {

    if (!url) {
      return "";
    }

    return url;

  };

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const stats = useMemo(
    () => {

      const years =
        gallery?.yearFolders ||
        [];

      const albums =
        years.reduce(
          (
            total,
            year
          ) =>
            total +
            (year.albums
              ?.length || 0),
          0
        );

      const photos =
        years.reduce(
          (
            total,
            year
          ) =>
            total +
            year.albums.reduce(
              (
                albumTotal,
                album
              ) =>
                albumTotal +
                (album.photos
                  ?.length || 0),
              0
            ),
          0
        );

      return {

        years:
          years.length,

        albums,

        photos,

        featured:
          gallery
            ?.featuredPhotos
            ?.length || 0,

        hero:
          gallery
            ?.heroImages
            ?.length || 0,

      };

    },
    [gallery]
  );

  /* ==========================================================
      RESET FORMS
  ========================================================== */

  const resetFeaturedForm =
    () => {

      setFeaturedForm({
        title: "",
        description: "",
        image: null,
      });

      setEditingFeatured(
        null
      );

    };

  const resetAlbumForm =
    () => {

      setAlbumForm({
        yearId: "",
        title: "",
        eventDate: "",
        coverImage: null,
      });

      setEditingAlbum(
        null
      );

    };

  /* ==========================================================
      Continue in Part 2
  ========================================================== */
    /* ==========================================================
      LOAD GALLERY
  ========================================================== */

  const loadGallery =
    async () => {

      try {

        setLoading(true);

        const { data } =
          await api.get(
            "/photo-gallery"
          );

        setGallery(
          data.data
        );

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Load Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to load photo gallery.",
        });

      } finally {

        setLoading(false);
        setRefreshing(false);

      }

    };

  useEffect(() => {

    loadGallery();

  }, []);

  /* ==========================================================
      REFRESH
  ========================================================== */

  const refreshGallery =
    async () => {

      setRefreshing(true);

      await loadGallery();

    };

  /* ==========================================================
      DELETE ALL GALLERY DATA
  ========================================================== */

  const deleteAllGalleryData =
    () => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Entire Gallery",

        message:
          "This will permanently delete ALL hero images, featured photos, year folders, albums and photos — including their Cloudinary files. This cannot be undone. Continue?",

        onConfirm:
          async () => {

            try {

              setUploading(true);

              await api.delete(
                "/photo-gallery/all"
              );

              await loadGallery();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "All photo gallery data deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete gallery data.",
              });

            } finally {

              setUploading(false);

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

  /* ==========================================================
      HERO IMAGES
  ========================================================== */

  const uploadHeroImage =
    async (file) => {

      if (!file) {
        return;
      }

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        await api.post(
          "/photo-gallery/hero",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message:
            "Hero image uploaded successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Upload Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to upload hero image.",
        });

      } finally {

        setUploading(false);

      }

    };

  const deleteHeroImage =
    (index) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Hero Image",

        message:
          "Are you sure you want to delete this hero image?",

        onConfirm:
          async () => {

            try {

              await api.delete(
                `/photo-gallery/hero/${index}`
              );

              await loadGallery();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "Hero image deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete hero image.",
              });

            } finally {

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

  /* ==========================================================
      Continue in Part 3
  ========================================================== */
    /* ==========================================================
      FEATURED PHOTO FORM
  ========================================================== */

  const handleFeaturedInput =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFeaturedForm(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      );

    };

  const editFeaturedPhoto =
    (photo) => {

      setEditingFeatured(
        photo
      );

      setFeaturedForm({
        title:
          photo.title || "",
        description:
          photo.description || "",
        image: null,
      });

    };

  /* ==========================================================
      ADD FEATURED PHOTO
  ========================================================== */

  const addFeaturedPhoto =
    async () => {

      if (
        !featuredForm.title.trim()
      ) {

        setStatusModal({
          isOpen: true,
          type: "warning",
          title: "Validation",
          message:
            "Please enter a photo title.",
        });

        return;

      }

      if (
        !featuredForm.image
      ) {

        setStatusModal({
          isOpen: true,
          type: "warning",
          title: "Validation",
          message:
            "Please select an image.",
        });

        return;

      }

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          featuredForm.title
        );

        formData.append(
          "description",
          featuredForm.description
        );

        formData.append(
          "image",
          featuredForm.image
        );

        await api.post(
          "/photo-gallery/featured",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        resetFeaturedForm();

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message:
            "Featured photo added successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Upload Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to add featured photo.",
        });

      } finally {

        setUploading(false);

      }

    };

  /* ==========================================================
      UPDATE FEATURED PHOTO
  ========================================================== */

  const updateFeaturedPhoto =
    async () => {

      if (
        !editingFeatured
      ) {
        return;
      }

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          featuredForm.title
        );

        formData.append(
          "description",
          featuredForm.description
        );

        if (
          featuredForm.image
        ) {

          formData.append(
            "image",
            featuredForm.image
          );

        }

        await api.put(
          `/photo-gallery/featured/${editingFeatured._id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        resetFeaturedForm();

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Updated",
          message:
            "Featured photo updated successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Update Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to update featured photo.",
        });

      } finally {

        setUploading(false);

      }

    };

  /* ==========================================================
      DELETE FEATURED PHOTO
  ========================================================== */

  const deleteFeaturedPhoto =
    (id) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Featured Photo",

        message:
          "Are you sure you want to delete this featured photo?",

        onConfirm:
          async () => {

            try {

              await api.delete(
                `/photo-gallery/featured/${id}`
              );

              await loadGallery();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "Featured photo deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete featured photo.",
              });

            } finally {

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

  /* ==========================================================
      Continue in Part 4
  ========================================================== */
    /* ==========================================================
      YEAR FOLDERS
  ========================================================== */

  const addYearFolder =
    async () => {

      if (
        !newYear.trim()
      ) {

        setStatusModal({
          isOpen: true,
          type: "warning",
          title: "Validation",
          message:
            "Please enter a year.",
        });

        return;

      }

      try {

        await api.post(
          "/photo-gallery/year",
          {
            year:
              newYear.trim(),
          }
        );

        setNewYear("");

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message:
            "Year folder created successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Creation Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to create year folder.",
        });

      }

    };

  const updateYearFolder =
    async (
      yearId,
      currentYear
    ) => {

      const year =
        prompt(
          "Update Year",
          currentYear
        );

      if (
        !year?.trim()
      ) {
        return;
      }

      try {

        await api.put(
          `/photo-gallery/year/${yearId}`,
          {
            year:
              year.trim(),
          }
        );

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Updated",
          message:
            "Year folder updated successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Update Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to update year folder.",
        });

      }

    };

  const deleteYearFolder =
    (
      yearId,
      year
    ) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Year Folder",

        message:
          `Delete "${year}" and all its albums and photos?`,

        onConfirm:
          async () => {

            try {

              await api.delete(
                `/photo-gallery/year/${yearId}`
              );

              await loadGallery();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "Year folder deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete year folder.",
              });

            } finally {

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

  /* ==========================================================
      Continue in Part 5
  ========================================================== */
    /* ==========================================================
      ALBUM FORM
  ========================================================== */

  const editAlbum =
    (
      album,
      yearId
    ) => {

      setEditingAlbum(
        album
      );

      setAlbumForm({

        yearId,

        title:
          album.title || "",

        eventDate:
          album.eventDate
            ? new Date(
                album.eventDate
              )
                .toISOString()
                .split("T")[0]
            : "",

        coverImage:
          null,

      });

    };

  /* ==========================================================
      CREATE ALBUM
  ========================================================== */

  const addAlbum =
    async () => {

      if (
        !albumForm.yearId ||
        !albumForm.title.trim()
      ) {

        setStatusModal({
          isOpen: true,
          type: "warning",
          title: "Validation",
          message:
            "Please select a year and enter an album title.",
        });

        return;

      }

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          albumForm.title
        );

        formData.append(
          "eventDate",
          albumForm.eventDate
        );

        if (
          albumForm.coverImage
        ) {

          formData.append(
            "coverImage",
            albumForm.coverImage
          );

        }

        await api.post(
          `/photo-gallery/year/${albumForm.yearId}/albums`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        resetAlbumForm();

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message:
            "Album created successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Creation Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to create album.",
        });

      } finally {

        setUploading(false);

      }

    };

  /* ==========================================================
      UPDATE ALBUM
  ========================================================== */

  const updateAlbum =
    async () => {

      if (
        !editingAlbum
      ) {
        return;
      }

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          albumForm.title
        );

        formData.append(
          "eventDate",
          albumForm.eventDate
        );

        if (
          albumForm.coverImage
        ) {

          formData.append(
            "coverImage",
            albumForm.coverImage
          );

        }

        await api.put(
          `/photo-gallery/albums/${editingAlbum._id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        resetAlbumForm();

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Updated",
          message:
            "Album updated successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Update Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to update album.",
        });

      } finally {

        setUploading(false);

      }

    };

  /* ==========================================================
      DELETE ALBUM
  ========================================================== */

  const deleteAlbum =
    (albumId) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Album",

        message:
          "Are you sure you want to delete this album and all its photos?",

        onConfirm:
          async () => {

            try {

              await api.delete(
                `/photo-gallery/albums/${albumId}`
              );

              await loadGallery();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "Album deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete album.",
              });

            } finally {

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

  /* ==========================================================
      Continue in Part 6
  ========================================================== */
    /* ==========================================================
      UPLOAD PHOTOS
  ========================================================== */

  const uploadPhotos =
    async (
      albumId,
      files
    ) => {

      if (
        !files?.length
      ) {
        return;
      }

      try {

        setUploading(true);

        const formData =
          new FormData();

        Array.from(
          files
        ).forEach(
          (file) => {

            formData.append(
              "photos",
              file
            );

          }
        );

        await api.post(
          `/photo-gallery/albums/${albumId}/photos`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        await loadGallery();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message:
            "Photos uploaded successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Upload Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to upload photos.",
        });

      } finally {

        setUploading(false);

      }

    };

  /* ==========================================================
      DELETE PHOTO
  ========================================================== */

  const deletePhoto =
    (
      albumId,
      photoId
    ) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Photo",

        message:
          "Are you sure you want to delete this photo?",

        onConfirm:
          async () => {

            try {

              await api.delete(
                `/photo-gallery/albums/${albumId}/photos/${photoId}`
              );

              await loadGallery();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "Photo deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete photo.",
              });

            } finally {

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

  /* ==========================================================
      JSX
  ========================================================== */

  if (loading) {

    return (
      <LoadingModal
        isOpen
        title="Loading Gallery"
        message="Fetching photo gallery..."
      />
    );

  }

  return (
    <>

      <LoadingModal
        isOpen={uploading}
        title="Please Wait"
        message="Processing your request..."
      />

      <StatusModal
        isOpen={
          statusModal.isOpen
        }
        type={
          statusModal.type
        }
        title={
          statusModal.title
        }
        message={
          statusModal.message
        }
        onClose={() =>
          setStatusModal(
            (prev) => ({
              ...prev,
              isOpen: false,
            })
          )
        }
      />

      <DeleteModal
        isOpen={
          deleteModal.isOpen
        }
        title={
          deleteModal.title
        }
        message={
          deleteModal.message
        }
        onConfirm={
          deleteModal.onConfirm
        }
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="min-h-screen bg-base-200 p-6 lg:p-8"
      >

        {/* ==========================================================
            Continue in Part 7
        ========================================================== */}
                <div className="max-w-7xl mx-auto space-y-8">

          {/* ==========================================================
              HERO
          ========================================================== */}

          <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

            <div className="hero-content text-center py-12">

              <div>

                <Image
                  size={64}
                  className="mx-auto mb-4"
                />

                <h1 className="text-4xl md:text-5xl font-black">

                  Photo Gallery CMS

                </h1>

                <p className="mt-4 text-lg opacity-90 max-w-3xl">

                  Manage hero slider images,
                  featured photos, year
                  folders, albums and gallery
                  photos from a single
                  enterprise dashboard.

                </p>

              </div>

            </div>

          </div>

          {/* ==========================================================
              HEADER ACTIONS
          ========================================================== */}

          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

            <div>

              <h2 className="text-2xl font-black">

                Gallery Dashboard

              </h2>

              <p className="text-base-content/60">

                Cloudinary powered gallery
                management.

              </p>

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                className="btn btn-primary"
                disabled={refreshing}
                onClick={refreshGallery}
              >

                <RefreshCw
                  size={18}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh Gallery

              </button>

              <button
                type="button"
                className="btn btn-error"
                onClick={deleteAllGalleryData}
              >

                <Trash2 size={18} />

                Delete All

              </button>

            </div>

          </div>

          {/* ==========================================================
              DASHBOARD STATS
          ========================================================== */}

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats shadow bg-base-100"
            >

              <div className="stat">

                <div className="stat-figure text-primary">

                  <Folder size={32} />

                </div>

                <div className="stat-title">

                  Years

                </div>

                <div className="stat-value text-primary">

                  {stats.years}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats shadow bg-base-100"
            >

              <div className="stat">

                <div className="stat-figure text-secondary">

                  <Camera size={32} />

                </div>

                <div className="stat-title">

                  Albums

                </div>

                <div className="stat-value text-secondary">

                  {stats.albums}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats shadow bg-base-100"
            >

              <div className="stat">

                <div className="stat-figure text-accent">

                  <Image size={32} />

                </div>

                <div className="stat-title">

                  Photos

                </div>

                <div className="stat-value text-accent">

                  {stats.photos}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats shadow bg-base-100"
            >

              <div className="stat">

                <div className="stat-figure text-warning">

                  <Star size={32} />

                </div>

                <div className="stat-title">

                  Featured

                </div>

                <div className="stat-value text-warning">

                  {stats.featured}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats shadow bg-base-100"
            >

              <div className="stat">

                <div className="stat-figure text-success">

                  <Upload size={32} />

                </div>

                <div className="stat-title">

                  Hero Images

                </div>

                <div className="stat-value text-success">

                  {stats.hero}

                </div>

              </div>

            </motion.div>

          </div>

          {/* ==========================================================
              Continue in Part 8
          ========================================================== */}
                    {/* ==========================================================
              HERO IMAGE MANAGEMENT
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                <div>

                  <h2 className="text-2xl font-black">

                    Hero Slider Images

                  </h2>

                  <p className="text-base-content/60">

                    Upload and manage homepage
                    hero slider images.

                  </p>

                </div>

                <label className="btn btn-primary">

                  <Upload size={18} />

                  Upload Hero Image

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      uploadHeroImage(
                        e.target.files?.[0]
                      )
                    }
                  />

                </label>

              </div>

              <div className="divider" />

              {gallery?.heroImages?.length ? (

                <div className="max-h-130 overflow-y-auto pr-2">

                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {gallery.heroImages.map(
                      (
                        hero,
                        index
                      ) => (

                        <motion.div
                          key={index}
                          whileHover={{
                            y: -5,
                          }}
                          className="card bg-base-200 shadow-lg border border-base-300 overflow-hidden"
                        >

                          <figure>

                            <img
                              src={getImageUrl(
                                hero.image
                              )}
                              alt={`Hero ${index + 1}`}
                              className="h-56 w-full object-cover"
                            />

                          </figure>

                          <div className="card-body p-4">

                            <div className="flex justify-between items-center">

                              <span className="badge badge-primary">

                                Hero {index + 1}

                              </span>

                              <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  deleteHeroImage(
                                    index
                                  )
                                }
                              >

                                <Trash2
                                  size={16}
                                />

                              </button>

                            </div>

                          </div>

                        </motion.div>

                      )
                    )}

                  </div>

                </div>

              ) : (

                <div className="text-center py-16">

                  <Image
                    size={70}
                    className="mx-auto opacity-30"
                  />

                  <h3 className="text-2xl font-bold mt-4">

                    No Hero Images

                  </h3>

                  <p className="text-base-content/60 mt-2">

                    Upload your first hero image
                    to start building the gallery.

                  </p>

                </div>

              )}

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 9
          ========================================================== */}
                    {/* ==========================================================
              FEATURED PHOTOS
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                <div>

                  <h2 className="text-2xl font-black">

                    Featured Photos

                  </h2>

                  <p className="text-base-content/60">

                    Highlight important campus
                    events and moments.

                  </p>

                </div>

                {editingFeatured && (

                  <div className="badge badge-warning badge-lg">

                    Editing Featured Photo

                  </div>

                )}

              </div>

              <div className="divider" />

              {/* FORM */}

              <div className="grid lg:grid-cols-2 gap-5">

                <input
                  type="text"
                  name="title"
                  placeholder="Photo Title"
                  className="input input-bordered w-full"
                  value={featuredForm.title}
                  onChange={handleFeaturedInput}
                />

                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  className="input input-bordered w-full"
                  value={featuredForm.description}
                  onChange={handleFeaturedInput}
                />

              </div>

              <div className="mt-5">

                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) =>
                    setFeaturedForm({
                      ...featuredForm,
                      image:
                        e.target.files?.[0] ||
                        null,
                    })
                  }
                />

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                {editingFeatured ? (

                  <>

                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={
                        updateFeaturedPhoto
                      }
                    >

                      <Edit3
                        size={18}
                      />

                      Update Featured

                    </button>

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={
                        resetFeaturedForm
                      }
                    >

                      Cancel

                    </button>

                  </>

                ) : (

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                      addFeaturedPhoto
                    }
                  >

                    <Plus
                      size={18}
                    />

                    Add Featured

                  </button>

                )}

              </div>

              <div className="divider" />

              {/* FEATURED GRID */}

              {gallery?.featuredPhotos?.length ? (

                <div className="max-h-140 overflow-y-auto pr-2">

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {gallery.featuredPhotos.map(
                      (photo) => (

                        <motion.div
                          key={photo._id}
                          whileHover={{
                            y: -5,
                          }}
                          className="card bg-base-200 shadow-lg border border-base-300 overflow-hidden"
                        >

                          <figure>

                            <img
                              src={getImageUrl(
                                photo.image
                              )}
                              alt={photo.title}
                              className="h-60 w-full object-cover"
                            />

                          </figure>

                          <div className="card-body">

                            <h3 className="text-xl font-bold">

                              {photo.title}

                            </h3>

                            <p className="text-base-content/70">

                              {photo.description ||
                                "No description"}

                            </p>

                            <div className="card-actions justify-end mt-4">

                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  editFeaturedPhoto(
                                    photo
                                  )
                                }
                              >

                                <Edit3
                                  size={16}
                                />

                              </button>

                              <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  deleteFeaturedPhoto(
                                    photo._id
                                  )
                                }
                              >

                                <Trash2
                                  size={16}
                                />

                              </button>

                            </div>

                          </div>

                        </motion.div>

                      )
                    )}

                  </div>

                </div>

              ) : (

                <div className="text-center py-16">

                  <Star
                    size={70}
                    className="mx-auto opacity-30"
                  />

                  <h3 className="text-2xl font-bold mt-4">

                    No Featured Photos

                  </h3>

                  <p className="text-base-content/60 mt-2">

                    Add featured photos to
                    showcase important events.

                  </p>

                </div>

              )}

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 10
          ========================================================== */}
                    {/* ==========================================================
              YEAR FOLDER MANAGEMENT
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                <div>

                  <h2 className="text-2xl font-black">

                    Year Folders

                  </h2>

                  <p className="text-base-content/60">

                    Organize albums by academic
                    year or event year.

                  </p>

                </div>

              </div>

              <div className="divider" />

              {/* ADD YEAR */}

              <div className="flex flex-col md:flex-row gap-4">

                <input
                  type="text"
                  placeholder="Enter Year (e.g. 2026)"
                  className="input input-bordered flex-1"
                  value={newYear}
                  onChange={(e) =>
                    setNewYear(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addYearFolder}
                >

                  <Plus size={18} />

                  Add Year

                </button>

              </div>

              <div className="divider" />

              {/* YEAR GRID */}

              {gallery?.yearFolders?.length ? (

                <div className="max-h-120 overflow-y-auto pr-2">

                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {gallery.yearFolders.map(
                      (year) => (

                        <motion.div
                          key={year._id}
                          whileHover={{
                            y: -5,
                          }}
                          className="card bg-base-200 border border-base-300 shadow-lg"
                        >

                          <div className="card-body">

                            <Folder
                              size={42}
                              className="text-primary"
                            />

                            <h3 className="text-2xl font-black">

                              {year.year}

                            </h3>

                            <div className="badge badge-outline">

                              {year.albums?.length || 0}
                              {" "}
                              Albums

                            </div>

                            <div className="card-actions justify-end mt-4">

                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  updateYearFolder(
                                    year._id,
                                    year.year
                                  )
                                }
                              >

                                <Edit3
                                  size={16}
                                />

                              </button>

                              <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  deleteYearFolder(
                                    year._id,
                                    year.year
                                  )
                                }
                              >

                                <Trash2
                                  size={16}
                                />

                              </button>

                            </div>

                          </div>

                        </motion.div>

                      )
                    )}

                  </div>

                </div>

              ) : (

                <div className="text-center py-16">

                  <Folder
                    size={70}
                    className="mx-auto opacity-30"
                  />

                  <h3 className="text-2xl font-bold mt-4">

                    No Year Folders

                  </h3>

                  <p className="text-base-content/60 mt-2">

                    Create a year folder before
                    adding albums.

                  </p>

                </div>

              )}

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 11
          ========================================================== */}
                    {/* ==========================================================
              ALBUM MANAGEMENT
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                <div>

                  <h2 className="text-2xl font-black">

                    Album Management

                  </h2>

                  <p className="text-base-content/60">

                    Create and organize albums
                    inside each year folder.

                  </p>

                </div>

                {editingAlbum && (

                  <div className="badge badge-warning badge-lg">

                    Editing Album

                  </div>

                )}

              </div>

              <div className="divider" />

              <div className="max-h-100 overflow-y-auto pr-2">

                <div className="grid lg:grid-cols-2 gap-5">

                  <select
                    className="select select-bordered w-full"
                    value={albumForm.yearId}
                    onChange={(e) =>
                      setAlbumForm({
                        ...albumForm,
                        yearId:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">

                      Select Year

                    </option>

                    {gallery?.yearFolders?.map(
                      (year) => (

                        <option
                          key={year._id}
                          value={year._id}
                        >

                          {year.year}

                        </option>

                      )
                    )}

                  </select>

                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Album Title"
                    value={albumForm.title}
                    onChange={(e) =>
                      setAlbumForm({
                        ...albumForm,
                        title:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="grid lg:grid-cols-2 gap-5 mt-5">

                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={albumForm.eventDate}
                    onChange={(e) =>
                      setAlbumForm({
                        ...albumForm,
                        eventDate:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) =>
                      setAlbumForm({
                        ...albumForm,
                        coverImage:
                          e.target.files?.[0] ||
                          null,
                      })
                    }
                  />

                </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                {editingAlbum ? (

                  <>

                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={
                        updateAlbum
                      }
                    >

                      <Edit3
                        size={18}
                      />

                      Update Album

                    </button>

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={
                        resetAlbumForm
                      }
                    >

                      Cancel

                    </button>

                  </>

                ) : (

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                      addAlbum
                    }
                  >

                    <Plus
                      size={18}
                    />

                    Create Album

                  </button>

                )}

              </div>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 12
          ========================================================== */}
                    {/* ==========================================================
              ALBUM LIBRARY
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="text-2xl font-black">

                Album Library

              </h2>

              <div className="divider" />

              <div className="max-h-200 overflow-y-auto pr-2">

                {gallery?.yearFolders?.map(
                  (year) => (

                    <div
                      key={year._id}
                      className="mb-10"
                    >

                      <div className="flex items-center gap-3 mb-6">

                        <Folder
                          size={24}
                          className="text-primary"
                        />

                        <h3 className="text-2xl font-bold">

                          {year.year}

                        </h3>

                        <div className="badge badge-primary">

                          {year.albums?.length || 0} Albums

                        </div>

                      </div>

                      {year.albums?.length ? (

                        <div className="space-y-8">

                          {year.albums.map(
                            (album) => (

                              <motion.div
                                key={album._id}
                                whileHover={{ y: -3 }}
                                className="card bg-base-200 border border-base-300 shadow-lg"
                              >

                                <div className="card-body">

                                  <div className="flex flex-col xl:flex-row gap-6">

                                    {/* COVER */}

                                    <div className="w-full xl:w-80">

                                      {album.coverImage ? (

                                        <img
                                          src={getImageUrl(album.coverImage)}
                                          alt={album.title}
                                          className="w-full h-64 object-cover rounded-2xl"
                                        />

                                      ) : (

                                        <div className="h-64 rounded-2xl bg-base-300 flex items-center justify-center">

                                          No Cover Image

                                        </div>

                                      )}

                                    </div>

                                    {/* DETAILS */}

                                    <div className="flex-1">

                                      <div className="flex flex-col lg:flex-row justify-between gap-4">

                                        <div>

                                          <h3 className="text-2xl font-black">

                                            {album.title}

                                          </h3>

                                          <div className="flex items-center gap-2 mt-2 text-base-content/70">

                                            <Calendar size={16} />

                                            {album.eventDate
                                              ? new Date(album.eventDate).toLocaleDateString()
                                              : "No Date"}

                                          </div>

                                          <div className="badge badge-outline mt-3">

                                            {album.photos?.length || 0} Photos

                                          </div>

                                        </div>

                                        <div className="flex gap-2">

                                          <button
                                            type="button"
                                            className="btn btn-warning btn-sm"
                                            onClick={() =>
                                              editAlbum(
                                                album,
                                                year._id
                                              )
                                            }
                                          >

                                            <Edit3 size={16} />

                                          </button>

                                          <button
                                            type="button"
                                            className="btn btn-error btn-sm"
                                            onClick={() =>
                                              deleteAlbum(
                                                album._id
                                              )
                                            }
                                          >

                                            <Trash2 size={16} />

                                          </button>

                                        </div>

                                      </div>

                                      {/* PHOTO UPLOAD */}

                                      <div className="mt-6">

                                        <label className="btn btn-primary">

                                          <Upload size={18} />

                                          Upload Photos

                                          <input
                                            hidden
                                            multiple
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                              uploadPhotos(
                                                album._id,
                                                e.target.files
                                              )
                                            }
                                          />

                                        </label>

                                      </div>

                                      {/* PHOTO GRID */}

                                      <div className="max-h-80 overflow-y-auto pr-2 mt-6">

                                        <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4">

                                          {album.photos?.map(
                                            (photo) => (

                                              <motion.div
                                                key={photo._id}
                                                whileHover={{
                                                  scale: 1.03,
                                                }}
                                                className="relative group"
                                              >

                                                <img
                                                  src={getImageUrl(photo.image)}
                                                  alt=""
                                                  className="w-full h-40 object-cover rounded-xl"
                                                />

                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

                                                  <button
                                                    type="button"
                                                    className="btn btn-error btn-sm"
                                                    onClick={() =>
                                                      deletePhoto(
                                                        album._id,
                                                        photo._id
                                                      )
                                                    }
                                                  >

                                                    <Trash2 size={16} />

                                                  </button>

                                                </div>

                                              </motion.div>

                                            )
                                          )}

                                        </div>

                                      </div>

                                    </div>

                                  </div>

                                </div>

                              </motion.div>

                            )
                          )}

                        </div>

                      ) : (

                        <div className="alert">

                          <span>

                            No albums available for this year.

                          </span>

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}