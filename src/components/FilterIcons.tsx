import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCampground,
  faCow,
  faMountain,
  faPersonSwimming,
  faShip,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/navigation";

function FilterIcons() {
  const router = useRouter();

  const handleFilter = (category: string) => {
    router.push(`/?category=${encodeURIComponent(category)}`);
  };

  const icons = [
    { label: "Amazing Pools", icon: faPersonSwimming },
    { label: "Rooms", icon: faBed },
    { label: "Mountain", icon: faMountain },
    { label: "Arctic", icon: faSnowflake },
    { label: "Camping", icon: faCampground },
    { label: "Farms", icon: faCow },
    { label: "Boats", icon: faShip },
    { label: "Castles", icon: faFortAwesome },
  ];

  return (
    <div className="w-full px-4 py-4 overflow-x-auto">
      <div className="flex md:justify-evenly gap-6 md:gap-8 min-w-max md:min-w-0">
        {icons.map(({ label, icon }) => (
          <span
            key={label}
            onClick={() => handleFilter(label)}
            className="flex flex-col items-center opacity-70 hover:opacity-100 cursor-pointer text-sm md:text-base"
          >
            <FontAwesomeIcon icon={icon} className="text-xl md:text-2xl mb-1" />
            <p>{label}</p>
          </span>
        ))}
      </div>
    </div>
  );
}

export default FilterIcons;
