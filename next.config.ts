import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* 92 is here for the CSTRIDER operator screenshots on /work/maritime-hmi. They are
       dense UI captures whose smallest labels are about 10px in the source, and the
       default quality of 75 re-encodes them into mush. 75 stays first so it remains the
       default for every other image on the site. */
    qualities: [75, 92],
  },
};

export default nextConfig;
