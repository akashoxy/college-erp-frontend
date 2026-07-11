import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Users,
  GraduationCap,
  Library,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Upload,
  Award,
  BookOpen,
  ImagePlus,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

import {
  validateUpload,
} from "../../../../utils/validateUpload";

import {
  previewFile,
} from "../../../../utils/previewFile";

import {
  cleanupBlobUrl,
} from "../../../../utils/blobCleanup";

import {
  getUploadMessage,
} from "../../../../utils/uploadMessages";

import {
  IMAGE_UPLOAD,
} from "../../../../utils/uploadConstants";

const FacultyResearchControl = () => {

  /* ======================================================
      MAIN STATES
  ====================================================== */

  const [facultyData, setFacultyData] =
    useState([]);

  const [filteredData, setFilteredData] =
    useState([]);

  const [fetching, setFetching] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

    /* ======================================================
    VIEW MODE
====================================================== */

const [viewMode, setViewMode] =
  useState("cards");

  /* ======================================================
      IMAGE PREVIEW
  ====================================================== */

  const [previewImage, setPreviewImage] =
    useState("");

  /* ======================================================
      DELETE
  ====================================================== */

  const [deleteModalOpen,
    setDeleteModalOpen] =
    useState(false);

  const [deleteId,
    setDeleteId] =
    useState(null);

  /* ======================================================
      STATUS MODAL
  ====================================================== */

  const [statusModal,
    setStatusModal] =
    useState({

      open: false,

      type: "success",

      title: "",

      message: "",

    });

  const showStatus = (
    type,
    title,
    message
  ) => {

    setStatusModal({

      open: true,

      type,

      title,

      message,

    });

  };

  const closeStatus = () => {

    setStatusModal((prev) => ({

      ...prev,

      open: false,

    }));

  };

  /* ======================================================
      FORM
  ====================================================== */

  const initialForm = {

    category: "faculty",

    name: "",

    designation: "",

    qualification: "",

    department: "",

    email: "",

    phone: "",

    experience: "",

    scholarLink: "",

    orcidLink: "",

    linkedinLink: "",

    featured: false,

    displayOrder: 0,

    researchInterests: [""],

    publications: [""],

    photo: null,

  };

  const [formData,
    setFormData] =
    useState(initialForm);

  /* ======================================================
      LOAD DATA
  ====================================================== */

  const loadFaculty =
    async () => {

      try {

        setFetching(true);

        const { data } =
          await api.get(
            "/faculty-research"
          );

        if (data.success) {

          setFacultyData(
            data.data || []
          );

        }

      }

      catch (error) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data?.message ||

          "Unable to load faculty records."

        );

      }

      finally {

        setFetching(false);

      }

    };

  useEffect(() => {

    loadFaculty();

  }, []);

  /* ======================================================
      FILTER DATA
  ====================================================== */

  useEffect(() => {

    let data = [...facultyData];

    if (
      categoryFilter !== "all"
    ) {

      data =
        data.filter(

          (item) =>

            item.category ===

            categoryFilter

        );

    }

    if (
      searchTerm.trim()
    ) {

      const keyword =
        searchTerm.toLowerCase();

      data =
        data.filter(

          (item) =>

            item.name
              ?.toLowerCase()
              ?.includes(keyword)

            ||

            item.designation
              ?.toLowerCase()
              ?.includes(keyword)

            ||

            item.department
              ?.toLowerCase()
              ?.includes(keyword)

        );

    }

    setFilteredData(data);

  }, [

    facultyData,

    searchTerm,

    categoryFilter,

  ]);

  /* ======================================================
      DASHBOARD STATS
  ====================================================== */

  const stats =
    useMemo(() => ({

      total:
        facultyData.length,

      faculty:
        facultyData.filter(

          (i) =>

            i.category ===
            "faculty"

        ).length,

      lab:
        facultyData.filter(

          (i) =>

            i.category ===
            "lab"

        ).length,

      library:
        facultyData.filter(

          (i) =>

            i.category ===
            "library"

        ).length,

      featured:
        facultyData.filter(

          (i) =>

            i.featured

        ).length,

    }),

    [facultyData]

  );

  /* ======================================================
      INPUT CHANGE
  ====================================================== */

  const handleChange = (
    e
  ) => {

    const {

      name,

      value,

      checked,

      type,

    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:

        type === "checkbox"

          ? checked

          : value,

    }));

  };
    /* ======================================================
      IMAGE UPLOAD
  ====================================================== */

  const handleImageChange = (
    async (e) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

     const validation =
  validateUpload(file, {
    allowImages: true,
  });

      if (!validation.valid) {

        showStatus(

          "error",

          "Invalid Image",

          validation.message

        );

        return;

      }

     cleanupBlobUrl(previewImage);

const preview = previewFile(file);

setPreviewImage(preview.preview);

      setFormData((prev) => ({

        ...prev,

        photo: file,

      }));

    }

  );

  /* ======================================================
      RESET FORM
  ====================================================== */

  const resetForm = () => {

    cleanupBlobUrl(
      previewImage
    );

    setEditingId(null);

    setPreviewImage("");

    setFormData(
      initialForm
    );

  };

  /* ======================================================
      SAVE
  ====================================================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const payload =
          new FormData();

        payload.append(
          "category",
          formData.category
        );

        payload.append(
          "name",
          formData.name
        );

        payload.append(
          "designation",
          formData.designation
        );

        payload.append(
          "qualification",
          formData.qualification
        );

        payload.append(
          "department",
          formData.department
        );

        payload.append(
          "email",
          formData.email
        );

        payload.append(
          "phone",
          formData.phone
        );

        payload.append(
          "experience",
          formData.experience
        );

        payload.append(
          "scholarLink",
          formData.scholarLink
        );

        payload.append(
          "orcidLink",
          formData.orcidLink
        );

        payload.append(
          "linkedinLink",
          formData.linkedinLink
        );

        payload.append(
          "featured",
          formData.featured
        );

        payload.append(
          "displayOrder",
          formData.displayOrder
        );

        payload.append(

          "researchInterests",

          JSON.stringify(

            formData.researchInterests.filter(

              Boolean

            )

          )

        );

        payload.append(

          "publications",

          JSON.stringify(

            formData.publications.filter(

              Boolean

            )

          )

        );

        if (
          formData.photo
        ) {

          payload.append(

            "photo",

            formData.photo

          );

        }

        let response;

        if (
          editingId
        ) {

          response =
            await api.put(

              `/faculty-research/${editingId}`,

              payload

            );

        }

        else {

          response =
            await api.post(

              "/faculty-research",

              payload

            );

        }

        showStatus(

          "success",

          editingId

            ? "Updated"

            : "Created",

          response.data.message

        );

        await loadFaculty();

        resetForm();

      }

      catch (error) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data?.message ||

          "Unable to save faculty member."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ======================================================
      EDIT
  ====================================================== */

  const handleEdit =
    (member) => {

      cleanupBlobUrl(
        previewImage
      );

      setEditingId(
        member._id
      );

      setPreviewImage(

        member.photo || ""

      );

      setFormData({

        category:
          member.category || "faculty",

        name:
          member.name || "",

        designation:
          member.designation || "",

        qualification:
          member.qualification || "",

        department:
          member.department || "",

        email:
          member.email || "",

        phone:
          member.phone || "",

        experience:
          member.experience || "",

        scholarLink:
          member.scholarLink || "",

        orcidLink:
          member.orcidLink || "",

        linkedinLink:
          member.linkedinLink || "",

        featured:
          member.featured || false,

        displayOrder:
          member.displayOrder || 0,

        researchInterests:

          Array.isArray(
            member.researchInterests
          )

            ? member.researchInterests

            : [""],

        publications:

          Array.isArray(
            member.publications
          )

            ? member.publications

            : [""],

        photo: null,

      });

      window.scrollTo({

        top: 0,

        behavior: "smooth",

      });

    };

  /* ======================================================
      REMOVE PHOTO
  ====================================================== */

  const handleRemovePhoto =
    async () => {

      if (!editingId) {

        cleanupBlobUrl(
          previewImage
        );

        setPreviewImage("");

        setFormData((prev) => ({

          ...prev,

          photo: null,

        }));

        return;

      }

      try {

        setLoading(true);

        const { data } =
          await api.delete(

            `/faculty-research/${editingId}/photo`

          );

        showStatus(

          "success",

          "Photo Removed",

          data.message

        );

        setPreviewImage("");

        setFormData((prev) => ({

          ...prev,

          photo: null,

        }));

        await loadFaculty();

      }

      catch (error) {

        showStatus(

          "error",

          "Remove Failed",

          error.response?.data?.message ||

          "Unable to remove faculty photo."

        );

      }

      finally {

        setLoading(false);

      }

    };
      /* ======================================================
      DELETE
  ====================================================== */

  const askDelete = (id) => {

    setDeleteId(id);

    setDeleteModalOpen(true);

  };

  const confirmDelete =
    async () => {

      try {

        setDeleteModalOpen(false);

        setLoading(true);

        const { data } =
          await api.delete(
            `/faculty-research/${deleteId}`
          );

        showStatus(
          "success",
          "Deleted",
          data.message
        );

        await loadFaculty();

      }

      catch (error) {

        showStatus(
          "error",
          "Delete Failed",
          error.response?.data?.message ||
          "Unable to delete faculty member."
        );

      }

      finally {

        setLoading(false);

        setDeleteId(null);

      }

    };

  /* ======================================================
      RESEARCH INTERESTS
  ====================================================== */

  const addResearchField = () => {

    setFormData((prev) => ({

      ...prev,

      researchInterests: [

        ...prev.researchInterests,

        "",

      ],

    }));

  };

  const removeResearchField = (
    index
  ) => {

    if (
      formData.researchInterests.length === 1
    ) return;

    setFormData((prev) => ({

      ...prev,

      researchInterests:

        prev.researchInterests.filter(

          (_, i) => i !== index

        ),

    }));

  };

  const handleResearchChange = (
    index,
    value
  ) => {

    const updated = [

      ...formData.researchInterests,

    ];

    updated[index] = value;

    setFormData((prev) => ({

      ...prev,

      researchInterests: updated,

    }));

  };

  /* ======================================================
      PUBLICATIONS
  ====================================================== */

  const addPublicationField = () => {

    setFormData((prev) => ({

      ...prev,

      publications: [

        ...prev.publications,

        "",

      ],

    }));

  };

  const removePublicationField = (
    index
  ) => {

    if (
      formData.publications.length === 1
    ) return;

    setFormData((prev) => ({

      ...prev,

      publications:

        prev.publications.filter(

          (_, i) => i !== index

        ),

    }));

  };

  const handlePublicationChange = (
    index,
    value
  ) => {

    const updated = [

      ...formData.publications,

    ];

    updated[index] = value;

    setFormData((prev) => ({

      ...prev,

      publications: updated,

    }));

  };

  /* ======================================================
      CATEGORY BADGE
  ====================================================== */

  const getCategoryBadge = (
    category
  ) => {

    switch (category) {

      case "faculty":

        return (

          <span className="badge badge-primary">

            Faculty

          </span>

        );

      case "lab":

        return (

          <span className="badge badge-secondary">

            Laboratory

          </span>

        );

      case "library":

        return (

          <span className="badge badge-accent">

            Library

          </span>

        );

      default:

        return (

          <span className="badge">

            Unknown

          </span>

        );

    }

  };

  /* ======================================================
      RETURN
  ====================================================== */

  return (

    <div className="min-h-screen bg-base-200">

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* ======================================================
            HERO
        ====================================================== */}

        <motion.div

          initial={{

            opacity: 0,

            y: -20,

          }}

          animate={{

            opacity: 1,

            y: 0,

          }}

          className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-xl"

        >

          <div className="hero-content text-center text-primary-content py-12">

            <div>

              <Users
                size={70}
                className="mx-auto mb-5"
              />

              <h1 className="text-5xl font-black">

                Faculty Research Management

              </h1>

              <p className="mt-3 text-lg opacity-90">

                Faculty Members,
                Laboratory Staff &
                Library Professionals

              </p>

            </div>

          </div>

        </motion.div>

        {/* ======================================================
            DASHBOARD STATS
        ====================================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-primary">

              <Users size={32} />

            </div>

            <div className="stat-title">

              Total Members

            </div>

            <div className="stat-value text-primary">

              {stats.total}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-secondary">

              <GraduationCap size={32} />

            </div>

            <div className="stat-title">

              Faculty

            </div>

            <div className="stat-value text-secondary">

              {stats.faculty}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-info">

              <Award size={32} />

            </div>

            <div className="stat-title">

              Laboratory

            </div>

            <div className="stat-value text-info">

              {stats.lab}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-accent">

              <Library size={32} />

            </div>

            <div className="stat-title">

              Library

            </div>

            <div className="stat-value text-accent">

              {stats.library}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

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

        </div>


                <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="card bg-base-100 border border-base-300 shadow-xl"
        >

          <div className="card-body">

            <div className="flex items-center gap-3 mb-6">

              <Plus className="text-primary" />

              <h2 className="card-title text-2xl">

                {editingId
                  ? "Update Faculty Member"
                  : "Add New Faculty Member"}

              </h2>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* ======================================================
                  BASIC INFORMATION
              ====================================================== */}

              <div>

                <h3 className="text-xl font-bold mb-5">

                  Basic Information

                </h3>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Category

                      </span>

                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >

                      <option value="faculty">

                        Faculty Member

                      </option>

                      <option value="lab">

                        Laboratory Staff

                      </option>

                      <option value="library">

                        Library Staff

                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Full Name

                      </span>

                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="input input-bordered w-full"
                      required
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Designation

                      </span>

                    </label>

                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Assistant Professor"
                      className="input input-bordered w-full"
                      required
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Qualification

                      </span>

                    </label>

                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="Ph.D / M.Tech"
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Department

                      </span>

                    </label>

                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Department Name"
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Experience

                      </span>

                    </label>

                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="10 Years"
                      className="input input-bordered w-full"
                    />

                  </div>

                </div>

              </div>

              {/* ======================================================
                  CONTACT INFORMATION
              ====================================================== */}

              <div>

                <h3 className="text-xl font-bold mb-5">

                  Contact Information

                </h3>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Email Address

                      </span>

                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="faculty@college.edu"
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Phone Number

                      </span>

                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91XXXXXXXXXX"
                      className="input input-bordered w-full"
                    />

                  </div>

                </div>

              </div>

              {/* ======================================================
                  PHOTO UPLOAD
              ====================================================== */}

              <div>

                <h3 className="text-xl font-bold mb-5">

                  Faculty Photo

                </h3>

                <div className="grid lg:grid-cols-2 gap-8">

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Upload Faculty Photo

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered w-full"
                    />

                    <label className="label">

                      <span className="label-text-alt">

                        {getUploadMessage(
                          IMAGE_UPLOAD
                        )}

                      </span>

                    </label>

                    <div className="alert alert-info mt-4">

                      <ImagePlus size={18} />

                      <div>

                        <h4 className="font-bold">

                          Supported Upload

                        </h4>

                        <p className="text-sm">

                          JPG, JPEG, PNG, WEBP

                          <br />

                          Maximum File Size:
                          {Math.round(IMAGE_UPLOAD.maxSize / 1024 / 1024)} MB

                          <br />

                          Storage:
                          Cloudinary

                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="flex justify-center">

                    {previewImage ? (

                      <div className="relative">

                        <img
                          src={previewImage}
                          alt="Faculty Preview"
                          className="w-56 h-56 rounded-3xl object-cover border-4 border-base-300 shadow-xl"
                        />

                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="btn btn-error btn-sm absolute top-3 right-3"
                        >

                          Remove

                        </button>

                      </div>

                    ) : (

                      <div className="w-56 h-56 rounded-3xl border-2 border-dashed border-base-300 bg-base-200 flex flex-col justify-center items-center">

                        <Upload
                          size={40}
                          className="opacity-40"
                        />

                        <p className="mt-4 text-center text-sm">

                          Faculty Photo Preview

                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* ======================================================
                  FEATURED SETTINGS
              ====================================================== */}

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Display Order

                    </span>

                  </label>

                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                </div>

                <div className="flex items-end">

                  <label className="label cursor-pointer gap-4">

                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                    />

                    <span className="font-semibold">

                      Featured Faculty Member

                    </span>

                  </label>

                </div>

              </div>

          
                            {/* ======================================================
                  RESEARCH INTERESTS
              ====================================================== */}

              <div>

                <h3 className="text-xl font-bold mb-5">

                  Research Interests

                </h3>

                <div className="space-y-4">

                  {formData.researchInterests.map(

                    (item, index) => (

                      <div
                        key={index}
                        className="flex gap-3"
                      >

                        <input
                          type="text"
                          value={item}
                          placeholder={`Research Interest ${index + 1}`}
                          className="input input-bordered flex-1"
                          onChange={(e) =>
                            handleResearchChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="btn btn-error btn-outline"
                          onClick={() =>
                            removeResearchField(index)
                          }
                        >

                          Remove

                        </button>

                      </div>

                    )

                  )}

                  <button
                    type="button"
                    className="btn btn-primary btn-outline"
                    onClick={addResearchField}
                  >

                    + Add Research Interest

                  </button>

                </div>

              </div>

              {/* ======================================================
                  PUBLICATIONS
              ====================================================== */}

              <div>

                <h3 className="text-xl font-bold mb-5">

                  Publications

                </h3>

                <div className="space-y-4">

                  {formData.publications.map(

                    (item, index) => (

                      <div
                        key={index}
                        className="flex gap-3"
                      >

                        <input
                          type="text"
                          value={item}
                          placeholder={`Publication ${index + 1}`}
                          className="input input-bordered flex-1"
                          onChange={(e) =>
                            handlePublicationChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="btn btn-error btn-outline"
                          onClick={() =>
                            removePublicationField(index)
                          }
                        >

                          Remove

                        </button>

                      </div>

                    )

                  )}

                  <button
                    type="button"
                    className="btn btn-secondary btn-outline"
                    onClick={addPublicationField}
                  >

                    + Add Publication

                  </button>

                </div>

              </div>

              {/* ======================================================
                  ACADEMIC LINKS
              ====================================================== */}

              <div>

                <h3 className="text-xl font-bold mb-5">

                  Academic Profile Links

                </h3>

                <div className="grid md:grid-cols-3 gap-5">

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Google Scholar

                      </span>

                    </label>

                    <input
                      type="url"
                      name="scholarLink"
                      value={formData.scholarLink}
                      onChange={handleChange}
                      placeholder="https://scholar.google.com/..."
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        ORCID Profile

                      </span>

                    </label>

                    <input
                      type="url"
                      name="orcidLink"
                      value={formData.orcidLink}
                      onChange={handleChange}
                      placeholder="https://orcid.org/..."
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        LinkedIn Profile

                      </span>

                    </label>

                    <input
                      type="url"
                      name="linkedinLink"
                      value={formData.linkedinLink}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="input input-bordered w-full"
                    />

                  </div>

                </div>

              </div>

              {/* ======================================================
                  ACTION BUTTONS
              ====================================================== */}

              <div className="flex flex-wrap gap-4 pt-6">

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-wide"
                >

                  {editingId
                    ? "Update Faculty Member"
                    : "Create Faculty Member"}

                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >

                  Reset Form

                </button>

              </div>

            </form>

          </div>

        </motion.div>

       
                {/* ======================================================
            SEARCH & FILTER
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="card bg-base-100 border border-base-300 shadow-xl"
        >

          <div className="card-body">

           <div className="flex flex-col xl:flex-row gap-5 justify-between">

  {/* SEARCH */}

  <div className="relative w-full xl:w-105">

    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
    />

    <input
      type="text"
      placeholder="Search by name, designation or department..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
      className="input input-bordered w-full pl-11"
    />

  </div>

  {/* FILTERS */}

  <div className="flex flex-wrap gap-3">

    <button
      className={`btn ${
        categoryFilter === "all"
          ? "btn-primary"
          : "btn-outline"
      }`}
      onClick={() =>
        setCategoryFilter("all")
      }
    >
      All
    </button>

    <button
      className={`btn ${
        categoryFilter === "faculty"
          ? "btn-primary"
          : "btn-outline"
      }`}
      onClick={() =>
        setCategoryFilter("faculty")
      }
    >
      Faculty
    </button>

    <button
      className={`btn ${
        categoryFilter === "lab"
          ? "btn-secondary"
          : "btn-outline"
      }`}
      onClick={() =>
        setCategoryFilter("lab")
      }
    >
      Laboratory
    </button>

    <button
      className={`btn ${
        categoryFilter === "library"
          ? "btn-accent"
          : "btn-outline"
      }`}
      onClick={() =>
        setCategoryFilter("library")
      }
    >
      Library
    </button>

  </div>

  {/* VIEW TOGGLE */}

  <div className="join">

    <button
      type="button"
      className={`join-item btn ${
        viewMode === "cards"
          ? "btn-primary"
          : "btn-outline"
      }`}
      onClick={() =>
        setViewMode("cards")
      }
    >
      Card View
    </button>

    <button
      type="button"
      className={`join-item btn ${
        viewMode === "table"
          ? "btn-primary"
          : "btn-outline"
      }`}
      onClick={() =>
        setViewMode("table")
      }
    >
      Table View
    </button>

  </div>

</div>

          </div>

        </motion.div>

        {/* ======================================================
            FACULTY GRID
        ====================================================== */}

        {viewMode === "cards" && (

  <>

    {fetching ? (

          <div className="flex justify-center py-24">

            <span className="loading loading-spinner loading-lg text-primary"></span>

          </div>

        ) : filteredData.length === 0 ? (

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body text-center py-20">

              <Users
                size={70}
                className="mx-auto opacity-40"
              />

              <h2 className="text-3xl font-bold mt-5">

                No Faculty Members Found

              </h2>

              <p className="text-base-content/70">

                Try changing the filters
                or create a new faculty member.

              </p>

            </div>

          </div>

        ) : (

          <motion.div
            layout
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
          >

            {filteredData.map(
              (member) => (

                <motion.div
                  key={member._id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden"
                >

                  {/* IMAGE */}

                  <figure className="relative">

                    <img
                      src={
                        member.photo ||

                        "https://placehold.co/600x600?text=Faculty"
                      }
                      alt={member.name}
                      className="w-full h-72 object-cover"
                    />

                    <div className="absolute top-4 left-4">

                      {getCategoryBadge(
                        member.category
                      )}

                    </div>

                    {member.featured && (

                      <div className="absolute top-4 right-4">

                        <div className="badge badge-warning gap-2">

                          <Star size={12} />

                          Featured

                        </div>

                      </div>

                    )}

                  </figure>

                  {/* CONTENT */}

                  <div className="card-body">

                    <h2 className="card-title text-2xl">

                      {member.name}

                    </h2>

                    <p className="font-semibold text-primary">

                      {member.designation}

                    </p>

                    {member.department && (

                      <p className="text-base-content/70">

                        {member.department}

                      </p>

                    )}

                    <div className="divider my-2"></div>

                    {member.qualification && (

                      <p>

                        <strong>

                          Qualification :

                        </strong>

                        {" "}

                        {member.qualification}

                      </p>

                    )}

                    {member.experience && (

                      <p>

                        <strong>

                          Experience :

                        </strong>

                        {" "}

                        {member.experience}

                      </p>

                    )}

                    {member.email && (

                      <p className="truncate">

                        <strong>

                          Email :

                        </strong>

                        {" "}

                        {member.email}

                      </p>

                    )}

                    {/* RESEARCH */}

                    {member.category ===
                      "faculty" &&

                      member.researchInterests
                        ?.length > 0 && (

                      <>

                        <div className="divider my-2">

                          Research

                        </div>

                        <div className="flex flex-wrap gap-2">

                          {member.researchInterests
                            .slice(0, 4)
                            .map(
                              (
                                item,
                                index
                              ) => (

                                <span
                                  key={index}
                                  className="badge badge-outline"
                                >

                                  {item}

                                </span>

                              )
                            )}

                        </div>

                      </>

                    )}

                    {/* PUBLICATIONS */}

                    {member.category ===
                      "faculty" &&

                      member.publications
                        ?.length > 0 && (

                      <div className="mt-5">

                        <div className="badge badge-info gap-2">

                          <BookOpen
                            size={14}
                          />

                          {

                            member.publications
                              .length

                          }

                          {" "}

                          Publications

                        </div>

                      </div>

                    )}

                    {/* ACTIONS */}

                    <div className="card-actions justify-end mt-6">

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          handleEdit(
                            member
                          )
                        }
                      >

                        <Edit size={16} />

                        Edit

                      </button>

                      <button
                        className="btn btn-error btn-sm"
                        onClick={() =>
                          askDelete(
                            member._id
                          )
                        }
                      >

                        <Trash2
                          size={16}
                        />

                        Delete

                      </button>

                    </div>

                  </div>

                </motion.div>

              )
            )}

          </motion.div>

            )}

  </>

)}

        
                {/* ======================================================
            TABLE VIEW
        ====================================================== */}

        {viewMode === "table" && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card bg-base-100 border border-base-300 shadow-xl"
        >

          <div className="card-body">

            <div className="flex items-center justify-between mb-5">

              <h2 className="card-title text-2xl">

                Faculty Directory

              </h2>

              <div className="badge badge-primary badge-lg">

                {filteredData.length} Records

              </div>

            </div>

            <div className="overflow-x-auto rounded-2xl">

              <table className="table table-zebra">

                <thead>

                  <tr>

                    <th>Name</th>

                    <th>Category</th>

                    <th>Designation</th>

                    <th>Department</th>

                    <th>Featured</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredData.map((member) => (

                    <tr key={member._id}>

                      <td>

                        <div className="flex items-center gap-3">

                          <div className="avatar">

                            <div className="w-12 rounded-full">

                              <img
                                src={
                                  member.photo ||
                                  "https://placehold.co/100x100?text=Faculty"
                                }
                                alt={member.name}
                              />

                            </div>

                          </div>

                          <div>

                            <div className="font-bold">

                              {member.name}

                            </div>

                            <div className="text-sm opacity-70">

                              {member.email || "-"}

                            </div>

                          </div>

                        </div>

                      </td>

                      <td>

                        {getCategoryBadge(member.category)}

                      </td>

                      <td>

                        {member.designation}

                      </td>

                      <td>

                        {member.department || "-"}

                      </td>

                      <td>

                        {member.featured ? (

                          <span className="badge badge-warning">

                            Featured

                          </span>

                        ) : (

                          <span className="badge badge-ghost">

                            No

                          </span>

                        )}

                      </td>

                      <td>

                        <div className="flex gap-2">

                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() =>
                              handleEdit(member)
                            }
                          >

                            <Edit size={14} />

                          </button>

                          <button
                            className="btn btn-error btn-xs"
                            onClick={() =>
                              askDelete(member._id)
                            }
                          >

                            <Trash2 size={14} />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </motion.div>
        )}

        {/* ======================================================
            STICKY FOOTER
        ====================================================== */}

        <div className="sticky bottom-4 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body py-5">

              <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

                <div>

                  <h3 className="font-bold text-lg">

                    Faculty Research Management Dashboard

                  </h3>

                  <p className="text-sm text-base-content/70 mt-1">

                    {editingId
                      ? "Status : Editing Faculty Member"
                      : "Status : Ready"}

                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  

                  {editingId && (

                    <div className="badge badge-warning badge-lg">

                      Editing Mode

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          STATUS MODAL
      ====================================================== */}

      <StatusModal
        isOpen={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={closeStatus}
      />

      {/* ======================================================
          LOADING MODAL
      ====================================================== */}

      <LoadingModal
        isOpen={loading}
        title={
          editingId
            ? "Updating Faculty Member"
            : "Saving Faculty Member"
        }
        message={
          editingId
            ? "Please wait while the faculty member is being updated..."
            : "Please wait while the faculty member is being created..."
        }
      />

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="Faculty Member"
        onCancel={() => {

          setDeleteModalOpen(false);

          setDeleteId(null);

        }}
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default FacultyResearchControl;