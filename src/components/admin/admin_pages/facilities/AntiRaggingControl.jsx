import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Shield,
  Users,
  FileText,
  Image,
  Phone,
  Mail,
  Save,
  Trash2,
  RefreshCw,
  Plus,
  Upload,
  LayoutDashboard,
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
  IMAGE_UPLOAD,
} from "../../../../utils/uploadConstants";

import {
  getUploadMessage,
} from "../../../../utils/uploadMessages";

/* ==========================================
   ANIMATION
========================================== */

const fadeUp = {

  hidden: {

    opacity: 0,

    y: 25,

  },

  visible: {

    opacity: 1,

    y: 0,

  },

};

/* ==========================================
   COMPONENT
========================================== */

const AntiRaggingControl = () => {

  /* ======================================
      INITIAL STATE
  ====================================== */

  const initialForm = {

    heroSubtitle: "",

    introductionTitle: "",

    introductionDescription: "",

    helplineNumber: "",

    officialEmail: "",

    reportButtonText:
      "Report Incident",

    complaintButtonText:
      "Lodge Complaint",

    posters: [],

    features: [

      {

        icon: "Shield",

        title: "Safe Campus",

        description:
          "Healthy and respectful student environment.",

      },

      {

        icon: "Scale",

        title: "Strict Action",

        description:
          "Strong disciplinary and legal consequences.",

      },

      {

        icon: "Users",

        title: "Student Support",

        description:
          "Dedicated support for students and freshers.",

      },

      {

        icon: "FileWarning",

        title:
          "Confidential Reporting",

        description:
          "24/7 secure and confidential complaint system.",

      },

    ],

    rules: [],

    committee: [],

  };

  /* ======================================
      STATE
  ====================================== */

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    fetching,

    setFetching,

  ] = useState(true);

  const [

    exists,

    setExists,

  ] = useState(false);

  const [

    formData,

    setFormData,

  ] = useState(initialForm);

  const [

    heroImage,

    setHeroImage,

  ] = useState(null);

  const [

    heroPreview,

    setHeroPreview,

  ] = useState("");

  const [

    statusModal,

    setStatusModal,

  ] = useState({

    open: false,

    type: "success",

    title: "",

    message: "",

  });

  const [

    deleteModal,

    setDeleteModal,

  ] = useState(false);

  /* ======================================
      STATUS MODAL
  ====================================== */

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

  const closeStatus =
    () => {

      setStatusModal(

        (prev) => ({

          ...prev,

          open: false,

        })

      );

    };

  /* ======================================
      LOAD CMS
  ====================================== */

  const loadAntiRagging =
    async () => {

      try {

        setFetching(true);

        const {

          data,

        } = await api.get(

          "/anti-ragging"

        );

        const cms =
          data.data;

        if (!cms) {

          setExists(false);

          return;

        }

        setExists(true);

        setFormData({

    ...initialForm,

    ...cms,

    committee:
        cms.committeeMembers || [],

});

        setHeroPreview(

          cms.heroBackgroundImage ||

          ""

        );

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data?.message ||

          "Unable to load Anti Ragging CMS."

        );

      }

      finally {

        setFetching(false);

      }

    };

  useEffect(() => {

    loadAntiRagging();

    return () => {

      cleanupBlobUrl(

        heroPreview

      );

    };

  }, []);

  /* ======================================
      HERO IMAGE
  ====================================== */

  const handleHeroImage =
    (file) => {

      if (!file)
        return;

      const validation =
        validateUpload(

          file,

          IMAGE_UPLOAD

        );

      if (

        !validation.valid

      ) {

        showStatus(

          "error",

          "Invalid Image",

          validation.message

        );

        return;

      }

      cleanupBlobUrl(

        heroPreview

      );

      setHeroPreview(

        previewFile(file)

      );

      setHeroImage(file);

    };

  /* ======================================
      INPUT
  ====================================== */

  const handleChange =
    (e) => {

      const {

        name,

        value,

      } = e.target;

      setFormData(

        (prev) => ({

          ...prev,

          [name]:

            value,

        })

      );

    };

  /* ======================================
      DASHBOARD STATS
  ====================================== */

  const posterCount =
    formData.posters.length;

  const ruleCount =
    formData.rules.length;

  const committeeCount =
    formData.committee.length;

  const featureCount =
    useMemo(

      () =>

        formData.features.length,

      [formData.features]

    );

  
    /* ======================================
      SAVE CMS
  ====================================== */

  const saveAntiRagging =
    async () => {

      try {

        setLoading(true);

        const form =
          new FormData();

        if (heroImage) {

          form.append(

            "heroBackgroundImage",

            heroImage

          );

        }

 const payload = {

    ...formData,

    posters: formData.posters.map(
        ({ imageFile, ...poster }) => poster
    ),

    committeeMembers: formData.committee.map(

    ({ imageFile, image, ...member }) => ({

        ...member,

        image:
            typeof image === "string"
                ? image
                : ""

    })

)

};

        form.append(
    "data",
    JSON.stringify(payload)
);

formData.posters.forEach((poster, index) => {

    if (poster.imageFile) {

        form.append(
            `posterImage_${index}`,
            poster.imageFile
        );

    }

});

formData.committee.forEach((member, index) => {

    if (member.imageFile) {

        form.append(
            `committeeImage_${index}`,
            member.imageFile
        );

    }

});

        const {

          data,

        } = await api.post(

          "/anti-ragging",

          form

        );

        showStatus(

          "success",

          "Saved",

          data.message

        );

        await loadAntiRagging();

      }

      catch (error) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data?.message ||

          "Unable to save Anti Ragging CMS."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ======================================
      DELETE CMS
  ====================================== */

  const deleteCMS =
    async () => {

      try {

        setDeleteModal(false);

        setLoading(true);

        const {

          data,

        } = await api.delete(

          "/anti-ragging"

        );

        cleanupBlobUrl(

          heroPreview

        );

        setHeroPreview("");

        setHeroImage(null);

        setExists(false);

        setFormData(

          initialForm

        );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

      }

      catch (error) {

        showStatus(

          "error",

          "Delete Failed",

          error.response?.data?.message ||

          "Unable to delete CMS."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ======================================
      POSTERS
  ====================================== */

  const addPoster =
    () => {

      setFormData(

        (prev) => ({

          ...prev,

          posters: [

            ...prev.posters,

            {

              title: "",

              description: "",

              image: "",

              imageFile: null,

            },

          ],

        })

      );

    };

  const updatePoster =
    (

      index,

      field,

      value

    ) => {

      setFormData(

        (prev) => {

          const posters =
            [...prev.posters];

          posters[index] = {

            ...posters[index],

            [field]:
              value,

          };

          return {

            ...prev,

            posters,

          };

        }

      );

    };

  const updatePosterImage =
    (

      index,

      file

    ) => {

      if (!file)
        return;

      const validation =
        validateUpload(

          file,

          IMAGE_UPLOAD

        );

      if (

        !validation.valid

      ) {

        showStatus(

          "error",

          "Invalid Image",

          validation.message

        );

        return;

      }

    const preview = previewFile(file);

setFormData((prev) => {
    const posters = [...prev.posters];

    cleanupBlobUrl(posters[index]?.image);

    posters[index] = {
        ...posters[index],
        image: preview,
        imageFile: file,
    };

    return {
        ...prev,
        posters,
    };
});

    };

  const removePoster =
    (index) => {

      setFormData(

        (prev) => {

          const posters =
            [...prev.posters];

          cleanupBlobUrl(

            posters[index]
              ?.image

          );

          posters.splice(

            index,

            1

          );

          return {

            ...prev,

            posters,

          };

        }

      );

    };

  /* ======================================
      RULES
  ====================================== */

  const addRule =
    () => {

      setFormData(

        (prev) => ({

          ...prev,

          rules: [

            ...prev.rules,

            "",

          ],

        })

      );

    };

  const updateRule =
    (

      index,

      value

    ) => {

      setFormData(

        (prev) => {

          const rules =
            [...prev.rules];

          rules[index] =
            value;

          return {

            ...prev,

            rules,

          };

        }

      );

    };

  const removeRule =
    (index) => {

      setFormData(

        (prev) => {

          const rules =
            [...prev.rules];

          rules.splice(

            index,

            1

          );

          return {

            ...prev,

            rules,

          };

        }

      );

    };

  /* ======================================
      COMMITTEE
  ====================================== */

  const addCommitteeMember =
    () => {

      setFormData(

        (prev) => ({

          ...prev,

          committee: [

            ...prev.committee,

            {

              name: "",

              designation: "",

              phone: "",

              image: "",

              imageFile: null,

            },

          ],

        })

      );

    };

  const updateCommittee =
    (

      index,

      field,

      value

    ) => {

      setFormData(

        (prev) => {

          const committee =
            [...prev.committee];

          committee[index] = {

            ...committee[index],

            [field]:
              value,

          };

          return {

            ...prev,

            committee,

          };

        }

      );

    };

  
    /* ======================================
      RETURN
  ====================================== */

  return (

    <div className="min-h-screen bg-base-200">

      {/* ======================================
          HERO
      ====================================== */}

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="hero bg-linear-to-r from-error via-warning to-secondary text-primary-content rounded-b-3xl shadow-2xl"
      >

        <div className="hero-content text-center py-14">

          <div>

            <Shield
              size={72}
              className="mx-auto mb-5"
            />

            <h1 className="text-5xl font-black">

              Anti Ragging CMS

            </h1>

            <p className="mt-5 max-w-3xl text-lg opacity-90">

              Configure the complete Anti Ragging
              page including hero section,
              committee members, posters,
              rules and reporting information.

            </p>

          </div>

        </div>

      </motion.section>

      {/* ======================================
          DASHBOARD
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-error">

              <Image size={34} />

            </div>

            <div className="stat-title">

              Posters

            </div>

            <div className="stat-value text-error">

              {posterCount}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-warning">

              <FileText size={34} />

            </div>

            <div className="stat-title">

              Rules

            </div>

            <div className="stat-value text-warning">

              {ruleCount}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-primary">

              <Users size={34} />

            </div>

            <div className="stat-title">

              Committee

            </div>

            <div className="stat-value text-primary">

              {committeeCount}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-success">

              <Shield size={34} />

            </div>

            <div className="stat-title">

              Features

            </div>

            <div className="stat-value text-success">

              {featureCount}

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          HERO CMS
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="card-title text-2xl">

                    Hero Section

                  </h2>

                  <p className="text-base-content/70">

                    Manage the Anti Ragging hero area.

                  </p>

                </div>

                <div className="badge badge-error badge-lg">

                  Hero CMS

                </div>

              </div>

              <div className="divider"></div>

              <div className="grid lg:grid-cols-2 gap-8">

                {/* LEFT */}

                <div className="space-y-5">

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Hero Background Image

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={(e) =>
                        handleHeroImage(
                          e.target.files?.[0]
                        )
                      }
                    />

                    <label className="label">

                      <span className="label-text-alt">

                        {getUploadMessage(
                          IMAGE_UPLOAD
                        )}

                      </span>

                    </label>

                  </div>

                  <div>

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Hero Description

                      </span>

                    </label>

                    <textarea
                      rows={6}
                      className="textarea textarea-bordered w-full"
                      name="heroSubtitle"
                      value={formData.heroSubtitle}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* RIGHT */}

                <div>

                  <h3 className="font-bold text-lg mb-3">

                    Hero Preview

                  </h3>

                  <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200 h-80">

                    {heroPreview ? (

                      <img
                        src={heroPreview}
                        alt="Hero"
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center">

                        <Image
                          size={80}
                          className="opacity-30"
                        />

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ======================================
          ABOUT SECTION
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="card-title text-2xl">

                    About Anti Ragging

                  </h2>

                  <p className="text-base-content/70">

                    Configure the introduction section.

                  </p>

                </div>

                <div className="badge badge-warning badge-lg">

                  About

                </div>

              </div>

              <div className="divider"></div>

              <div className="space-y-5">

                <div>

                  <label className="label">

                    <span className="label-text">

                      Section Title

                    </span>

                  </label>

                  <input
                    className="input input-bordered w-full"
                    name="introductionTitle"
                    value={formData.introductionTitle}
                    onChange={handleChange}
                  />

                </div>

                <div>

                  <label className="label">

                    <span className="label-text">

                      Description 1

                    </span>

                  </label>

                  <textarea
                    rows={6}
                    className="textarea textarea-bordered w-full"
                    name="introductionDescription"
                    value={formData.introductionDescription}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      
            {/* ======================================
          CONTACT SECTION
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="card-title text-2xl">

                    Contact & Reporting

                  </h2>

                  <p className="text-base-content/70">

                    Configure Anti Ragging contact information.

                  </p>

                </div>

                <div className="badge badge-success badge-lg">

                  Contact

                </div>

              </div>

              <div className="divider"></div>

              <div className="grid lg:grid-cols-2 gap-6">

                <div>

                  <label className="label">

                    <span className="label-text">

                      Helpline Number

                    </span>

                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-3 top-3.5 text-base-content/50"
                    />

                    <input
                      className="input input-bordered w-full pl-10"
                      name="helplineNumber"
                      value={formData.helplineNumber}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div>

                  <label className="label">

                    <span className="label-text">

                      Official Email

                    </span>

                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-3 top-3.5 text-base-content/50"
                    />

                    <input
                      type="email"
                      className="input input-bordered w-full pl-10"
                      name="officialEmail"
                      value={formData.officialEmail}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div>

                  <label className="label">

                    <span className="label-text">

                      Report Button Text

                    </span>

                  </label>

                  <input
                    className="input input-bordered w-full"
                    name="reportButtonText"
                    value={formData.reportButtonText}
                    onChange={handleChange}
                  />

                </div>

                <div>

                  <label className="label">

                    <span className="label-text">

                      Complaint Button Text

                    </span>

                  </label>

                  <input
                    className="input input-bordered w-full"
                    name="complaintButtonText"
                    value={formData.complaintButtonText}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ======================================
          POSTERS
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="card-title text-2xl">

                    Awareness Posters

                  </h2>

                  <p className="text-base-content/70">

                    Manage awareness posters shown on the website.

                  </p>

                </div>

                <button
                  className="btn btn-primary"
                  onClick={addPoster}
                >

                  <Plus size={18} />

                  Add Poster

                </button>

              </div>

              <div className="divider"></div>

              <div  className="
                space-y-8
                max-h-[80vh]
                overflow-y-auto
                pr-3
              ">

                {formData.posters.map(
                  (
                    poster,
                    index
                  ) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-base-300 p-6 bg-base-200"
                    >

                      <div className="grid lg:grid-cols-2 gap-8">

                        {/* LEFT */}

                        <div className="space-y-5">

                          <div>

                            <label className="label">

                              <span className="label-text">

                                Poster Title

                              </span>

                            </label>

                            <input
                              className="input input-bordered w-full"
                              value={poster.title}
                              onChange={(e) =>
                                updatePoster(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div>

                            <label className="label">

                              <span className="label-text">

                                Description

                              </span>

                            </label>

                            <textarea
                              rows={5}
                              className="textarea textarea-bordered w-full"
                              value={poster.description}
                              onChange={(e) =>
                                updatePoster(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div>

                            <label className="label">

                              <span className="label-text">

                                Poster Image

                              </span>

                            </label>

                            <input
                              type="file"
                              accept="image/*"
                              className="file-input file-input-bordered w-full"
                              onChange={(e) =>
                                updatePosterImage(
                                  index,
                                  e.target.files?.[0]
                                )
                              }
                            />

                            <label className="label">

                              <span className="label-text-alt">

                                {getUploadMessage(
                                  IMAGE_UPLOAD
                                )}

                              </span>

                            </label>

                          </div>

                          <button
                            className="btn btn-error"
                            onClick={() =>
                              removePoster(
                                index
                              )
                            }
                          >

                            <Trash2 size={18} />

                            Remove Poster

                          </button>

                        </div>

                        {/* RIGHT */}

                        <div>

                          <h3 className="font-bold text-lg mb-3">

                            Preview

                          </h3>

                          <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-100 h-80">

                            {poster.image ? (

                              <img
                                src={
                                  typeof poster.image === "string"
                                    ? poster.image
                                    : poster.image?.preview || ""
                                }
                                alt=""
                                className="w-full h-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center">

                                <Image
                                  size={72}
                                  className="opacity-30"
                                />

                              </div>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      
            {/* ======================================
          RULES MANAGEMENT
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="card-title text-2xl">

                    Anti Ragging Rules

                  </h2>

                  <p className="text-base-content/70">

                    Manage all rules displayed on the website.

                  </p>

                </div>

                <button
                  className="btn btn-primary"
                  onClick={addRule}
                >

                  <Plus size={18} />

                  Add Rule

                </button>

              </div>

              <div className="divider"></div>

              <div className="
                space-y-5
                max-h-[65vh]
                overflow-y-auto
                pr-3
              ">

                {formData.rules.map(

                  (rule, index) => (

                    <div
                      key={index}
                      className="flex gap-4 items-start"
                    >

                      <div className="badge badge-primary mt-3">

                        {index + 1}

                      </div>

                      <textarea
                        rows={3}
                        className="textarea textarea-bordered flex-1"
                        placeholder="Enter Anti Ragging Rule..."
                        value={rule}
                        onChange={(e) =>
                          updateRule(
                            index,
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="btn btn-error"
                        onClick={() =>
                          removeRule(index)
                        }
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  )

                )}

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ======================================
          COMMITTEE MANAGEMENT
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="card-title text-2xl">

                    Anti Ragging Committee

                  </h2>

                  <p className="text-base-content/70">

                    Manage committee members.

                  </p>

                </div>

                <button
                  className="btn btn-primary"
                  onClick={addCommitteeMember}
                >

                  <Plus size={18} />

                  Add Member

                </button>

              </div>

              <div className="divider"></div>

              <div  className="
                  space-y-8
                  max-h-[80vh]
                  overflow-y-auto
                  pr-3
                ">

                {formData.committee.map(

                  (member, index) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-base-300 bg-base-200 p-6"
                    >

                      <div className="grid lg:grid-cols-2 gap-8">

                        {/* LEFT */}

                        <div className="space-y-5">

                          <div>

                            <label className="label">

                              <span className="label-text">

                                Member Name

                              </span>

                            </label>

                            <input
                              className="input input-bordered w-full"
                              value={member.name}
                              onChange={(e) =>
                                updateCommittee(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div>

                            <label className="label">

                              <span className="label-text">

                                Designation

                              </span>

                            </label>

                            <input
                              className="input input-bordered w-full"
                              value={member.designation}
                              onChange={(e) =>
                                updateCommittee(
                                  index,
                                  "designation",
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div>

                            <label className="label">

                              <span className="label-text">

                                Phone

                              </span>

                            </label>

                            <input
                              className="input input-bordered w-full"
                              value={member.phone}
                              onChange={(e) =>
                                updateCommittee(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div>

                            <label className="label">

                              <span className="label-text">

                                Member Photo

                              </span>

                            </label>

                            <input
                              type="file"
                              accept="image/*"
                              className="file-input file-input-bordered w-full"
                              onChange={(e) => {

                                const file =
                                  e.target.files?.[0];

                                if (!file)
                                  return;

                                const validation =
                                  validateUpload(
                                    file,
                                    IMAGE_UPLOAD
                                  );

                                if (!validation.valid) {

                                  showStatus(
                                    "error",
                                    "Invalid Image",
                                    validation.message
                                  );

                                  return;

                                }

                                const preview =
                                  previewFile(file);

                                setFormData((prev) => {

                                  const committee = [
                                    ...prev.committee,
                                  ];

                                  cleanupBlobUrl(
                                    committee[index]?.image
                                  );

                                  committee[index] = {
                                    ...committee[index],
                                    image: preview,
                                    imageFile: file,
                                  };

                                  return {
                                    ...prev,
                                    committee,
                                  };

                                });

                              }}
                            />

                            <label className="label">

                              <span className="label-text-alt">

                                {getUploadMessage(
                                  IMAGE_UPLOAD
                                )}

                              </span>

                            </label>

                          </div>

                          <button
                            className="btn btn-error"
                            onClick={() => {

                              setFormData((prev) => {

                                const committee = [
                                  ...prev.committee,
                                ];

                                cleanupBlobUrl(
                                  committee[index]?.image
                                );

                                committee.splice(
                                  index,
                                  1
                                );

                                return {
                                  ...prev,
                                  committee,
                                };

                              });

                            }}
                          >

                            <Trash2 size={18} />

                            Remove Member

                          </button>

                        </div>

                        {/* RIGHT */}

                        <div>

                          <h3 className="font-bold text-lg mb-3">

                            Member Preview

                          </h3>

                          <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-100 h-80">

                            {member.image ? (

                              <img
                                src={
                                  typeof member.image === "string"
                                    ? member.image
                                    : member.image?.preview || ""
                                }
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center">

                                <Users
                                  size={72}
                                  className="opacity-30"
                                />

                              </div>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  )

                )}

              </div>

            </div>

          </div>

        </motion.div>

      </div>

            {/* ======================================
          LIVE WEBSITE PREVIEW
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-10">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="card-title text-2xl">

                    Live Website Preview

                  </h2>

                  <p className="text-base-content/70">

                    Preview the Anti Ragging page before publishing.

                  </p>

                </div>

                <div className="badge badge-success badge-lg">

                  Live Preview

                </div>

              </div>

              <div className="divider"></div>

              {/* ======================================
                  HERO PREVIEW
              ====================================== */}

              <div className="rounded-3xl overflow-hidden border border-base-300 h-105 bg-base-200 relative">

                {heroPreview ? (

                  <img
                    src={heroPreview}
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                ) : (

                  <div className="absolute inset-0 flex items-center justify-center">

                    <Shield
                      size={90}
                      className="opacity-20"
                    />

                  </div>

                )}

                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-10">

                  <h1 className="text-5xl font-black">

                    Anti Ragging Cell

                  </h1>

                  <p className="max-w-3xl mt-6 text-lg">

                    {formData.heroSubtitle ||

                      "Hero description will appear here."}

                  </p>

                </div>

              </div>

              {/* ======================================
                  ABOUT
              ====================================== */}

              <div className="mt-12">

                <h2 className="text-3xl font-black">

                  {formData.introductionTitle ||

                    "About Anti Ragging"}

                </h2>

                <div className="space-y-6 mt-6 leading-8">

                  <p>

                    {formData.introductionDescription ||

                      "Description one..."}

                  </p>

                </div>

              </div>

              {/* ======================================
                  CONTACT
              ====================================== */}

              <div className="mt-14">

                <h2 className="text-3xl font-black mb-6">

                  Contact Information

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="card bg-base-200">

                    <div className="card-body">

                      <Phone
                        size={28}
                      />

                      <h3 className="font-bold">

                        Helpline

                      </h3>

                      <p>

                        {formData.helplineNumber ||

                          "Not configured"}

                      </p>

                    </div>

                  </div>

                  <div className="card bg-base-200">

                    <div className="card-body">

                      <Mail
                        size={28}
                      />

                      <h3 className="font-bold">

                        Email

                      </h3>

                      <p>

                        {formData.officialEmail ||

                          "Not configured"}

                      </p>

                    </div>

                  </div>

                </div>

                <div className="flex flex-wrap gap-4 mt-8">

                  <button className="btn btn-error">

                    {formData.reportButtonText ||

                      "Report Incident"}

                  </button>

                  <button className="btn btn-warning">

                    {formData.complaintButtonText ||

                      "Lodge Complaint"}

                  </button>

                </div>

              </div>

              {/* ======================================
                  POSTERS
              ====================================== */}

              <div className="mt-14">

                <h2 className="text-3xl font-black mb-8">

                  Awareness Posters

                </h2>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {formData.posters.map(

                    (poster, index) => (

                      <div
                        key={index}
                        className="card bg-base-200 border border-base-300"
                      >

                        <figure className="h-56">

                          {poster.image ? (

                            <img
                              src={poster.image}
                              alt={poster.title}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full w-full items-center justify-center">

                              <Image
                                size={60}
                                className="opacity-30"
                              />

                            </div>

                          )}

                        </figure>

                        <div className="card-body">

                          <h3 className="card-title">

                            {poster.title ||

                              "Poster"}

                          </h3>

                          <p>

                            {poster.description ||

                              "Description"}

                          </p>

                        </div>

                      </div>

                    )

                  )}

                </div>

              </div>

              {/* ======================================
                  RULES
              ====================================== */}

              <div className="mt-14">

                <h2 className="text-3xl font-black mb-8">

                  Anti Ragging Rules

                </h2>

                <div className="space-y-4">

                  {formData.rules.map(

                    (rule, index) => (

                      <div
                        key={index}
                        className="flex items-start gap-4 bg-base-200 rounded-xl p-5"
                      >

                        <div className="badge badge-primary">

                          {index + 1}

                        </div>

                        <p>

                          {rule}

                        </p>

                      </div>

                    )

                  )}

                </div>

              </div>

              {/* ======================================
                  COMMITTEE
              ====================================== */}

              <div className="mt-14">

                <h2 className="text-3xl font-black mb-8">

                  Anti Ragging Committee

                </h2>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {formData.committee.map(

                    (member, index) => (

                      <div
                        key={index}
                        className="card bg-base-200 border border-base-300"
                      >

                        <figure className="h-64">

                          {member.image ? (

                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full w-full items-center justify-center">

                              <Users
                                size={70}
                                className="opacity-30"
                              />

                            </div>

                          )}

                        </figure>

                        <div className="card-body text-center">

                          <h3 className="font-bold text-lg">

                            {member.name ||

                              "Member Name"}

                          </h3>

                          <p>

                            {member.designation}

                          </p>

                          <p className="text-sm opacity-70">

                            {member.phone}

                          </p>

                        </div>

                      </div>

                    )

                  )}

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>


            {/* ======================================
          STICKY FOOTER
      ====================================== */}

      <div className="sticky bottom-4 z-40 px-6 pb-6">

        <div className="card bg-base-100 border border-base-300 shadow-2xl">

          <div className="card-body py-5">

            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            

              <div className="flex flex-wrap gap-3">

                <button
                  className="btn btn-primary"
                  onClick={saveAntiRagging}
                >

                  <Save size={18} />

                  Save CMS

                </button>

                <button
                  className="btn btn-outline"
                  onClick={loadAntiRagging}
                >

                  <RefreshCw size={18} />

                  Reload

                </button>

                <button
                  className="btn btn-error"
                  onClick={() =>
                    setDeleteModal(true)
                  }
                >

                  <Trash2 size={18} />

                  Delete CMS

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          STATUS MODAL
      ====================================== */}

      <StatusModal
        isOpen={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={closeStatus}
      />

      {/* ======================================
          LOADING MODAL
      ====================================== */}

      <LoadingModal
        isOpen={loading || fetching}
        title={
          fetching
            ? "Loading Anti Ragging CMS"
            : "Saving Changes"
        }
        message={
          fetching
            ? "Please wait while the CMS data is loading..."
            : "Please wait while your changes are being processed..."
        }
      />

      {/* ======================================
          DELETE MODAL
      ====================================== */}

      <DeleteModal
        isOpen={deleteModal}
        itemName="Anti Ragging CMS"
        onCancel={() =>
          setDeleteModal(false)
        }
        onConfirm={deleteCMS}
      />

    </div>

  );

};

export default AntiRaggingControl;