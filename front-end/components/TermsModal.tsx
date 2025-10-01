import { Dispatch, SetStateAction } from "react";

interface TermsModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  termsAgree: boolean;
  setTermsAgree: Dispatch<SetStateAction<boolean>>;
}

const TermsModal = ({
  isOpen,
  setIsOpen,
  termsAgree,
  setTermsAgree,
}: TermsModalProps) => {
  return (
    <>
      <div
        className={`fixed left-0 top-0 z-10 w-full h-full bg-black ${
          isOpen ? "opacity-60 visible" : "opacity-0 invisible"
        } transition-opacity`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 rounded-xl w-full overflow-auto md:w-[700px] h-10/12 bg-white ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } transition-opacity`}
      >
        <div
          className="absolute right-4 top-4 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="black"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Last Updated:{" "}
              <span className="font-semibold">September 10, 2025</span>
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center text-green-600">
                <i className="fas fa-shield-alt mr-2"></i>
                <span>Email & Password Encryption</span>
              </div>
              <div className="flex items-center text-blue-600">
                <i className="fas fa-lock mr-2"></i>
                <span>Secure Data Storage</span>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-20 z-40">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="#acceptance"
              className="bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Acceptance
            </a>
            <a
              href="#security"
              className="bg-green-50 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-100 transition-colors"
            >
              Security
            </a>
            <a
              href="#privacy"
              className="bg-purple-50 text-purple-700 px-3 py-2 rounded text-sm font-medium hover:bg-purple-100 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#liability"
              className="bg-orange-50 text-orange-700 px-3 py-2 rounded text-sm font-medium hover:bg-orange-100 transition-colors"
            >
              Liability
            </a>
          </div>
        </div> */}

          <div className="bg-white rounded-lg shadow-md p-8">
            <section id="acceptance" className="section-anchor mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Acceptance of Terms
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the Subscription Tracker website
                (&quot;Service&quot;), you agree to be bound by these Terms and
                Conditions (&quot;Terms&quot;). If you do not agree to these
                Terms, please do not use our Service.
              </p>
            </section>

            <section id="security" className="section-anchor mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Data Security and Encryption
                </h2>
              </div>

              <div className="highlight-box p-6 rounded-lg mb-6">
                <div className="flex items-start">
                  <i className="fas fa-lock-shield text-blue-600 text-2xl mr-4 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Advanced Security Measures
                    </h3>
                    <p className="text-blue-800">
                      We use industry-leading encryption to protect your
                      sensitive data
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-key text-blue-500 mr-2"></i>
                    <h4 className="font-semibold text-black">
                      Password Encryption
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    All passwords encrypted using bcrypt hashing with salt
                    protection
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-envelope-shield text-green-500 mr-2"></i>
                    <h4 className="font-semibold text-black">
                      Email Protection
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Emails stored securely with limited access and encryption
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Security Measures
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 pl-5">
                <li>SSL/TLS encryption for all data in transit</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Secure server infrastructure with firewalls</li>
                <li>Regular backups of encrypted data</li>
                <li>Rate limiting on authentication attempts</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  User Responsibilities
                </h2>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You are responsible for maintaining the security of your
                      account credentials and immediately reporting any
                      unauthorized access.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="privacy" className="section-anchor mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Data Collection and Usage
                </h2>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Information We Collect
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Account Information
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Email address (encrypted)</li>
                      <li>• Password (hashed)</li>
                      <li>• Name</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Subscription Data
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Service names</li>
                      <li>• Payment amounts</li>
                      <li>• Billing cycles</li>
                      <li>• Renewal dates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-pink-600 font-bold">5</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Privacy and Data Protection
                </h2>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <div className="flex items-center">
                  <i className="fas fa-database text-green-500 mr-3"></i>
                  <div>
                    <h4 className="font-semibold text-green-900">
                      Your Data Rights
                    </h4>
                    <p className="text-sm text-green-800">
                      You can export your data or request deletion at any time
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-teal-600 font-bold">6</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Email Communication
                </h2>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <i className="fas fa-bell text-blue-500 text-xl mr-4"></i>
                <p className="text-blue-800">
                  You can manage email preferences in your account settings
                </p>
              </div>
            </section>

            <section id="liability" className="section-anchor mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-bold">7</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Limitation of Liability
                </h2>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-red-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      The Service is provided &quot;as is&quot; without
                      warranties. We implement security measures but cannot
                      guarantee absolute prevention of data breaches.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg mt-12">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptance"
                  checked={termsAgree}
                  onChange={() => setTermsAgree(!termsAgree)}
                  className="mt-1 mr-3 w-5 h-5 text-blue-600"
                />
                <label htmlFor="acceptance" className="text-gray-700">
                  I have read, understood, and agree to be bound by these Terms
                  and Conditions. I acknowledge that my email and password will
                  be encrypted and stored securely.
                </label>
              </div>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Continue to Registration
              </button>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Last updated on September 9, 2025 • Version 1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsModal;
