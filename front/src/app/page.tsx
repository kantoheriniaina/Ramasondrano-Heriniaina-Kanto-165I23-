"use client";

import { DefaultDemo } from "./utils/navbar";
import { SidebarDemo } from "./utils/sidebarDemo";


function Home() {

  return (
    <>
      {/*debut  importation du navbar  */}
      <DefaultDemo/>
      {/* fin importation du navbar  */}

      {/* debut importation du sidebar  */}
      <SidebarDemo/>
      {/* fin importation du sidebar  */}

    </>
  );
}

export default Home;
