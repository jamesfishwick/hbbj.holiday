import clsx from "clsx";

import { Image } from "..";
import { getSiteMetaData } from "@utils/helpers";

export function Bio({ className }) {
  const { author } = getSiteMetaData();

  return (
    <div className={clsx(`flex items-center`, className)}>
      <Image
        className="flex-shrink-0 mb-0 mr-3 rounded-full w-14 h-14"
        src={require("../../../content/assets/profile.png")}
        webpSrc={require("../../../content/assets/profile.png?webp")}
        previewSrc={require("../../../content/assets/profile.png?lqip")}
        alt="Profile"
      />

      <p className="text-base leading-7">
        Compiled by <b className="font-semibold">{author.name}</b>{" "}
        {author.summary} <br />
        <em>
          <a href="https://www.instagram.com/sirlordselector/">
            Follow him on Instagram
          </a>
        </em>
      </p>
    </div>
  );
}
