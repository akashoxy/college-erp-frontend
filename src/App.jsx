import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

//==============
//profile routes
//==============
import Profile from "./public/profile/Profile";

//==============
// auth routes
//==============
import Login from "./public/auth/Login";
import SignIn from "./public/auth/SignIn";
import ForgotPassword from "./public/auth/ForgotPassword";
import { AuthProvider, useAuth,} from "./context/AuthContext";
import RoleRoute from "./routes/RoleRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicLayout from "../src/components/layout/PublicLayout";

//==============
// admin routes
//==============
import AdminLayout from "./components/admin/admin_look/AdminLayout";
import Dashboard from "./components/admin/admin_look/Dashboard";
import HomepageControl from "./components/admin/admin_pages/home-page/HomepageControl";
import BbaControl from "./components/admin/admin_pages/academics/BbaControl";
import BcaControl from "./components/admin/admin_pages/academics/BcaControl";
import McaControl from "./components/admin/admin_pages/academics/McaControl";
import CetControl from "./components/admin/admin_pages/facilities/CetControl";
import JecaControl from "./components/admin/admin_pages/facilities/JecaControl";
import RadiotihControl from "./components/admin/admin_pages/facilities/RadiotihControl";
import AdminPayments from "./components/admin/admin_pages/student/AdminPayments";
import AdminAdmissionControl from "./components/admin/admin_pages/admission/AdminAdmissionControl";
import WebmagazineAdmin from "./components/admin/admin_pages/facilities/WebmagazineControl";
import ComputerlabAdmin from "./components/admin/admin_pages/facilities/ComputerlabControl";
import AboutLibrary from "./components/admin/admin_pages/facilities/AboutLibraryControl";
import VideogalleryAdmin from "./components/admin/admin_pages/campus-tour/VideogalleryControl";
import AboutUsControl from "./components/admin/admin_pages/home-page/AboutUsControl";
import AntiRaggingControl from "./components/admin/admin_pages/facilities/AntiRaggingControl";
import VisionMissionControl from "./components/admin/admin_pages/home-page/VisionMissionControl";
import ContactEnquiryControl from "./components/admin/admin_pages/contact/ContactEnquiryControl";
import NoticeControl from "./components/admin/admin_pages/notice/NoticeControl";
import PreviousQuestionControl from "./components/admin/admin_pages/student/PreviousQuestionControl";
import PlacementControl from "./components/admin/admin_pages/campus-tour/PlacementControl";
import AcademicCalendarControl from "./components/admin/admin_pages/academics/AcademicCalendarControl";
import HolidayControl from "./components/admin/admin_pages/academics/HolidayControl";
import SparkControl from "./components/admin/admin_pages/life-at-tih/SparkControl";
import VerbenaControl from "./components/admin/admin_pages/life-at-tih/VerbenaControl";
import ApprovalControl from "./components/admin/admin_pages/home-page/ApprovalControl";
import StudentDatabaseControl from "./components/admin/admin_pages/student/StudentDatabaseControl";
import FacultySubjectControl from "./components/admin/admin_pages/faculty/FacultySubjectControl";
import SubjectManagement from "./components/admin/admin_pages/faculty/SubjectManagement";
import AttendanceReport from "./components/admin/admin_pages/faculty/AttendanceReport";
import JournalsAdmin from "./components/admin/admin_pages/facilities/JournalsAdmin";
import CommonRoomControl from "./components/admin/admin_pages/facilities/CommonRoomControl";
import SyllabusControl from "./components/admin/admin_pages/student/SyllabusControl";
import RadioTihControl from "./components/admin/admin_pages/facilities/RadiotihControl";
import EnquiryManagement from "./components/admin/admin_pages/admission/EnquiryManagement";
import AboutLibraryControl from "./components/admin/admin_pages/facilities/AboutLibraryControl";
import FeeStructureControl from "./components/admin/admin_pages/admission/FeeStructureControl";
import AwardsControl from "./components/admin/admin_pages/home-page/AwardsControl";
import FacultyResearchControl from "./components/admin/admin_pages/academics/FacultyResearchControl";
import RecentAcademicWorkControl from "./components/admin/admin_pages/life-at-tih/RecentAcademicWorkControl";
import SportsControl from "./components/admin/admin_pages/life-at-tih/SportsControl";
import PhotoGalleryControl from "./components/admin/admin_pages/campus-tour/PhotoGalleryControl";

//homepage 
import Homepage from "./public/home-page/Homepage";

// home
import AboutUs from "./public/home-page/AboutUs";
import VisionMission from "./public/home-page/VisionMission";
import AwardsPage from "./public/home-page/Awardspage";


//academic
// import AcademicUnit from "./public/academics/AcademicUnit";
import Bba from "./public/academics/Bba";
import Bca from "./public/academics/Bca";
import Mca from "./public/academics/Mca";
import { AcademicCalendar } from "./public/academics/AcademicCalendar";
import ListOfHolidays from "./public/academics/ListOfHolidays";
import FacultyResearch from "./public/academics/FacultyResearch";


//facilities
import AntiRagging from "./public/facilities/AntiRagging";
import CentralLibrary from "./public/facilities/Centrallibrary";
import Cet from "./public/facilities/Cet";
import Jeca from "./public/facilities/Jeca";
import RadioTih from "./public/facilities/Radiotih";
import ComputerLaboratory from "./public/facilities/Computerlaboratory";
import Webmagazine from "./public/facilities/Webmagazine";
import CommonRoom from "./public/facilities/CommonRoom";
import CollegeCanteen from "./public/facilities/CollegeCanteen";
import Journals from "./public/facilities/Journals";

//life-at-tih
import AnnualSportsMeet from "./public/life-at-tih/AnnualSportsMeet";
import RecentAcademicWorks from "./public/life-at-tih/RecentAcademicWorks";
import SparkQuestFest from "./public/life-at-tih/SparkQuestFest";
import VerbenaFest from "./public/life-at-tih/VerbenaFest";


//admission
import AdmissionProcedure from "./public/admission/AdmissionProcedure";
import AdmissionForm from "./public/admission/AdmissionForm";
import FeeStructure from "./public/admission/FeeStructure";


//campus-tour
import Videogallery from "./public/campus-tour/Videogallery";
import PhotoGallery from "./public/campus-tour/PhotoGallery";
import CampusPlacement from "./public/campus-tour/placement/CampusPlacement";
import RecruitersSection from "./public/campus-tour/placement/components/RecruitersSection";
import PlacedStudents from "./public/campus-tour/placement/components/PlacedStudents";
import VirtualTour from "./public/campus-tour/VirtualTour";

//contact
import ContactPage from "./public/contact/ContactPage";


//notice
import CircularNotice from "./public/notice/CircularNotice";


//student public 
import FeesPayment from "./public/student/FeesPayment";
import Syllabus from "./public/student/Syllabus";
import PreviousQuestionPapers from "./public/student/PreviousQuestionPapers";

//faculty protected routes
import FacultyNotes from "./public/faculty/FacultyNotes";
import FacultyAttendance from "./public/faculty/FacultyAttendance";

//student protected routes
import Notes from "./public/student/Notes";
import StudentAttendance from "./public/student/StudentAttendance";

//admin auth profile
import AdminProfile from "./public/profile/AdminProfile";

//sitemap
import Sitemap from "./components/layout/Sitemap";
import TermsAndConditions from "./components/common/Termsandcinditions";








// ============================================
// LOADER
// ============================================

function Loader() {

  return (

    <div className="
      min-h-screen
      grid
      place-items-center
      bg-base-200
    ">

      <span className="
        loading
        loading-spinner
        loading-lg
      "></span>

    </div>

  );

}

// ============================================
// PROTECTED ROUTE
// ============================================

function ProtectedRoute({

  children,

}) {

  const {

    user,
    loading,

  } = useAuth();

  if (loading) {

    return <Loader />;

  }

  return user

    ? children

    : <Navigate to="/login" replace />;

}

// ============================================
// APP
// ============================================

export default function App() {

  return (

    <AuthProvider>

      <Routes>

        {/* AUTH */}

       <Route element={<PublicLayout />}>

          <Route
              path="/login"
              element={<Login />}
          />
          
        <Route
          path="/signin"
          element={<SignIn />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      </Route>


        {/* public-layout */}

        <Route element={<PublicLayout />}>

        {/* homepage */}
        <Route path="/" element={<Homepage />} />

        //sitemap
        <Route
    path="/sitemap"
    element={<Sitemap />}
/>

    <Route
    path="/terms-condition"
    element={<TermsAndConditions />}
/>

        {/* home */}
        <Route
          path="/about-us"
          element={<AboutUs/>}
        />
        <Route
          path="/vision-mission"
          element={<VisionMission />}
        />
         <Route
          path="/awards"
          element={<AwardsPage />}
        />

          {/* academics */}

        {/* <Route
          path="/academic-unit"
          element={<AcademicUnit />}
        /> */}
        <Route
          path="/bba-main"
          element={<Bba />}
        />
        <Route
          path="/bca-main"
          element={<Bca />}
        />

        <Route
          path="/mca-main"
          element={<Mca />}
        />
        <Route
          path="/aca-calendar"
          element={<AcademicCalendar />}
        />
        <Route
          path="/list-holidays"
          element={<ListOfHolidays />}
        />
        <Route
          path="/faculty-research"
          element={<FacultyResearch />}
        />

        {/* facilities */}
        <Route
          path="/cet-main"
          element={<Cet />}
        />
        <Route
          path="/jeca-main"
          element={<Jeca />}
        />
        <Route
          path="/radio-main"
          element={<RadioTih />}
        />
         <Route
          path="/central-library"
          element={<CentralLibrary />}
        />
        <Route
          path="/computer-laboratory"
          element={<ComputerLaboratory />}
        />
        <Route
          path="/web-magazine"
          element={<Webmagazine />}
        />
        <Route
          path="/anti-ragging"
          element={<AntiRagging />}
        />
        <Route
          path="/journals"
          element={<Journals />}
        />
        <Route
          path="/canteen"
          element={<CollegeCanteen />}
        />
        <Route
          path="/common"
          element={<CommonRoom />}
        /> 

         {/* life-at-tih */}
          <Route
          path="/sports"
          element={<AnnualSportsMeet />}
        />
         <Route
          path="/aca-works"
          element={<RecentAcademicWorks />}
        />
         <Route
          path="/spark-quest"
          element={<SparkQuestFest />}
        />
         <Route
          path="/verbena"
          element={<VerbenaFest />}
        />

         {/* admission */}
        <Route
          path="/admission-procedure"
          element={<AdmissionProcedure />}
        />
        <Route
          path="/admission-form"
          element={<AdmissionForm />}
        />
         <Route
          path="/fees-structure"
          element={<FeeStructure />}
        /> 

          {/* campus-tour */}
        <Route
          path="/video-gallery"
          element={<Videogallery />}
        />
        <Route
          path="/campus-placement"
          element={<CampusPlacement />}
        />
        <Route
          path="/placed-stu"
          element={<PlacedStudents />}
        />
        <Route
          path="/recruiters"
          element={<RecruitersSection />}
        />
        <Route
          path="/virtual-tour"
          element={<VirtualTour />}
        />
        <Route
          path="/photo-gallery"
          element={<PhotoGallery />}
        />

          {/* contact */}
        <Route
          path="/contact"
          element={<ContactPage />}
        />

                  {/* notice */}
        <Route
          path="/circular-notice"
          element={<CircularNotice />}
        />

        {/* student */}
        <Route
          path="/fees-payment"
          element={<FeesPayment />}
        />
        <Route
          path="/previous-question"
          element={<PreviousQuestionPapers />}
        />
        <Route
          path="/syllabus"
          element={<Syllabus />}
        />  

         {/* faculty routes  */}
      <Route
  path="/faculty"
  element={
    <RoleRoute allowedRoles={["faculty"]}>
      <Outlet />
    </RoleRoute>
  }
>
      <Route
        path="notes"
        element={<FacultyNotes />}
      /> 


      <Route
        path="attendance"
        element={<FacultyAttendance />}
      />

      </Route>

      {/* student route */}

      <Route
        path="/student"
        element={
          <RoleRoute allowedRoles="student">
            <Outlet />
          </RoleRoute>
        }
      >
      <Route
        path="notes"
        element={<Notes />}
      />

      <Route
        path="attendance"
        element={<StudentAttendance />}
      />

      </Route>



        
        {/* PROFILE*/}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        
        </Route> 

       {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
  path="profile"
  element={<AdminProfile />}
/>

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          

          <Route
            path="homepage"
            element={<HomepageControl />}
          />

          <Route
            path="bba"
            element={<BbaControl />}
          />

          <Route
            path="bca"
            element={<BcaControl />}
          />

          <Route
            path="mca"
            element={<McaControl />}
          />

          <Route
            path="cet"
            element={<CetControl />}
          />

          <Route
            path="jeca"
            element={<JecaControl />}
          />

          <Route
            path="radiotih"
            element={<RadioTihControl />}
          />

          <Route
            path="admin-payment"
            element={<AdminPayments />}
          />

          <Route
          path="admission-enquiry"
          element={<EnquiryManagement />}
        />

        <Route
        path="admission-control"
        element={<AdminAdmissionControl />}
      />

      <Route
        path="webmagazine-control"
        element={<WebmagazineAdmin />}
      />

      <Route
        path="computer-laboratory"
        element={<ComputerlabAdmin />}
      />

      <Route
        path="library-control"
        element={<AboutLibraryControl />}
      />

      <Route
        path="videogallery-control"
        element={<VideogalleryAdmin />}
      />

      <Route
        path="aboutus-control"
        element={<AboutUsControl />}
      />

      <Route
        path="antiragging-control"
        element={<AntiRaggingControl />}
      />

      <Route
        path="visionmission-control"
        element={<VisionMissionControl />}
      />

      <Route
        path="contactenquiry-control"
        element={<ContactEnquiryControl />}
      />

      <Route
        path="notice-control"
        element={<NoticeControl />}
      />

      <Route
        path="pyq-control"
        element={<PreviousQuestionControl />}
      />

      <Route
      path="placement-control"
      element={<PlacementControl />}
      />

      <Route
      path="aca-control"
      element={<AcademicCalendarControl />}
      />

      <Route
      path="holiday-control"
      element={<HolidayControl />}
      />

      <Route
      path="spark-control"
      element={<SparkControl />}
      />

      <Route
      path="verbena-control"
      element={<VerbenaControl />}
      />

      <Route
      path="approval-control"
      element={<ApprovalControl />}
      />

      <Route
        path="/admin/students-data"
        element={
          <StudentDatabaseControl />
        }
      />

      <Route
        path="/admin/sub-control"
        element={
          <FacultySubjectControl />
        }
      />
      <Route
        path="/admin/sub-management"
        element={
          <SubjectManagement />
        }
      />
      <Route
        path="/admin/attendance-control"
        element={
          <AttendanceReport />
        }
      />

      <Route
        path="/admin/journal-control"
        element={
          <JournalsAdmin />
        }
      />

      <Route
        path="/admin/common-control"
        element={
          <CommonRoomControl />
        }
      />

      <Route
        path="/admin/syllabus-control"
        element={
          <SyllabusControl />
        }
      />

      <Route
        path="/admin/fees-structure-control"
        element={
          <FeeStructureControl />
        }
      />

       <Route
        path="/admin/award-control"
        element={
          <AwardsControl />
        }
      />

      <Route
        path="/admin/research-control"
        element={
          <FacultyResearchControl />
        }
      />

      <Route
        path="/admin/academic-work-control"
        element={
          <RecentAcademicWorkControl />
        }
      />

      <Route
        path="/admin/sports-control"
        element={
          <SportsControl />
        }
      />

      <Route
        path="/admin/photo-control"
        element={
          <PhotoGalleryControl />
        }
      />


        </Route>

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </AuthProvider>

  );

}