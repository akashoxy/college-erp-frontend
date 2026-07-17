import { useState } from "react";



const INSTITUTION_NAME = "Techno College Hooghly";
const EFFECTIVE_DATE = "July 18, 2026";
const CONTACT_EMAIL = "contact@tih.edu.in";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: `By accessing or using the ${INSTITUTION_NAME} website, Student ERP, Faculty Portal, administrative services, or any other digital facility provided through this platform, you agree to comply with these Terms and Conditions. These terms apply to students, faculty members, administrators, visitors, and other authorized users of the platform. If you do not agree with these terms, you should not access restricted services provided through the platform.`,
  },
  {
    id: "purpose",
    title: "2. Purpose of the Platform",
    body: `This platform is designed to support the digital services and academic operations of ${INSTITUTION_NAME}. It provides access to institutional information, academic programs, notices, attendance information, faculty resources, study materials, campus information, placement-related content, events, online services, and other academic or administrative facilities made available by the institution.`,
  },
  {
    id: "eligibility",
    title: "3. User Eligibility and Access",
    body: `Public sections of the website may be accessed by visitors without registration. Restricted features, including Student ERP, Faculty Portal, and administrative management services, are available only to authorized users. Access permissions are determined according to the role assigned to each user, such as Student, Faculty, or Administrator.`,
  },
  {
    id: "accounts",
    title: "4. User Accounts and Security",
    body: `Users who receive or create an account must provide accurate information and are responsible for maintaining the confidentiality of their login credentials. Account credentials must not be shared with unauthorized persons. Users must promptly report suspected unauthorized access or misuse of their accounts. ${INSTITUTION_NAME} may restrict, suspend, or deactivate an account when necessary to protect the security and integrity of the platform.`,
  },
  {
    id: "academic-services",
    title: "5. Academic and ERP Services",
    body: `The platform may provide academic and ERP-related information including student profiles, courses, subjects, semesters, attendance records, faculty assignments, study materials, academic calendars, holidays, notices, and other institutional records. Users must use these services only for legitimate academic and administrative purposes. The institution reserves the right to update or correct information when required.`,
  },
  {
    id: "attendance",
    title: "6. Attendance and Academic Records",
    body: `Attendance and other academic information displayed through the platform are maintained for academic and administrative purposes. Faculty members may be authorized to record or update attendance for assigned subjects, while students may access information relevant to their academic profile. In case of any discrepancy, users should contact the appropriate faculty member or institutional authority for verification.`,
  },
  {
    id: "materials",
    title: "7. Study Materials and Digital Resources",
    body: `Faculty members may upload notes, documents, PDFs, presentations, and other academic resources for student use. These materials are intended primarily for educational purposes and authorized users of the institution. Users must not misuse, commercially redistribute, modify, or reproduce restricted academic materials without appropriate authorization from the institution or the respective content owner.`,
  },
  {
    id: "acceptable-use",
    title: "8. Acceptable Use",
    body: `Users must use the platform responsibly and lawfully. Users must not attempt to gain unauthorized access to accounts, administrative systems, databases, APIs, servers, or restricted resources. Uploading malicious files, interfering with platform functionality, impersonating another user, manipulating academic records, attempting to bypass authentication or authorization controls, or using the platform for unlawful activities is strictly prohibited.`,
  },
  {
    id: "content",
    title: "9. Institutional Content",
    body: `The platform may contain information related to academic programs, admissions, placements, notices, events, campus facilities, faculty, student activities, galleries, publications, and other institutional services. Authorized administrators may update this content through the Content Management System. While reasonable efforts are made to maintain accurate and current information, official institutional notifications and communications should be considered authoritative where any discrepancy occurs.`,
  },
  {
    id: "uploads",
    title: "10. User-Submitted and Uploaded Content",
    body: `Authorized users may be permitted to upload images, documents, PDFs, videos, or other files depending on their assigned role and permissions. Users are responsible for ensuring that uploaded content is appropriate, lawful, relevant to institutional activities, and does not violate intellectual property rights or the rights of others. The institution may remove content that violates these terms or institutional policies.`,
  },
  {
    id: "payments",
    title: "11. Online Payments",
    body: `Where online payment facilities are made available through the platform, users are responsible for providing accurate payment and transaction information. Payments may be processed through authorized third-party payment service providers. Users should verify transaction status and retain payment receipts or references where applicable. Any payment-related dispute or discrepancy should be reported through the appropriate institutional support channel.`,
  },
  {
    id: "privacy",
    title: "12. Privacy and Data Protection",
    body: `The platform may process information necessary for academic, administrative, authentication, communication, and institutional purposes. Access to personal or academic information is restricted according to authorized user roles and system permissions. Users must not attempt to access, collect, disclose, or misuse information belonging to other users without authorization.`,
  },
  {
    id: "third-party",
    title: "13. Third-Party Services",
    body: `Certain platform features may rely on third-party technology or service providers for services such as cloud hosting, database infrastructure, media storage, payment processing, or external links. The availability and operation of these services may be subject to the respective provider's policies and technical conditions. ${INSTITUTION_NAME} is not responsible for independent third-party websites accessed through external links.`,
  },
  {
    id: "availability",
    title: "14. Platform Availability",
    body: `The institution aims to keep its digital services accessible and functional; however, uninterrupted availability cannot be guaranteed. Access may occasionally be affected by maintenance, software updates, server issues, network problems, security measures, or circumstances beyond the institution's reasonable control.`,
  },
  {
    id: "administration",
    title: "15. Administrative Rights",
    body: `Authorized administrators may manage website content, user access, academic information, notices, institutional resources, and other platform data according to their assigned responsibilities. The institution reserves the right to modify, restrict, suspend, or discontinue any platform feature when required for administrative, academic, security, maintenance, or operational reasons.`,
  },
  {
    id: "termination",
    title: "16. Suspension or Termination of Access",
    body: `Access to restricted services may be suspended or terminated when a user is no longer eligible to use the service, violates these terms, attempts unauthorized system access, misuses institutional resources, or creates a security risk. Student and faculty access may also change according to institutional status and administrative decisions.`,
  },
  {
    id: "disclaimer",
    title: "17. Disclaimer",
    body: `The platform is provided to support institutional, academic, informational, and administrative activities. While reasonable efforts are made to ensure accuracy and reliability, certain information may be updated, corrected, or temporarily unavailable. Users should verify critical academic, admission, examination, payment, or administrative information through official institutional communications when necessary.`,
  },
  {
    id: "liability",
    title: "18. Limitation of Liability",
    body: `${INSTITUTION_NAME} shall not be responsible for losses resulting from unauthorized account access caused by a user's failure to protect login credentials, misuse of the platform, third-party service interruptions, network failures, or circumstances beyond reasonable institutional control, subject to applicable laws and regulations.`,
  },
  {
    id: "changes",
    title: "19. Changes to These Terms",
    body: `${INSTITUTION_NAME} may revise these Terms and Conditions when necessary to reflect changes in institutional policies, digital services, academic processes, legal requirements, or platform functionality. Updated terms will be published on this page with the revised effective date. Continued use of the platform after an update indicates acceptance of the revised terms.`,
  },
  {
    id: "governing-law",
    title: "20. Governing Law",
    body: `These Terms and Conditions shall be governed by and interpreted in accordance with the applicable laws and regulations of India. Any matters relating to institutional policies shall also remain subject to the applicable rules, regulations, and decisions of the relevant educational and institutional authorities.`,
  },
  {
    id: "contact",
    title: "21. Contact and Support",
    body: `For questions regarding these Terms and Conditions or the use of the platform, users may contact ${INSTITUTION_NAME} through the official institutional contact channels or by email at ${CONTACT_EMAIL}.`,
  },
];

export default function TermsAndConditions() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  const scrollToSection = (id) => {
    setActiveId(id);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="breadcrumbs mb-3 text-sm text-base-content/60">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>

              <li>Terms & Conditions</li>
            </ul>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-relaxed text-base-content/70">
            Terms governing access to and use of the {INSTITUTION_NAME} digital
            website, academic services, ERP facilities, and institutional
            resources.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="badge badge-outline">
              Effective: {EFFECTIVE_DATE}
            </div>

            <div className="badge badge-primary badge-outline">
              {INSTITUTION_NAME}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* =================================================
            TABLE OF CONTENTS
        ================================================= */}
        <aside className="md:col-span-1">
          <div className="card sticky top-6 border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-base-content/60">
                Contents
              </h2>

              <div className="max-h-[70vh] overflow-y-auto">
                <ul className="menu menu-sm w-full p-0">
                  {SECTIONS.map((section) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className={
                          activeId === section.id
                            ? "active font-medium"
                            : ""
                        }
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* =================================================
            TERMS CONTENT
        ================================================= */}
        <main className="md:col-span-3">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-6 md:p-10">
              {/* Introduction */}
              <div className="mb-10 border-b border-base-300 pb-8">
                <h2 className="text-xl font-semibold text-base-content">
                  Introduction
                </h2>

                <p className="mt-3 leading-7 text-base-content/70">
                  Please read these Terms and Conditions carefully before
                  accessing or using the digital services provided through the{" "}
                  {INSTITUTION_NAME} platform.
                </p>

                <p className="mt-3 leading-7 text-base-content/70">
                  These terms are intended to promote the secure, responsible,
                  and appropriate use of the institution's website, academic
                  management services, ERP facilities, and digital resources.
                </p>
              </div>

              {/* Terms Sections */}
              <div className="space-y-10">
                {SECTIONS.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-xl font-semibold text-base-content">
                      {section.title}
                    </h2>

                    <p className="mt-3 leading-7 text-base-content/70">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>

              {/* Footer Notice */}
              <div className="mt-12 rounded-box border border-base-300 bg-base-200 p-5">
                <p className="text-sm leading-6 text-base-content/70">
                  <span className="font-semibold text-base-content">
                    Important:
                  </span>{" "}
                  These Terms and Conditions govern the use of this digital
                  platform. Official academic and administrative decisions
                  remain subject to the rules, regulations, notices, and
                  policies issued by {INSTITUTION_NAME} and the relevant
                  educational authorities.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}