import React from "react";

function Footer() {
  return (
    <>
      <footer class="bg-white/30 rounded-lg shadow dark:bg-gray-900 m-4">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div class="sm:flex sm:items-center sm:justify-between">
            <a
              href="#"
              class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <span class="gilroy-bold self-center text-2xl whitespace-nowrap text-white">
                MeritMint.
              </span>
            </a>
            <ul class="flex gilroy-light flex-wrap items-center mb-6 text-sm font-medium text-white">
              <li>
                <a href="#HowItWorks" class="hover:underline me-4 md:me-6">
                  How it works
                </a>
              </li>
              <li>
                <a href="#features" class="hover:underline me-4 md:me-6">
                  Features
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" class="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span class="block text-sm text-white sm:text-center">
            © 2023{" "}
            <a href="#" class="hover:underline">
              MeritMint™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
