import { useEffect, useState } from "react";

import {
  CalendarDaysIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import api from "../../../../services/api";

import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

const HolidayControl = () => {

  /* ======================================================
      STATES
  ====================================================== */

  const [holidays, setHolidays] =
    useState([]);

  const [filtered, setFiltered] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [deleteId, setDeleteId] =
    useState(null);

  const [form, setForm] =
    useState({

      date: "",

      day: "",

      particular: "",

    });

  /* ======================================================
      MODALS
  ====================================================== */

  const [statusModal, setStatusModal] =
    useState({

      open: false,

      type: "info",

      title: "",

      message: "",

    });

  const [deleteModalOpen,
    setDeleteModalOpen] =
    useState(false);

  /* ======================================================
      HELPERS
  ====================================================== */

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
      FETCH HOLIDAYS
  ====================================================== */

  const loadData =
    async () => {

      try {

        setFetching(true);

        const { data } =
          await api.get(
            "/holidays"
          );

        if (
          data.success
        ) {

          setHolidays(
            data.data || []
          );

          setFiltered(
            data.data || []
          );

        }

      } catch (error) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data?.message ||

          "Unable to load holiday records."

        );

      } finally {

        setFetching(false);

      }

    };

  useEffect(() => {

    loadData();

  }, []);

  /* ======================================================
      SEARCH
  ====================================================== */

  useEffect(() => {

    const keyword = search.trim().toLowerCase();

setFiltered(
  holidays.filter((item) => {
    const formattedDate = item.date
      ? new Date(item.date)
          .toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
          .toLowerCase()
      : "";

    return (
      formattedDate.includes(keyword) ||
      item.day?.toLowerCase().includes(keyword) ||
      item.particular?.toLowerCase().includes(keyword)
    );
  })
);

  }, [
    holidays,
    search,
  ]);

  /* ======================================================
      INPUT CHANGE
  ====================================================== */

  const handleChange = (
    e
  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  /* ======================================================
      SAVE
  ====================================================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (
          editingId
        ) {

          const { data } =
            await api.put(

              `/holidays/${editingId}`,

              form

            );

          showStatus(

            "success",

            "Updated",

            data.message

          );

        }

        else {

          const { data } =
            await api.post(

              "/holidays",

              form

            );

          showStatus(

            "success",

            "Created",

            data.message

          );

        }

        setForm({

          date: "",

          day: "",

          particular: "",

        });

        setEditingId(
          null
        );

        await loadData();

      }

      catch (error) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data?.message ||

          "Unable to save holiday."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ======================================================
      EDIT
  ====================================================== */

  const handleEdit = (
    holiday
  ) => {

    setEditingId(
      holiday._id
    );

    setForm({

      date:
        holiday.date,

      day:
        holiday.day,

      particular:
        holiday.particular,

    });

    window.scrollTo({

      top: 0,

      behavior:
        "smooth",

    });

  };

  /* ======================================================
      DELETE
  ====================================================== */

  const askDelete =
    (id) => {

      setDeleteId(id);

      setDeleteModalOpen(
        true
      );

    };

  const confirmDelete =
    async () => {

      try {

        setDeleteModalOpen(
          false
        );

        setLoading(true);

        const { data } =
          await api.delete(

            `/holidays/${deleteId}`

          );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

        await loadData();

      }

      catch (error) {

        showStatus(

          "error",

          "Delete Failed",

          error.response?.data?.message ||

          "Unable to delete holiday."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ======================================================
      RETURN
  ====================================================== */

  return (

    <div className="min-h-screen bg-base-200 p-4 md:p-6">

      <div className="max-w-7xl mx-auto space-y-6">
                {/* ======================================================
            HERO
        ====================================================== */}

        <div className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-xl">

          <div className="hero-content text-center text-primary-content py-10">

            <div>

              <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4" />

              <h1 className="text-4xl md:text-5xl font-black">

                Holiday Management

              </h1>

              <p className="mt-3 text-lg opacity-90">

                Manage Academic Holiday Calendar

              </p>

            </div>

          </div>

        </div>

        {/* ======================================================
            DASHBOARD STATS
        ====================================================== */}

        <div className="stats shadow bg-base-100 border border-base-300 w-full">

          <div className="stat">

            <div className="stat-figure text-primary">

              <CalendarDaysIcon className="w-10 h-10" />

            </div>

            <div className="stat-title">

              Total Holidays

            </div>

            <div className="stat-value text-primary">

              {holidays.length}

            </div>

          </div>

        </div>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid lg:grid-cols-12 gap-6">

          {/* ======================================================
              LEFT PANEL
          ====================================================== */}

          <div className="lg:col-span-4">

            <div className="card bg-base-100 border border-base-300 shadow-xl sticky top-24">

              <div className="card-body">

                <h2 className="card-title text-2xl font-black">

                  {editingId

                    ? "Update Holiday"

                    : "Add Holiday"}

                </h2>

                <p className="text-base-content/70">

                  Create and manage academic holiday
                  records.

                </p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 mt-5"
                >

                  {/* DATE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Holiday Date

                      </span>

                    </label>

                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      required
                    />

                  </div>

                  {/* DAY */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Day

                      </span>

                    </label>

                    <select
                      name="day"
                      value={form.day}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >

                      <option value="">

                        Select Day

                      </option>

                      <option>

                        Monday

                      </option>

                      <option>

                        Tuesday

                      </option>

                      <option>

                        Wednesday

                      </option>

                      <option>

                        Thursday

                      </option>

                      <option>

                        Friday

                      </option>

                      <option>

                        Saturday

                      </option>

                      <option>

                        Sunday

                      </option>

                    </select>

                  </div>

                  {/* HOLIDAY */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Holiday Name

                      </span>

                    </label>

                    <input
                      type="text"
                      name="particular"
                      value={form.particular}
                      onChange={handleChange}
                      placeholder="Enter holiday name"
                      className="input input-bordered w-full"
                      required
                    />

                  </div>

                  {/* BUTTONS */}

                  <div className="grid grid-cols-2 gap-3 pt-2">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >

                      {editingId

                        ? "Update"

                        : "Add"}

                    </button>

                    {editingId && (

                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {

                          setEditingId(null);

                          setForm({

                            date: "",

                            day: "",

                            particular: "",

                          });

                        }}
                      >

                        Cancel

                      </button>

                    )}

                  </div>

                </form>

              </div>

            </div>

          </div>

          {/* ======================================================
              RIGHT PANEL
          ====================================================== */}

          <div className="lg:col-span-8">

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <h2 className="card-title text-2xl font-black">

                      Holiday Records

                    </h2>

                    <p className="text-base-content/70">

                      Search, edit and delete holidays.

                    </p>

                  </div>

                  <input
                    type="text"
                    placeholder="Search holidays..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="input input-bordered w-full md:w-72"
                  />

                </div>

                {/* ======================================================
                    TABLE
                ====================================================== */}

                <div className="overflow-x-auto overflow-y-auto max-h-150 rounded-2xl border border-base-300 mt-6">

                  <table className="table table-zebra">

                    <thead className="sticky top-0 z-10 bg-base-100">

                      <tr>

                        <th>Date</th>

                        <th>Day</th>

                        <th>Holiday</th>

                        <th className="text-center">

                          Actions

                        </th>

                      </tr>

                    </thead>

                    <tbody>
                                            {fetching ? (

                        <tr>

                          <td
                            colSpan={4}
                            className="text-center py-16"
                          >

                            <span className="loading loading-spinner loading-lg text-primary"></span>

                          </td>

                        </tr>

                      ) : filtered.length > 0 ? (

                        filtered.map(
                          (holiday) => (

                            <tr
                              key={holiday._id}
                            >

                              {/* DATE */}

                              <td>

                                {new Date(
                                  holiday.date
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}

                              </td>

                              {/* DAY */}

                              <td>

                                <div className="badge badge-outline">

                                  {holiday.day}

                                </div>

                              </td>

                              {/* HOLIDAY */}

                              <td className="font-semibold">

                                {holiday.particular}

                              </td>

                              {/* ACTIONS */}

                              <td>

                                <div className="flex justify-center gap-2">

                                  {/* EDIT */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        holiday
                                      )
                                    }
                                    className="btn btn-sm btn-info"
                                  >

                                    <PencilSquareIcon className="w-4 h-4" />

                                  </button>

                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      askDelete(
                                        holiday._id
                                      )
                                    }
                                    className="btn btn-sm btn-error"
                                  >

                                    <TrashIcon className="w-4 h-4" />

                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan={4}
                            className="text-center py-16"
                          >

                            <div className="flex flex-col items-center gap-4">

                              <CalendarDaysIcon className="w-16 h-16 opacity-40" />

                              <h3 className="text-xl font-bold">

                                No Holidays Found

                              </h3>

                              <p className="text-base-content/60">

                                There are no holiday
                                records matching your
                                search.

                              </p>

                            </div>

                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </div>
                {/* ======================================================
            STICKY FOOTER
        ====================================================== */}

        <div className="sticky bottom-4 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body py-5">

              <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

                <div>

                  <h3 className="font-bold text-lg">

                    Holiday Management Dashboard

                  </h3>

                  <p className="text-base-content/70 text-sm mt-1">

                    Total Holiday Records :

                    {" "}

                    {holidays.length}

                    <br />

                    Search Results :

                    {" "}

                    {filtered.length}

                    <br />

                    {editingId
                      ? "Status : Editing Holiday"
                      : "Status : Ready"}

                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <div className="badge badge-primary badge-lg">

                    Records :

                    {" "}

                    {filtered.length}

                  </div>

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
            ? "Updating Holiday"
            : "Saving Holiday"
        }
        message={
          editingId
            ? "Please wait while the holiday record is updated..."
            : "Please wait while the holiday record is created..."
        }
      />

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="Holiday Record"
        onCancel={() => {

          setDeleteModalOpen(false);

          setDeleteId(null);

        }}
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default HolidayControl;