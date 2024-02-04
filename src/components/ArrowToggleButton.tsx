import { ButtonItem, PanelSectionRow } from "decky-frontend-lib";
import { FC, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

type Props = {
  cacheKey: string;
};

const ArrowToggleButton: FC<Props> = ({ children, cacheKey }) => {
  const [showSliders, setShowSliders] = useState(
    window.localStorage.getItem(cacheKey) === "true" || false
  );

  return (
    <>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          bottomSeparator={showSliders ? "none" : "thick"}
          style={{
            width: "100%",
            height: "20px",
            display: "flex", // Set the display to flex
            justifyContent: "center", // Center align horizontally
            alignItems: "center", // Center align vertically
          }}
          onClick={() => {
            window.localStorage.setItem(cacheKey, `${!showSliders}`);
            setShowSliders(!showSliders);
          }}
        >
          {showSliders ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </ButtonItem>
      </PanelSectionRow>
      {showSliders && children}
    </>
  );
};

export default ArrowToggleButton;
