import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import api from "../../../../services/api";


import {
  AcademicCapIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const iconOptions = [
  "AcademicCapIcon",
  "LightBulbIcon",
  "Cog6ToothIcon",
  "GlobeAltIcon",
];

export default function VisionMissionControl() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingId, setExistingId] = useState(null);

  const [formData, setFormData] = useState({
    heroTitle: "",
    heroDescription: "",
    visionTitle: "",
    visionDescription: "",
    missions: [
      {
        icon: "AcademicCapIcon",
        title: "",
        description: "",
      },
    ],
  });

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchVisionMission = async () => {
    try {
      setFetching(true);

      const res = await api.get("/vision-mission");

      if (res.data?.data) {
        const data = res.data.data;

        setExistingId(data._id);

        setFormData({
          heroTitle: data.heroTitle || "",
          heroDescription: data.heroDescription || "",

          visionTitle: data.visionTitle || "",
          visionDescription: data.visionDescription || "",

          missions:
            data.missions?.length > 0
              ? data.missions
              : [
                  {
                    icon: "AcademicCapIcon",
                    title: "",
                    description: "",
                  },
                ],
        });
      }
    } catch (error) {
      console.error("Vision Mission Fetch Error:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchVisionMission();
  }, []);

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // MISSION HANDLERS
  // ==========================================

  const handleMissionChange = (
    index,
    field,
    value
  ) => {
    const updated = [...formData.missions];

    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      missions: updated,
    }));
  };

  const addMission = () => {
    setFormData((prev) => ({
      ...prev,
      missions: [
        ...prev.missions,
        {
          icon: "AcademicCapIcon",
          title: "",
          description: "",
        },
      ],
    }));
  };

  const removeMission = (index) => {
    const updated = [...formData.missions];

    updated.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      missions:
        updated.length > 0
          ? updated
          : [
              {
                icon: "AcademicCapIcon",
                title: "",
                description: "",
              },
            ],
    }));
  };
    // ==========================================
  // CREATE
  // ==========================================

  const handleCreate = async () => {
    try {
      setLoading(true);

      await api.post("/vision-mission", formData);

      alert(
        "Vision & Mission Created Successfully"
      );

      fetchVisionMission();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed To Create"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE
  // ==========================================

  const handleUpdate = async () => {
    if (!existingId) {
      return alert(
        "No document found. Create first."
      );
    }

    try {
      setLoading(true);

      await api.put(
        `/vision-mission/${existingId}`,
        formData
      );

      alert("Updated Successfully");

      fetchVisionMission();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE ALL
  // ==========================================

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all Vision & Mission data?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await api.delete("/vision-mission");

      alert("Deleted Successfully");

      setExistingId(null);

      setFormData({
        heroTitle: "",
        heroDescription: "",
        visionTitle: "",
        visionDescription: "",

        missions: [
          {
            icon: "AcademicCapIcon",
            title: "",
            description: "",
          },
        ],
      });
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Delete Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ICON RENDERER
  // ==========================================

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "AcademicCapIcon":
        return (
          <AcademicCapIcon className="w-10 h-10 text-primary" />
        );

      case "LightBulbIcon":
        return (
          <LightBulbIcon className="w-10 h-10 text-primary" />
        );

      case "Cog6ToothIcon":
        return (
          <Cog6ToothIcon className="w-10 h-10 text-primary" />
        );

      case "GlobeAltIcon":
        return (
          <GlobeAltIcon className="w-10 h-10 text-primary" />
        );

      default:
        return (
          <AcademicCapIcon className="w-10 h-10 text-primary" />
        );
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
       {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-3xl
            bg-linear-to-r
            from-primary
            to-secondary
            text-primary-content
            p-8
            shadow-xl
            mb-8
          "
        >
          <h1 className="text-4xl font-bold mb-2">
            Vision & Mission Management
          </h1>

          <p className="text-primary-content/80">
            Manage institutional vision,
            mission and strategic objectives.
          </p>
        </motion.div>

        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h3 className="text-sm text-base-content/60">
                Total Missions
              </h3>

              <p className="text-4xl font-bold text-primary">
                {formData.missions.length}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h3 className="text-sm text-base-content/60">
                Document Status
              </h3>

              <p className="text-4xl font-bold text-success">
                {existingId
                  ? "Active"
                  : "Empty"}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h3 className="text-sm text-base-content/60">
                Preview Mode
              </h3>

              <p className="text-4xl font-bold text-info">
                Live
              </p>
            </div>
          </div>

        </div>

        {/* ================================= */}
        {/* MAIN GRID */}
        {/* ================================= */}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ================================= */}
          {/* LEFT FORM PANEL */}
          {/* ================================= */}

          <div className="card bg-base-100 shadow-xl border border-base-300">

            <div className="card-body">

              <h2 className="card-title text-2xl mb-6">
                Vision & Mission Content
              </h2>

              {/* Hero Title */}

              <div className="form-control mb-5">
                <label className="label">
                  <span className="label-text font-semibold">
                    Hero Title
                  </span>
                </label>

                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Hero Description */}

              <div className="form-control mb-5">
                <label className="label">
                  <span className="label-text font-semibold">
                    Hero Description
                  </span>
                </label>

                <textarea
                  rows={4}
                  name="heroDescription"
                  value={formData.heroDescription}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              {/* Vision Title */}

              <div className="form-control mb-5">
                <label className="label">
                  <span className="label-text font-semibold">
                    Vision Title
                  </span>
                </label>

                <input
                  type="text"
                  name="visionTitle"
                  value={formData.visionTitle}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Vision Description */}

              <div className="form-control mb-8">
                <label className="label">
                  <span className="label-text font-semibold">
                    Vision Description
                  </span>
                </label>

                <textarea
                  rows={6}
                  name="visionDescription"
                  value={formData.visionDescription}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                />
              </div>
                            {/* ================================= */}
              {/* MISSION SECTION */}
              {/* ================================= */}

              <div className="divider">
                Mission Cards
              </div>

              <div className="flex items-center justify-between mb-6">

                <h3 className="text-xl font-bold">
                  Mission Cards
                </h3>

                <button
                  type="button"
                  onClick={addMission}
                  className="btn btn-primary btn-sm"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Add Mission
                </button>

              </div>

              {formData.missions.map(
                (mission, index) => (
                  <div
                    key={index}
                    className="
                      card
                      bg-base-200
                      border
                      border-base-300
                      shadow-md
                      mb-5
                    "
                  >
                    <div className="card-body">

                      <div className="flex items-center justify-between">

                        <h4 className="font-bold text-lg">
                          Mission #{index + 1}
                        </h4>

                        <button
                          type="button"
                          onClick={() =>
                            removeMission(index)
                          }
                          className="btn btn-error btn-sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>

                      </div>

                      {/* Icon */}

                      <div className="form-control">

                        <label className="label">
                          <span className="label-text">
                            Select Icon
                          </span>
                        </label>

                        <select
                          value={mission.icon}
                          onChange={(e) =>
                            handleMissionChange(
                              index,
                              "icon",
                              e.target.value
                            )
                          }
                          className="select select-bordered w-full"
                        >
                          {iconOptions.map(
                            (icon) => (
                              <option
                                key={icon}
                                value={icon}
                              >
                                {icon}
                              </option>
                            )
                          )}
                        </select>

                      </div>

                      {/* Mission Title */}

                      <div className="form-control">

                        <label className="label">
                          <span className="label-text">
                            Mission Title
                          </span>
                        </label>

                        <input
                          type="text"
                          value={mission.title}
                          onChange={(e) =>
                            handleMissionChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="input input-bordered w-full"
                        />

                      </div>

                      {/* Mission Description */}

                      <div className="form-control">

                        <label className="label">
                          <span className="label-text">
                            Mission Description
                          </span>
                        </label>

                        <textarea
                          rows={4}
                          value={
                            mission.description
                          }
                          onChange={(e) =>
                            handleMissionChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="textarea textarea-bordered w-full"
                        />

                      </div>

                    </div>
                  </div>
                )
              )}

              {/* ================================= */}
              {/* ACTION BUTTONS */}
              {/* ================================= */}

              <div className="divider">
                Actions
              </div>

              <div className="flex flex-wrap gap-4">

                {!existingId && (
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="btn btn-success"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    Create
                  </button>
                )}

                {existingId && (
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                    Update
                  </button>
                )}

                <button
                  onClick={handleDeleteAll}
                  disabled={loading}
                  className="btn btn-error"
                >
                  <TrashIcon className="w-5 h-5" />
                  Delete All
                </button>

              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* LIVE PREVIEW PANEL */}
          {/* ================================= */}

          <div
            className="
              card
              bg-base-100
              shadow-xl
              border
              border-base-300
              sticky
              top-6
              h-fit
            "
          >
            <div className="card-body">

              <div className="flex items-center gap-3 mb-6">

                <EyeIcon className="w-6 h-6 text-primary" />

                <h2 className="text-2xl font-bold">
                  Live Preview
                </h2>

              </div>

              {/* Hero Preview */}

              <div className="text-center mb-8">

                <h1 className="text-4xl font-bold">
                  {formData.heroTitle ||
                    "Vision & Mission"}
                </h1>

                <p className="mt-4 text-base-content/70">
                  {formData.heroDescription ||
                    "Hero description preview"}
                </p>

              </div>

              {/* Vision Preview */}

              <div
                className="
                  bg-base-200
                  rounded-2xl
                  p-6
                  mb-8
                  border
                  border-base-300
                "
              >
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {formData.visionTitle ||
                    "Our Vision"}
                </h2>

                <p className="text-base-content/80">
                  {formData.visionDescription ||
                    "Vision description preview"}
                </p>
              </div>
                            {/* ================================= */}
              {/* MISSION PREVIEW GRID */}
              {/* ================================= */}

              <div className="grid md:grid-cols-2 gap-4">

                {formData.missions.map(
                  (mission, index) => (
                    <div
                      key={index}
                      className="
                        card
                        bg-base-200
                        border
                        border-base-300
                        shadow-md
                        hover:shadow-lg
                        transition-all
                        duration-300
                      "
                    >
                      <div className="card-body">

                        {/* Dynamic Icon */}

                        <div className="mb-3">
                          {renderIcon(
                            mission.icon
                          )}
                        </div>

                        {/* Mission Title */}

                        <h3 className="text-lg font-bold">
                          {mission.title ||
                            "Mission Title"}
                        </h3>

                        {/* Mission Description */}

                        <p className="text-sm text-base-content/70 leading-relaxed">
                          {mission.description ||
                            "Mission description preview will appear here."}
                        </p>

                      </div>
                    </div>
                  )
                )}

              </div>

              {/* ================================= */}
              {/* PREVIEW STATUS */}
              {/* ================================= */}

              <div
                className="
                  alert
                  alert-info
                  mt-8
                  border
                  border-info/20
                "
              >
                <EyeIcon className="w-5 h-5" />

                <div>

                  <h3 className="font-bold">
                    Live Preview Enabled
                  </h3>

                  <div className="text-xs">
                    Changes are reflected instantly
                    in the preview panel.
                  </div>

                </div>

              </div>

              {/* ================================= */}
              {/* DOCUMENT STATUS */}
              {/* ================================= */}

              <div className="stats stats-vertical lg:stats-horizontal shadow mt-6 w-full">

                <div className="stat">

                  <div className="stat-title">
                    Missions
                  </div>

                  <div className="stat-value text-primary">
                    {formData.missions.length}
                  </div>

                </div>

                <div className="stat">

                  <div className="stat-title">
                    Status
                  </div>

                  <div
                    className={`stat-value text-lg ${
                      existingId
                        ? "text-success"
                        : "text-warning"
                    }`}
                  >
                    {existingId
                      ? "Active"
                      : "Draft"}
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ================================= */}
        {/* STICKY FOOTER */}
        {/* ================================= */}

        <div
          className="
            sticky
            bottom-0
            mt-8
            z-50
          "
        >
          <div
            className="
              card
              bg-base-100
              border
              border-base-300
              shadow-2xl
            "
          >
            <div
              className="
                card-body
                flex
                flex-col
                md:flex-row
                items-center
                justify-between
                gap-4
              "
            >

              <div>

                <h3 className="font-bold text-lg">
                  Vision & Mission CMS
                </h3>

                <p className="text-sm text-base-content/70">
                  Manage institutional vision,
                  mission and strategic goals.
                </p>

              </div>

              <div className="flex gap-3">

                {!existingId && (
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="btn btn-success"
                  >
                    <PlusCircleIcon className="w-5 h-5" />

                    {loading
                      ? "Creating..."
                      : "Create"}
                  </button>
                )}

                {existingId && (
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    <PencilSquareIcon className="w-5 h-5" />

                    {loading
                      ? "Updating..."
                      : "Update"}
                  </button>
                )}

                <button
                  onClick={handleDeleteAll}
                  disabled={loading}
                  className="btn btn-error"
                >
                  <TrashIcon className="w-5 h-5" />
                  Delete All
                </button>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}