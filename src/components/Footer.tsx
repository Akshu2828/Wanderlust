import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import React from "react";

function Footer() {
  return (
    <div className=" bg-gray-200 mt-auto p-4 w-full flex flex-col items-center">
      <div className="flex gap-4 mb-2 itmes-center">
        <span>
          <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
        </span>
        <span>
          <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
        </span>
      </div>
      <div className="pb-2">&copy; Wanderlust Private Limited</div>
    </div>
  );
}

export default Footer;
