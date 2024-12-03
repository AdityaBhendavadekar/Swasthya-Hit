import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

const year = new Date().getFullYear();

export function Footer({ title, description, copyright }) {
  return (
    <footer className="relative bg-black text-white px-4 pt-8 pb-6">
      <div className="container mx-auto text-center">
        <div className="flex flex-col items-center">
          <div className="w-full px-4">
            <Typography variant="h4" className="mb-4 text-white">
              {title}
            </Typography>
            <Typography className="font-normal text-gray-300 lg:w-3/4 mx-auto">
              {description}
            </Typography>
          </div>
        </div>
        <hr className="my-6 border-gray-600" />
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto w-full px-4 text-center">
            <Typography
              variant="small"
              className="font-normal text-gray-300"
            >
              {copyright}
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  title: "Swashtya-hit",
  description: "Care Today for a Better Tomorrow..!!",
  copyright: (
    <>
      Copyright © {year} Swashtya-hit by{" "}
      <a
        href="https://www.creative-tim.com?ref=mtk"
        target="_blank"
        className="text-gray-300 transition-colors hover:text-gray-100"
      >
        TY-CS-A-G6
      </a>
      .
    </>
  ),
};

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  copyright: PropTypes.node,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;